import React from 'react';

function ImagePreview({ 
  imageSrc, 
  imageFile, 
  onRetake, 
  onProcessImage,
  onUploadPhoto,
  isProcessing 
}) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && onUploadPhoto) {
      onUploadPhoto(file);
    }
  };

  if (!imageSrc && !imageFile) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📷</div>
        <h3>No Image Selected</h3>
        <p>Capture a photo or upload an image to continue</p>
        
        {/* File Upload Option */}
        <div style={{ marginTop: '20px' }}>
          <label 
            htmlFor="photo-upload"
            className="btn btn-secondary"
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            📁 Upload Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    );
  }

  const fileSize = imageFile ? (imageFile.size / 1024).toFixed(1) + 'KB' : 'Unknown';
  
  return (
    <div className="card">
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📸 Captured Image
          {imageFile && (
            <span style={{ 
              fontSize: '12px', 
              fontWeight: '400', 
              color: '#666',
              backgroundColor: '#f0f0f0',
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              {fileSize}
            </span>
          )}
        </h3>
      </div>

      {/* Image Display */}
      <div style={{ 
        marginBottom: '20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '10px'
      }}>
        <img
          src={imageSrc || (imageFile ? URL.createObjectURL(imageFile) : '')}
          alt="Captured medication"
          style={{
            maxWidth: '100%',
            maxHeight: '400px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      </div>

      {/* Image Info */}
      {imageFile && (
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          marginBottom: '15px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
            <div><strong>Size:</strong> {fileSize}</div>
            <div><strong>Type:</strong> {imageFile.type}</div>
            <div><strong>Captured:</strong> {new Date().toLocaleTimeString()}</div>
            <div><strong>Status:</strong> 
              <span style={{ 
                color: isProcessing ? '#ffc107' : '#28a745',
                marginLeft: '4px'
              }}>
                {isProcessing ? 'Processing...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap',
        justifyContent: 'center' 
      }}>
        <button
          onClick={onRetake}
          className="btn btn-secondary"
          disabled={isProcessing}
        >
          📷 Retake Photo
        </button>

        <button
          onClick={() => onProcessImage(imageFile || imageSrc)}
          className="btn btn-success"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>⏳ Processing...</>
          ) : (
            <>🔍 Extract Text</>
          )}
        </button>

        {/* Alternative Upload Option */}
        <label 
          htmlFor="replace-photo"
          className={`btn btn-secondary ${isProcessing ? 'disabled' : ''}`}
          style={{ 
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            display: 'inline-block'
          }}
        >
          📁 Upload Different Photo
        </label>
        <input
          id="replace-photo"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isProcessing}
          style={{ display: 'none' }}
        />
      </div>

      {/* Processing Tips */}
      {isProcessing && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#fff3cd',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#856404'
        }}>
          <strong>⏳ Processing image...</strong>
          <br />
          This may take 10-30 seconds depending on image quality.
        </div>
      )}

      {/* Quality Tips */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>💡 For best results:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          <li>Ensure text is clear and readable</li>
          <li>Good lighting without shadows</li>
          <li>Label should fill most of the image</li>
          <li>Avoid blurry or tilted photos</li>
        </ul>
      </div>
    </div>
  );
}

export default ImagePreview;