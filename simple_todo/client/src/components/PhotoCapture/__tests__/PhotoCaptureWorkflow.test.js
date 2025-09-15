import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhotoCaptureWorkflow from '../PhotoCaptureWorkflow';

// Mock the sub-components
jest.mock('../CameraCapture', () => ({ onCapture, onClose }) => (
  <div data-testid="camera-capture">
    <button 
      data-testid="mock-capture"
      onClick={() => onCapture(
        new File(['mock'], 'test.jpg', { type: 'image/jpeg' }),
        'data:image/jpeg;base64,mock'
      )}
    >
      Capture
    </button>
    <button data-testid="mock-close" onClick={onClose}>Close</button>
  </div>
));

jest.mock('../ImagePreview', () => ({ onProcessImage, onRetake }) => (
  <div data-testid="image-preview">
    <button data-testid="mock-process" onClick={() => onProcessImage('mock-image')}>Process</button>
    <button data-testid="mock-retake" onClick={onRetake}>Retake</button>
  </div>
));

jest.mock('../DataVerification', () => ({ onConfirm, onCancel, ocrResult }) => (
  <div data-testid="data-verification">
    <div>OCR Result: {ocrResult?.extractedText || 'None'}</div>
    <button data-testid="mock-confirm" onClick={() => onConfirm({ medicationName: 'Test Med' })}>Confirm</button>
    <button data-testid="mock-cancel" onClick={onCancel}>Cancel</button>
  </div>
));

// Mock OCR service and image processor
jest.mock('../../utils/ocrConfig', () => ({
  ocrService: {
    setProgressCallback: jest.fn(),
    processImage: jest.fn(() => Promise.resolve({
      success: true,
      extractedText: 'Mock extracted text',
      confidence: 0.95
    }))
  }
}));

jest.mock('../../utils/imageProcessing', () => ({
  ImageProcessor: {
    optimizeForOCR: jest.fn(() => Promise.resolve('optimized-image')),
    validateImageFile: jest.fn(() => ({ isValid: true })),
    fileToDataURL: jest.fn(() => Promise.resolve('data:image/jpeg;base64,mock'))
  }
}));

describe('PhotoCaptureWorkflow Component', () => {
  const mockOnMedicationExtracted = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onMedicationExtracted: mockOnMedicationExtracted,
    onCancel: mockOnCancel
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders camera step by default', () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    expect(screen.getByTestId('camera-capture')).toBeInTheDocument();
  });

  it('progresses from camera to preview after photo capture', async () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    const captureButton = screen.getByTestId('mock-capture');
    fireEvent.click(captureButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      expect(screen.queryByTestId('camera-capture')).not.toBeInTheDocument();
    });
  });

  it('progresses from preview to processing after image processing', async () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    // Capture photo to get to preview
    const captureButton = screen.getByTestId('mock-capture');
    fireEvent.click(captureButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    });
    
    // Process image
    const processButton = screen.getByTestId('mock-process');
    fireEvent.click(processButton);
    
    await waitFor(() => {
      expect(screen.getByText('Processing Your Image')).toBeInTheDocument();
    });
  });

  it('progresses to verification after successful OCR', async () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    // Go through the flow
    fireEvent.click(screen.getByTestId('mock-capture'));
    
    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId('mock-process'));
    
    await waitFor(() => {
      expect(screen.getByTestId('data-verification')).toBeInTheDocument();
    });
  });

  it('calls onMedicationExtracted when medication is confirmed', async () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    // Go through the complete flow
    fireEvent.click(screen.getByTestId('mock-capture'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('mock-process'));
    });
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('mock-confirm'));
    });
    
    await waitFor(() => {
      expect(mockOnMedicationExtracted).toHaveBeenCalledWith(
        expect.objectContaining({
          medicationName: 'Test Med',
          extractedVia: 'photo_recognition',
          processedAt: expect.any(String)
        })
      );
    });
  });

  it('resets workflow when retake is clicked', async () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    // Capture photo to get to preview
    fireEvent.click(screen.getByTestId('mock-capture'));
    
    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    });
    
    // Click retake
    fireEvent.click(screen.getByTestId('mock-retake'));
    
    await waitFor(() => {
      expect(screen.getByTestId('camera-capture')).toBeInTheDocument();
      expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    });
  });

  it('handles OCR processing errors', async () => {
    // Mock OCR service to fail
    const { ocrService } = require('../../utils/ocrConfig');
    ocrService.processImage.mockResolvedValueOnce({
      success: false,
      error: 'OCR processing failed'
    });
    
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    // Go through to processing
    fireEvent.click(screen.getByTestId('mock-capture'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('mock-process'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Processing Failed')).toBeInTheDocument();
      expect(screen.getByText('OCR processing failed')).toBeInTheDocument();
    });
  });

  it('shows progress during OCR processing', async () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    // Go to processing step
    fireEvent.click(screen.getByTestId('mock-capture'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('mock-process'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Processing Your Image')).toBeInTheDocument();
      expect(screen.getByText(/complete/)).toBeInTheDocument();
    });
  });

  it('calls onCancel when workflow is cancelled', () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    const closeButton = screen.getByTestId('mock-close');
    fireEvent.click(closeButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('supports custom initial step', () => {
    render(<PhotoCaptureWorkflow {...defaultProps} initialStep="preview" />);
    
    // Should render preview step if there's captured image data
    // This would need the component to handle missing image data gracefully
    expect(screen.queryByTestId('camera-capture')).not.toBeInTheDocument();
  });

  it('displays step indicator during workflow', async () => {
    render(<PhotoCaptureWorkflow {...defaultProps} />);
    
    // Capture photo to show step indicator
    fireEvent.click(screen.getByTestId('mock-capture'));
    
    await waitFor(() => {
      expect(screen.getByText('Photo Recognition Workflow')).toBeInTheDocument();
      expect(screen.getByText(/Step \d+ of \d+/)).toBeInTheDocument();
    });
  });
});