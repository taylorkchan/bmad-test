const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const OpenAI = require('openai');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir()) // Use OS-specific temp directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ocr-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Deleted temporary file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
  }
};

router.post('/process-image', upload.single('image'), async (req, res) => {
  let filePath = null;
  
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured on server'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    filePath = req.file.path;
    console.log(`Processing OCR for file: ${filePath}`);

    // Convert image to base64
    const imageBuffer = await fs.readFile(filePath);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

    // Prepare the prompt for medical text extraction
    const systemPrompt = `You are an expert OCR system specialized in extracting medical information from pill bottles, medication labels, and prescription labels. You have comprehensive medical knowledge about medications.

Extract the following information from the image and return it as a JSON object:
- medicationName: The primary medication/drug name
- genericName: Generic name if available
- dosage: Dosage strength (e.g., "500mg", "10ml", "1 tablet")
- quantity: Number of pills/volume in container
- instructions: Usage instructions (e.g., "Take twice daily with food")
- manufacturer: Drug manufacturer if visible
- rxNumber: Prescription number if visible
- prescriber: Doctor/prescriber name if visible
- pharmacy: Pharmacy name if visible
- expirationDate: Expiration date if visible

Additionally, use your medical knowledge to provide:
- mechanism: How the medication works (mechanism of action) - brief explanation
- indications: What conditions/illnesses this medication is commonly used to treat
- sideEffects: Common side effects users should be aware of
- warnings: Important warnings or precautions for this medication

Important guidelines:
1. Only extract text that is clearly visible and readable from the image
2. For medical knowledge fields (mechanism, indications, sideEffects, warnings), use your knowledge of the identified medication
3. If medication is not identifiable or information is unclear, leave fields empty or null
4. Be precise with dosages and measurements
5. Maintain original spelling and formatting for medication names
6. Keep medical information concise but informative
7. Extract ALL visible text as rawText for reference

Return the response in this exact JSON format:
{
  "medicationName": "",
  "genericName": "",
  "dosage": "",
  "quantity": "",
  "instructions": "",
  "manufacturer": "",
  "rxNumber": "",
  "prescriber": "",
  "pharmacy": "",
  "expirationDate": "",
  "mechanism": "",
  "indications": "",
  "sideEffects": "",
  "warnings": "",
  "confidence": "high|medium|low",
  "rawText": "all visible text from the image",
  "extractedFields": ["list of successfully extracted fields"]
}`;

    // Make the API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all medical information from this medication label or pill bottle image:"
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.1
    });

    // Parse the response
    const extractedText = response.choices[0]?.message?.content;
    
    if (!extractedText) {
      throw new Error('No response from OpenAI API');
    }

    let parsedData;
    try {
      const cleanedText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanedText);
      
      // Ensure all expected fields exist
      parsedData = {
        medicationName: parsedData.medicationName || '',
        genericName: parsedData.genericName || '',
        dosage: parsedData.dosage || '',
        quantity: parsedData.quantity || '',
        instructions: parsedData.instructions || '',
        manufacturer: parsedData.manufacturer || '',
        rxNumber: parsedData.rxNumber || '',
        prescriber: parsedData.prescriber || '',
        pharmacy: parsedData.pharmacy || '',
        expirationDate: parsedData.expirationDate || '',
        mechanism: parsedData.mechanism || '',
        indications: parsedData.indications || '',
        sideEffects: parsedData.sideEffects || '',
        warnings: parsedData.warnings || '',
        confidence: parsedData.confidence || 'medium',
        rawText: parsedData.rawText || extractedText,
        extractedFields: parsedData.extractedFields || []
      };
      
    } catch (parseError) {
      console.warn('Could not parse JSON response, attempting regex extraction');
      
      const medicationMatch = extractedText.match(/(?:medication|drug)\s*name[:\s]*([^\n,]+)/i);
      const dosageMatch = extractedText.match(/dosage[:\s]*([^\n,]+)/i);
      const instructionsMatch = extractedText.match(/instructions[:\s]*([^\n,]+)/i);
      
      parsedData = {
        medicationName: medicationMatch ? medicationMatch[1].trim() : '',
        genericName: '',
        dosage: dosageMatch ? dosageMatch[1].trim() : '',
        quantity: '',
        instructions: instructionsMatch ? instructionsMatch[1].trim() : '',
        manufacturer: '',
        rxNumber: '',
        prescriber: '',
        pharmacy: '',
        expirationDate: '',
        mechanism: '',
        indications: '',
        sideEffects: '',
        warnings: '',
        confidence: 'medium',
        rawText: extractedText,
        extractedFields: []
      };
    }

    console.log('OCR processing completed successfully');

    // Return the result
    res.json({
      success: true,
      rawText: parsedData.rawText || extractedText,
      confidence: mapConfidenceToNumber(parsedData.confidence),
      parsedData: {
        medicationName: parsedData.medicationName || '',
        genericName: parsedData.genericName || '',
        dosage: parsedData.dosage || '',
        quantity: parsedData.quantity || '',
        instructions: parsedData.instructions || '',
        manufacturer: parsedData.manufacturer || '',
        rxNumber: parsedData.rxNumber || '',
        prescriber: parsedData.prescriber || '',
        pharmacy: parsedData.pharmacy || '',
        expirationDate: parsedData.expirationDate || '',
        mechanism: parsedData.mechanism || '',
        indications: parsedData.indications || '',
        sideEffects: parsedData.sideEffects || '',
        warnings: parsedData.warnings || '',
        confidence: parsedData.confidence || 'medium',
        extractedFields: parsedData.extractedFields || [],
        suggestions: generateSuggestions(parsedData)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      rawText: '',
      confidence: 0,
      parsedData: null,
      timestamp: new Date().toISOString()
    });
  } finally {
    // ALWAYS delete the uploaded file, even if processing failed
    if (filePath) {
      await deleteFile(filePath);
    }
  }
});

function mapConfidenceToNumber(confidenceStr) {
  switch (confidenceStr?.toLowerCase()) {
    case 'high': return 90;
    case 'medium': return 70;
    case 'low': return 50;
    default: return 70;
  }
}

function generateSuggestions(parsedData) {
  const suggestions = [];
  
  const hasValidMedicationName = parsedData.medicationName && parsedData.medicationName.trim().length > 0;
  const hasValidDosage = parsedData.dosage && parsedData.dosage.trim().length > 0;
  const hasValidInstructions = parsedData.instructions && parsedData.instructions.trim().length > 0;
  
  if (!hasValidMedicationName) {
    suggestions.push('Medication name not clearly detected - please verify manually');
  }
  
  if (!hasValidDosage) {
    suggestions.push('Dosage information not found - please add manually');
  }

  if (!hasValidInstructions) {
    suggestions.push('Usage instructions not found - please add manually');
  }

  if (parsedData.confidence === 'high' && hasValidMedicationName && hasValidDosage) {
    suggestions.push('✅ High confidence extraction - please verify details are correct');
  } else if (hasValidMedicationName && hasValidDosage && hasValidInstructions) {
    suggestions.push('✅ Successfully extracted medication details - please review for accuracy');
  } else if (hasValidMedicationName || hasValidDosage) {
    suggestions.push('⚠️ Partial extraction successful - please add missing information');
  }

  if (parsedData.confidence === 'low') {
    suggestions.push('⚠️ Image quality could be better - try better lighting or focus');
  }

  if (suggestions.length === 0 || suggestions.every(s => s.startsWith('✅'))) {
    suggestions.push('✅ OCR processing completed successfully');
  }

  return suggestions;
}

module.exports = router;