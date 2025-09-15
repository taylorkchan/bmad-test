// GPT-4 Vision OCR Service for medical text extraction - Backend Version
export class GPTVisionOCRService {
  constructor() {
    this.processingQueue = [];
    this.isProcessing = false;
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001/api';
  }

  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  async processImage(imageFile) {
    return new Promise((resolve, reject) => {
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
    try {
      console.log('Processing image with backend OCR service...', {
        fileName: imageFile.name,
        fileSize: `${(imageFile.size / 1024).toFixed(1)}KB`,
        fileType: imageFile.type
      });

      const startTime = performance.now();

      // Update progress
      if (this.onProgress) this.onProgress(10);

      // Create FormData to upload the file
      const formData = new FormData();
      formData.append('image', imageFile);

      if (this.onProgress) this.onProgress(30);

      // Make the API call to backend
      const response = await fetch(`${this.apiBaseUrl}/ocr/process-image`, {
        method: 'POST',
        body: formData
      });

      if (this.onProgress) this.onProgress(80);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (this.onProgress) this.onProgress(100);

      const processingTime = Math.round(performance.now() - startTime);
      console.log(`Backend OCR completed in ${processingTime}ms`);

      // Debug logging
      console.log('Backend OCR Extracted Data:', {
        success: result.success,
        medicationName: result.parsedData?.medicationName,
        dosage: result.parsedData?.dosage,
        instructions: result.parsedData?.instructions,
        confidence: result.confidence
      });

      return {
        ...result,
        processingTimeMs: processingTime
      };

    } catch (error) {
      console.error('Backend OCR processing failed:', error);
      
      const errorResult = {
        success: false,
        error: error.message,
        rawText: '',
        confidence: 0,
        parsedData: null,
        timestamp: new Date().toISOString()
      };

      return errorResult;
    }
  }

  async terminate() {
    // Clean up processing queue
    this.processingQueue = [];
    this.isProcessing = false;
    console.log('Backend OCR service terminated');
  }
}

// Singleton instance
export const gptVisionOCRService = new GPTVisionOCRService();