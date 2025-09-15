import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

function CameraCapture({ onCapture, onClose, isActive }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    try {
      setIsCapturing(true);
      setError(null);

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      // Convert base64 to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      
      // Create a file object
      const file = new File([blob], `medication-photo-${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      console.log('Photo captured:', {
        size: (file.size / 1024).toFixed(1) + 'KB',
        type: file.type
      });

      onCapture(file, imageSrc);
    } catch (err) {
      console.error('Failed to capture photo:', err);
      setError(err.message);
    } finally {
      setIsCapturing(false);
    }
  }, [onCapture]);

  const switchCamera = useCallback(() => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  }, []);

  const handleUserMediaError = useCallback((error) => {
    console.error('Camera access error:', error);
    setError('Camera access denied or not available. Please check your permissions.');
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          📸 Capture Medication Label
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
          title="Close Camera"
        >
          ✕
        </button>
      </div>

      {/* Camera View */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {error ? (
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📷</div>
            <h3>Camera Not Available</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn"
              style={{ margin: '10px' }}
            >
              Refresh Page
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maxWidth: '600px',
                borderRadius: '8px'
              }}
            />
            
            {/* Capture Guide Overlay */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              📋 Position the medication label clearly in frame
            </div>

            {/* Focus Frame */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '200px',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              pointerEvents: 'none'
            }}>
              <div style={{
                position: 'absolute',
                top: '-1px',
                left: '-1px',
                right: '-1px',
                bottom: '-1px',
                border: '1px solid rgba(0, 123, 255, 0.6)',
                borderRadius: '8px',
                boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)'
              }} />
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Switch Camera */}
        <button
          onClick={switchCamera}
          disabled={isCapturing}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Switch Camera"
        >
          🔄
        </button>

        {/* Capture Button */}
        <button
          onClick={capture}
          disabled={isCapturing || !!error}
          style={{
            background: isCapturing ? '#ffc107' : '#007bff',
            border: '4px solid white',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            color: 'white',
            fontSize: '24px',
            cursor: isCapturing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title={isCapturing ? 'Capturing...' : 'Capture Photo'}
        >
          {isCapturing ? '⏳' : '📷'}
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          disabled={isCapturing}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Cancel"
        >
          ✕
        </button>
      </div>

      {/* Tips */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        💡 <strong>Tips:</strong> Use good lighting • Hold camera steady • Ensure text is readable • Avoid shadows
      </div>
    </div>
  );
}

export default CameraCapture;