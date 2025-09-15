import { createWorker } from 'tesseract.js';
// import { measureOCRPerformance } from './performanceMonitor';

// OCR Configuration and utilities
export class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
    this.initPromise = null;
    this.processingQueue = [];
    this.isProcessing = false;
  }

  async initialize() {
    // Return existing initialization promise if already in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitialized && this.worker) {
      return this.worker;
    }

    // Create and cache the initialization promise
    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  async _doInitialize() {
    try {
      console.log('Initializing OCR worker...');
      
      // Use more optimized worker configuration with error handling
      this.worker = await createWorker('eng', 1, {
        // cachePath: './tesseract-cache', // Disable caching to avoid potential issues
        logger: m => {
          try {
            if (m && m.status === 'recognizing text') {
              const progress = Math.round((m.progress || 0) * 100);
              if (this.onProgress && typeof this.onProgress === 'function') {
                this.onProgress(progress);
              }
            }
          } catch (loggerError) {
            console.debug('Logger error:', loggerError.message);
          }
        },
        // Optimize worker settings for performance
        workerBlobURL: false,
        workerPath: undefined // Use default optimized path
      }).catch(error => {
        console.error('Worker creation failed:', error);
        throw new Error(`Failed to create OCR worker: ${error.message}`);
      });

      // Enhanced OCR parameters for better medication text recognition
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,()%-+/: ',
        tessedit_pageseg_mode: '6', // Uniform block of text
        preserve_interword_spaces: '1',
        tessedit_ocr_engine_mode: '1', // LSTM engine for better accuracy
        // Performance optimizations
        classify_enable_learning: '0',
        classify_enable_adaptive_matcher: '0',
        textord_really_old_xheight: '1',
        segment_penalty_dict_frequent_word: '0',
        // Improve text detection
        textord_noise_sizefraction: '10',
        textord_noise_translimit: '16'
      });

      this.isInitialized = true;
      this.initPromise = null; // Clear promise after successful init
      console.log('OCR worker initialized successfully with optimizations');
      return this.worker;
    } catch (error) {
      this.initPromise = null; // Clear promise on error
      console.error('Failed to initialize OCR worker:', error);
      throw error;
    }
  }

  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  async processImage(imageFile) {
    return new Promise((resolve, reject) => {
      // Add to processing queue
      this.processingQueue.push({ imageFile, resolve, reject });
      this._processQueue();
    });
  }

  async _processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Ensure worker is initialized
      await this.initialize();

      // Process items in queue
      while (this.processingQueue.length > 0) {
        const { imageFile, resolve, reject } = this.processingQueue.shift();
        
        try {
          const result = await this._processSingleImage(imageFile);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async _processSingleImage(imageFile) {
    // Start performance monitoring
    // measureOCRPerformance.startImageProcessing(imageFile);
    
    try {
      console.log('Processing image with OCR...', {
        fileName: imageFile.name,
        fileSize: `${(imageFile.size / 1024).toFixed(1)}KB`,
        fileType: imageFile.type
      });

      const startTime = performance.now();
      
      // Pre-process image for better OCR results
      // measureOCRPerformance.startOCROperation('preprocessing');
      const processedImage = await this._preprocessImage(imageFile);
      // measureOCRPerformance.endOCROperation('preprocessing', {
      //   originalSize: imageFile.size,
      //   processedSize: processedImage.size || processedImage.size
      // });
      
      // Recognize text with retry logic
      // measureOCRPerformance.startOCROperation('recognition');
      let result = await this._recognizeWithRetry(processedImage, 2);
      // measureOCRPerformance.endOCROperation('recognition', {
      //   confidence: result.confidence,
      //   textLength: result.text.length
      // });
      
      const processingTime = Math.round(performance.now() - startTime);
      console.log(`OCR completed in ${processingTime}ms. Confidence:`, result.confidence);
      
      // Parse the extracted text for medication information
      // measureOCRPerformance.startOCROperation('parsing');
      const parsedData = this.parseMedicationText(result.text, result.confidence);
      // measureOCRPerformance.endOCROperation('parsing');
      
      const finalResult = {
        success: true,
        rawText: result.text,
        confidence: Math.round(result.confidence),
        parsedData,
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString()
      };
      
      // End performance monitoring
      // measureOCRPerformance.endImageProcessing(finalResult);
      
      return finalResult;
    } catch (error) {
      console.error('OCR processing failed:', error);
      
      const errorResult = {
        success: false,
        error: error.message,
        rawText: '',
        confidence: 0,
        parsedData: null,
        timestamp: new Date().toISOString()
      };
      
      // End performance monitoring with error
      // measureOCRPerformance.endImageProcessing(errorResult);
      
      return errorResult;
    }
  }

  async _preprocessImage(imageFile) {
    // Return the original file if it's already small enough
    if (imageFile.size < 1024 * 1024) { // Less than 1MB
      return imageFile;
    }

    try {
      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!canvas || !ctx) {
        throw new Error('Canvas not supported');
      }
      
      // Load image with error handling
      const img = await this._loadImage(imageFile);
      
      // Optimize dimensions (max 1200px on longest side)
      const maxDimension = 1200;
      let { width, height } = img;
      
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw with image enhancements (with fallback)
      try {
        ctx.filter = 'contrast(120%) brightness(110%) saturate(120%)';
      } catch (filterError) {
        console.debug('CSS filters not supported, using basic drawing');
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert back to blob with optimal quality
      return new Promise((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          }, 'image/jpeg', 0.85);
        } catch (blobError) {
          reject(blobError);
        }
      });
    } catch (error) {
      console.warn('Image preprocessing failed, using original:', error.message);
      return imageFile;
    }
  }

  _loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  async _recognizeWithRetry(imageFile, maxRetries = 2) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.worker.recognize(imageFile);
        return {
          text: result.data.text,
          confidence: result.data.confidence
        };
      } catch (error) {
        lastError = error;
        console.warn(`OCR attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Wait briefly before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    throw lastError;
  }

  parseMedicationText(text, confidence) {
    if (!text || confidence < 30) {
      return {
        medicationName: '',
        dosage: '',
        instructions: '',
        confidence: 'low',
        suggestions: ['Text quality too low for reliable extraction']
      };
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Common medication patterns
    const medicationPatterns = {
      // Medication names (usually first significant line, often in caps)
      name: /^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/,
      
      // Dosage patterns (mg, ml, tablets, etc.)
      dosage: /(\d+(?:\.\d+)?\s*(?:mg|ml|g|mcg|units?|tablets?|caps?|capsules?))/gi,
      
      // Quantity patterns
      quantity: /(?:qty|quantity|#)\s*(\d+)/i,
      
      // Instructions (take, use, apply, etc.)
      instructions: /(take|use|apply|inject)\s+([^\n]+)/gi,
      
      // Generic name (often in parentheses or after "generic:")
      generic: /(?:generic|generic\s*name)\s*:?\s*([a-zA-Z\s]+)/i
    };

    const parsed = {
      medicationName: '',
      dosage: '',
      instructions: '',
      quantity: '',
      generic: '',
      confidence: confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low',
      suggestions: []
    };

    // Extract medication name (usually the first meaningful line in caps)
    const potentialNames = lines.filter(line => 
      line.length > 2 && 
      line.length < 50 && 
      /^[A-Z][a-zA-Z\s]*$/.test(line)
    );
    
    if (potentialNames.length > 0) {
      parsed.medicationName = potentialNames[0];
    } else {
      // Fallback: take the first substantial line
      const substantialLines = lines.filter(line => line.length > 3 && line.length < 30);
      if (substantialLines.length > 0) {
        parsed.medicationName = substantialLines[0];
      }
    }

    // Extract dosage information
    const dosageMatches = text.match(medicationPatterns.dosage);
    if (dosageMatches && dosageMatches.length > 0) {
      parsed.dosage = dosageMatches[0];
    }

    // Extract quantity
    const quantityMatch = text.match(medicationPatterns.quantity);
    if (quantityMatch) {
      parsed.quantity = quantityMatch[1];
    }

    // Extract instructions
    const instructionMatches = text.match(medicationPatterns.instructions);
    if (instructionMatches && instructionMatches.length > 0) {
      parsed.instructions = instructionMatches[0];
    }

    // Extract generic name
    const genericMatch = text.match(medicationPatterns.generic);
    if (genericMatch) {
      parsed.generic = genericMatch[1].trim();
    }

    // Generate suggestions based on confidence and extracted data
    if (confidence < 70) {
      parsed.suggestions.push('Image quality could be better - try better lighting or focus');
    }
    
    if (!parsed.medicationName) {
      parsed.suggestions.push('Medication name not clearly detected - please verify manually');
    }
    
    if (!parsed.dosage) {
      parsed.suggestions.push('Dosage information not found - please add manually');
    }

    if (parsed.confidence === 'high' && parsed.medicationName && parsed.dosage) {
      parsed.suggestions.push('High confidence extraction - please verify details');
    }

    return parsed;
  }

  async terminate() {
    if (this.worker) {
      console.log('Terminating OCR worker...');
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instance
export const ocrService = new OCRService();