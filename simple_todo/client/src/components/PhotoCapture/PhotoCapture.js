import React from 'react';
import PropTypes from 'prop-types';
import PhotoCaptureWorkflow from './PhotoCaptureWorkflow';

const PhotoCapture = ({ onMedicationExtracted, onCancel, isProcessing = false }) => {
  return (
    <PhotoCaptureWorkflow
      onMedicationExtracted={onMedicationExtracted}
      onCancel={onCancel}
      initialStep="camera"
    />
  );
};

PhotoCapture.propTypes = {
  onMedicationExtracted: PropTypes.func.isRequired, // Callback with extracted data
  onCancel: PropTypes.func.isRequired, // Cancel photo capture
  isProcessing: PropTypes.bool, // External processing state
};


export default PhotoCapture;