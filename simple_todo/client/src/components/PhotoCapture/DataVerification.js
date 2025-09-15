import React, { useState } from 'react';

function DataVerification({ 
  ocrResult, 
  onConfirm, 
  onRetry, 
  onCancel,
  isSubmitting 
}) {
  const [formData, setFormData] = useState(() => {
    if (!ocrResult?.parsedData) {
      return {
        name: '',
        dosage: '',
        frequency: '',
        notes: ''
      };
    }

    const { parsedData } = ocrResult;
    return {
      name: parsedData.medicationName || '',
      dosage: parsedData.dosage || '',
      frequency: parsedData.instructions || '',
      notes: parsedData.generic ? `Generic: ${parsedData.generic}` : ''
    };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a medication name');
      return;
    }
    onConfirm(formData);
  };

  if (!ocrResult) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
          <h3>No OCR Results</h3>
          <p>Please capture or upload an image first.</p>
        </div>
      </div>
    );
  }

  const { success, confidence, parsedData, rawText, error } = ocrResult;

  if (!success) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
          <h3>Processing Failed</h3>
          <p>{error || 'Failed to process the image. Please try again.'}</p>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={onRetry} className="btn">
              🔄 Try Again
            </button>
            <button onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return '#28a745'; // High confidence - green
    if (conf >= 60) return '#ffc107'; // Medium confidence - yellow
    return '#dc3545'; // Low confidence - red
  };

  const getConfidenceLabel = (conf) => {
    if (conf >= 80) return 'High';
    if (conf >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🔍 Verification Required
          <span style={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '10px',
            backgroundColor: getConfidenceColor(confidence),
            color: 'white',
            fontWeight: '500'
          }}>
            {confidence}% {getConfidenceLabel(confidence)}
          </span>
        </h3>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Please verify and edit the extracted information below:
        </p>
      </div>

      {/* OCR Results Summary */}
      {parsedData?.suggestions && parsedData.suggestions.length > 0 && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '12px',
          color: '#856404'
        }}>
          <strong>💡 Suggestions:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
            {parsedData.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editable Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label htmlFor="name">
            Medication Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter medication name"
            required
            style={{
              borderColor: parsedData?.medicationName ? '#28a745' : '#dc3545'
            }}
          />
          {parsedData?.medicationName && (
            <small style={{ color: '#28a745' }}>✓ Extracted from image</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dosage">
            Dosage
          </label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            className="form-control"
            value={formData.dosage}
            onChange={handleInputChange}
            placeholder="e.g., 200mg, 1 tablet, 5ml"
            style={{
              borderColor: parsedData?.dosage ? '#28a745' : undefined
            }}
          />
          {parsedData?.dosage && (
            <small style={{ color: '#28a745' }}>✓ Extracted from image</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="frequency">
            Instructions/Frequency
          </label>
          <input
            type="text"
            id="frequency"
            name="frequency"
            className="form-control"
            value={formData.frequency}
            onChange={handleInputChange}
            placeholder="e.g., Once daily, Every 8 hours, As needed"
            style={{
              borderColor: parsedData?.instructions ? '#28a745' : undefined
            }}
          />
          {parsedData?.instructions && (
            <small style={{ color: '#28a745' }}>✓ Extracted from image</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className="form-control"
            rows="2"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional notes..."
          />
        </div>

        {/* Medical Information Section */}
      {(parsedData?.mechanism || parsedData?.indications || parsedData?.sideEffects || parsedData?.warnings) && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0', 
            color: '#495057',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏥 Medical Information
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: '500'
            }}>
              AI-Generated
            </span>
          </h4>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {parsedData.mechanism && (
              <div>
                <strong style={{ color: '#28a745', fontSize: '13px' }}>⚙️ How it works:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                  {parsedData.mechanism}
                </p>
              </div>
            )}
            
            {parsedData.indications && (
              <div>
                <strong style={{ color: '#007bff', fontSize: '13px' }}>🎯 Used to treat:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                  {parsedData.indications}
                </p>
              </div>
            )}
            
            {parsedData.sideEffects && (
              <div>
                <strong style={{ color: '#ffc107', fontSize: '13px' }}>⚠️ Common side effects:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                  {parsedData.sideEffects}
                </p>
              </div>
            )}
            
            {parsedData.warnings && (
              <div>
                <strong style={{ color: '#dc3545', fontSize: '13px' }}>🚨 Important warnings:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                  {parsedData.warnings}
                </p>
              </div>
            )}
          </div>
          
          <div style={{
            marginTop: '10px',
            fontSize: '10px',
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            💡 This information is AI-generated based on the identified medication. Always consult your healthcare provider.
          </div>
        </div>
      )}

      {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Saving...' : '✓ Save Medication'}
          </button>
          
          <button 
            type="button"
            onClick={onRetry} 
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            📷 Retake Photo
          </button>
          
          <button 
            type="button"
            onClick={onCancel} 
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Raw Text Preview (Collapsible) */}
      <details style={{ marginTop: '15px' }}>
        <summary style={{
          cursor: 'pointer',
          padding: '8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          📝 View Raw Extracted Text ({rawText?.length || 0} characters)
        </summary>
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#333',
          whiteSpace: 'pre-wrap',
          maxHeight: '150px',
          overflow: 'auto'
        }}>
          {rawText || 'No text extracted'}
        </div>
      </details>

      {/* Processing Info */}
      <div style={{
        marginTop: '15px',
        padding: '8px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#1976d2'
      }}>
        <strong>ℹ️ Processing Info:</strong> Confidence {confidence}% • 
        {parsedData?.confidence === 'high' && ' High quality extraction'}
        {parsedData?.confidence === 'medium' && ' Medium quality - please verify'}
        {parsedData?.confidence === 'low' && ' Low quality - manual verification recommended'}
      </div>
    </div>
  );
}

export default DataVerification;