// Image processing utilities for better OCR results
export class ImageProcessor {
  
  // Optimize image for OCR processing with advanced enhancements
  static async optimizeForOCR(file, options = {}) {
    const defaultOptions = {
      maxSizeMB: 1.5, // Smaller for better performance
      maxWidthOrHeight: 1600, // Optimal for OCR
      initialQuality: 0.88,
      enhance: true,
      autoRotate: true
    };

    const finalOptions = { ...defaultOptions, ...options };
    const startTime = performance.now();

    try {
      console.log('Optimizing image for OCR...', {
        originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        type: file.type,
        enhance: finalOptions.enhance
      });

      // Always process through canvas for consistent optimization
      let canvas = await this.fileToCanvas(file, finalOptions.maxWidthOrHeight);
      
      // Auto-rotate based on EXIF if supported
      if (finalOptions.autoRotate) {
        canvas = await this._autoRotateCanvas(canvas, file);
      }
      
      // Apply OCR-specific enhancements
      if (finalOptions.enhance) {
        canvas = this.enhanceForOCR(canvas, {
          contrast: 1.25,
          brightness: 12,
          sharpen: true,
          denoise: true,
          autoAdjust: true
        });
      }
      
      // Convert to optimized blob
      const optimizedBlob = await this.canvasToBlob(canvas, finalOptions.initialQuality);
      
      // Create a new File object from the blob
      const optimizedFile = new File([optimizedBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      const processingTime = Math.round(performance.now() - startTime);
      
      console.log('Image optimization complete:', {
        processingTime: processingTime + 'ms',
        newSize: (optimizedFile.size / 1024 / 1024).toFixed(2) + 'MB',
        compressionRatio: ((1 - optimizedFile.size / file.size) * 100).toFixed(1) + '%',
        dimensions: `${canvas.width}x${canvas.height}`
      });

      return optimizedFile;
    } catch (error) {
      console.error('Image optimization failed:', error);
      // Return original file if optimization fails
      return file;
    }
  }

  // Auto-rotate canvas based on EXIF orientation
  static async _autoRotateCanvas(canvas, file) {
    try {
      // Simple heuristic: if image is much wider than tall, it might need rotation
      const aspectRatio = canvas.width / canvas.height;
      
      // If extremely wide (like a rotated phone photo), rotate 90 degrees
      if (aspectRatio > 2.5) {
        return this._rotateCanvas(canvas, 90);
      }
      
      // If extremely tall, might need 180 degree rotation
      if (aspectRatio < 0.4) {
        return this._rotateCanvas(canvas, -90);
      }
      
      return canvas;
    } catch (error) {
      console.warn('Auto-rotation failed:', error.message);
      return canvas;
    }
  }

  // Rotate canvas by specified degrees
  static _rotateCanvas(canvas, degrees) {
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    
    const radians = (degrees * Math.PI) / 180;
    
    // Calculate new canvas dimensions after rotation
    if (Math.abs(degrees) === 90 || Math.abs(degrees) === 270) {
      newCanvas.width = canvas.height;
      newCanvas.height = canvas.width;
    } else {
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
    }
    
    // Rotate and draw
    ctx.translate(newCanvas.width / 2, newCanvas.height / 2);
    ctx.rotate(radians);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    
    return newCanvas;
  }

  // Convert file to canvas with optional resize
  static fileToCanvas(file, maxDimension = null) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let { width, height } = img;

        // Resize if needed
        if (maxDimension && (width > maxDimension || height > maxDimension)) {
          if (width > height) {
            height = height * (maxDimension / width);
            width = maxDimension;
          } else {
            width = width * (maxDimension / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        URL.revokeObjectURL(img.src);
        resolve(canvas);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Convert file to data URL for display
  static fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Validate image file type and size
  static validateImageFile(file, maxSizeMB = 10) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    if (!validTypes.includes(file.type)) {
      errors.push(`Invalid file type. Please use: ${validTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      errors.push(`File too large. Maximum size is ${maxSizeMB}MB`);
    }

    if (file.size < 1024) { // Less than 1KB is suspicious
      errors.push('File seems too small to be a valid image');
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified)
      }
    };
  }

  // Create canvas from image for further processing
  static imageToCanvas(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    ctx.drawImage(imageElement, 0, 0);
    return canvas;
  }

  // Apply advanced image enhancements for better OCR
  static enhanceForOCR(canvas, options = {}) {
    const {
      contrast = 1.3,
      brightness = 15,
      sharpen = true,
      denoise = true,
      autoAdjust = true
    } = options;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Auto-adjust levels if enabled
    if (autoAdjust) {
      this._autoAdjustLevels(data);
    }

    // Apply denoise filter if enabled
    if (denoise) {
      this._applyDenoiseFilter(data, canvas.width, canvas.height);
    }

    // Apply contrast and brightness enhancement
    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast and brightness to RGB channels
      data[i] = Math.min(255, Math.max(0, contrast * data[i] + brightness));         // R
      data[i + 1] = Math.min(255, Math.max(0, contrast * data[i + 1] + brightness)); // G
      data[i + 2] = Math.min(255, Math.max(0, contrast * data[i + 2] + brightness)); // B
      // Alpha channel (i + 3) remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply sharpening if enabled
    if (sharpen) {
      this._applySharpenFilter(ctx, canvas.width, canvas.height);
    }

    return canvas;
  }

  // Auto-adjust image levels for optimal contrast
  static _autoAdjustLevels(data) {
    // Find min and max values for each channel
    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      minR = Math.min(minR, data[i]);
      maxR = Math.max(maxR, data[i]);
      minG = Math.min(minG, data[i + 1]);
      maxG = Math.max(maxG, data[i + 1]);
      minB = Math.min(minB, data[i + 2]);
      maxB = Math.max(maxB, data[i + 2]);
    }

    // Calculate scaling factors
    const scaleR = maxR > minR ? 255 / (maxR - minR) : 1;
    const scaleG = maxG > minG ? 255 / (maxG - minG) : 1;
    const scaleB = maxB > minB ? 255 / (maxB - minB) : 1;

    // Apply level adjustment
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - minR) * scaleR));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - minG) * scaleG));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - minB) * scaleB));
    }
  }

  // Apply noise reduction filter
  static _applyDenoiseFilter(data, width, height) {
    const newData = new Uint8ClampedArray(data);
    
    // Simple 3x3 median filter for noise reduction
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Apply median filter to each color channel
        for (let c = 0; c < 3; c++) {
          const neighbors = [];
          
          // Collect neighboring pixel values
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const neighborIdx = ((y + dy) * width + (x + dx)) * 4 + c;
              neighbors.push(data[neighborIdx]);
            }
          }
          
          // Sort and take median
          neighbors.sort((a, b) => a - b);
          newData[idx + c] = neighbors[4]; // Middle value (median)
        }
      }
    }
    
    // Copy filtered data back
    for (let i = 0; i < data.length; i++) {
      data[i] = newData[i];
    }
  }

  // Apply sharpening filter
  static _applySharpenFilter(ctx, width, height) {
    // Sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data);
    
    // Apply convolution
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              const pixelIdx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[pixelIdx] * kernel[kernelIdx];
            }
          }
          
          newData[idx + c] = Math.min(255, Math.max(0, sum));
        }
      }
    }
    
    const newImageData = new ImageData(newData, width, height);
    ctx.putImageData(newImageData, 0, 0);
  }

  // Convert canvas to blob for API calls
  static canvasToBlob(canvas, quality = 0.8) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });
  }

  // Get image dimensions without loading full image
  static getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  // Batch process multiple images
  static async processImagesBatch(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      try {
        const validation = this.validateImageFile(file);
        if (!validation.isValid) {
          results.push({
            file: file.name,
            success: false,
            errors: validation.errors
          });
          continue;
        }

        const optimized = await this.optimizeForOCR(file, options);
        results.push({
          file: file.name,
          success: true,
          optimizedFile: optimized,
          originalSize: file.size,
          optimizedSize: optimized.size
        });
      } catch (error) {
        results.push({
          file: file.name,
          success: false,
          errors: [error.message]
        });
      }
    }

    return results;
  }
}