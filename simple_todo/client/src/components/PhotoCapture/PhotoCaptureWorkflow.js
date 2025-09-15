import React, { useState, useCallback, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import ImagePreview from './ImagePreview';
import DataVerification from './DataVerification';
import { gptVisionOCRService } from '../../utils/gptVisionOCR';
import { ImageProcessor } from '../../utils/imageProcessing';

const STEPS = {
  CAMERA: 'camera',
  PREVIEW: 'preview', 
  PROCESSING: 'processing',
  VERIFICATION: 'verification'
};

function PhotoCaptureWorkflow({ 
  onMedicationExtracted, 
  onCancel,
  initialStep = STEPS.CAMERA,
  preloadedFile = null
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [capturedImage, setCapturedImage] = useState(preloadedFile);
  const [imageSrc, setImageSrc] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState(null);

  // Handle preloaded file
  useEffect(() => {
    if (preloadedFile && initialStep === STEPS.PREVIEW) {
      const convertFileToDataURL = async () => {
        try {
          const dataUrl = await ImageProcessor.fileToDataURL(preloadedFile);
          setImageSrc(dataUrl);
          console.log('Preloaded file converted to data URL for preview');
        } catch (err) {
          console.error('Failed to convert preloaded file:', err);
          setError('Failed to load uploaded image');
        }
      };
      convertFileToDataURL();
    }
  }, [preloadedFile, initialStep]);

  // Reset workflow
  const resetWorkflow = useCallback(() => {
    setCapturedImage(null);
    setImageSrc(null);
    setOcrResult(null);
    setIsProcessing(false);
    setProcessingProgress(0);
    setError(null);
    setCurrentStep(STEPS.CAMERA);
  }, []);

  // Handle photo capture from camera
  const handlePhotoCapture = useCallback((file, dataUrl) => {
    console.log('Photo captured via camera:', file.name);
    setCapturedImage(file);
    setImageSrc(dataUrl);
    setCurrentStep(STEPS.PREVIEW);
  }, []);

  // Handle photo upload from file system
  const handlePhotoUpload = useCallback(async (file) => {
    console.log('Photo uploaded from file system:', file.name);
    
    try {
      // Validate the uploaded file
      const validation = ImageProcessor.validateImageFile(file, 10);
      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return;
      }

      // Convert to data URL for preview
      const dataUrl = await ImageProcessor.fileToDataURL(file);
      
      setCapturedImage(file);
      setImageSrc(dataUrl);
      setCurrentStep(STEPS.PREVIEW);
    } catch (err) {
      console.error('Failed to process uploaded file:', err);
      alert('Failed to process the uploaded image. Please try again.');
    }
  }, []);

  // Process image with OCR
  const handleProcessImage = useCallback(async (imageData) => {
    if (!capturedImage) {
      alert('No image to process');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);
    setCurrentStep(STEPS.PROCESSING);

    try {
      console.log('Starting OCR processing...');

      // Set up progress callback
      gptVisionOCRService.setProgressCallback((progress) => {
        setProcessingProgress(progress);
      });

      // Optimize image for OCR with enhanced processing
      console.log('Optimizing image for OCR...');
      setProcessingProgress(5);
      const optimizedImage = await ImageProcessor.optimizeForOCR(capturedImage, {
        maxSizeMB: 4, // GPT-4 Vision can handle larger images better
        maxWidthOrHeight: 2000,
        initialQuality: 0.92,
        enhance: true,
        autoRotate: true
      });

      setProcessingProgress(15);

      // Process with backend OCR service
      console.log('Processing with backend OCR service...');
      const result = await gptVisionOCRService.processImage(optimizedImage);
      
      console.log('OCR processing complete:', result);
      setOcrResult(result);
      
      if (result.success) {
        setCurrentStep(STEPS.VERIFICATION);
      } else {
        setError(result.error || 'OCR processing failed');
        // Stay in processing step to show error
      }
      
    } catch (err) {
      console.error('OCR processing error:', err);
      setError(`OCR processing failed: ${err.message}`);
      // Stay in processing step to show the error, don't go back to camera
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [capturedImage]);

  // Handle verified medication data
  const handleMedicationConfirm = useCallback((medicationData) => {
    const enrichedData = {
      ...medicationData,
      extractedVia: 'photo_recognition',
      ocrConfidence: ocrResult?.confidence || 0,
      processedAt: new Date().toISOString()
    };
    
    onMedicationExtracted(enrichedData);
  }, [ocrResult, onMedicationExtracted]);

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.CAMERA:
        return (
          <div>
            <CameraCapture
              isActive={true}
              onCapture={handlePhotoCapture}
              onClose={onCancel}
            />
            
            {/* Direct Upload Option */}
            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              padding: '20px',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4 style={{ marginTop: 0, color: '#666' }}>📁 Or Upload Image Directly</h4>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handlePhotoUpload(file);
                  }
                }}
                style={{ display: 'none' }}
                id="direct-upload"
              />
              <label 
                htmlFor="direct-upload"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                🖼️ Choose Image File
              </label>
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '12px', 
                color: '#666' 
              }}>
                Supports: JPG, PNG, WebP (Max 10MB)
              </p>
            </div>
          </div>
        );

      case STEPS.PREVIEW:
        return (
          <ImagePreview
            imageSrc={imageSrc}
            imageFile={capturedImage}
            isProcessing={isProcessing}
            onRetake={resetWorkflow}
            onProcessImage={handleProcessImage}
            onUploadPhoto={handlePhotoUpload}
          />
        );

      case STEPS.PROCESSING:
        return (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              {error ? '❌' : '🔍'}
            </div>
            
            {error ? (
              <>
                <h3>Processing Failed</h3>
                <p style={{ color: '#dc3545', marginBottom: '20px' }}>{error}</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => handleProcessImage(capturedImage)} className="btn">
                    🔄 Try Again
                  </button>
                  <button onClick={resetWorkflow} className="btn btn-secondary">
                    📷 New Photo
                  </button>
                  <button onClick={onCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Processing Your Image</h3>
                <p>Extracting medication information...</p>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  margin: '20px auto',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${processingProgress}%`,
                    height: '100%',
                    backgroundColor: '#007bff',
                    transition: 'width 0.3s ease',
                    borderRadius: '4px'
                  }} />
                </div>
                
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {processingProgress}% complete
                </div>
                
                <div style={{
                  marginTop: '20px',
                  fontSize: '12px',
                  color: '#999'
                }}>
                  This may take 10-30 seconds depending on image quality
                </div>
              </>
            )}
          </div>
        );

      case STEPS.VERIFICATION:
        return (
          <DataVerification
            ocrResult={ocrResult}
            onConfirm={handleMedicationConfirm}
            onRetry={resetWorkflow}
            onCancel={onCancel}
            isSubmitting={false}
          />
        );

      default:
        return (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>Unknown Step</h3>
            <button onClick={resetWorkflow} className="btn">
              Start Over
            </button>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Step Indicator */}
      {currentStep !== STEPS.CAMERA && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Photo Recognition Workflow</span>
            <span>Step {Object.values(STEPS).indexOf(currentStep) + 1} of {Object.values(STEPS).length}</span>
          </div>
          
          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: '5px' }}>
            {Object.values(STEPS).map((step, index) => {
              const isCurrent = step === currentStep;
              const isCompleted = Object.values(STEPS).indexOf(currentStep) > index;
              
              return (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: isCurrent ? '#007bff' : isCompleted ? '#28a745' : '#e9ecef',
                    borderRadius: '2px'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderStep()}
    </div>
  );
}

export default PhotoCaptureWorkflow;