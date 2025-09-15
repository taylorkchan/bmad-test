import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CameraCapture from '../CameraCapture';

// Mock react-webcam
const mockReact = require('react');
jest.mock('react-webcam', () => {
  return mockReact.forwardRef(({ onUserMediaError }, ref) => {
    mockReact.useImperativeHandle(ref, () => ({
      getScreenshot: jest.fn(() => 'data:image/jpeg;base64,mockedImageData')
    }));
    
    return mockReact.createElement('div', {
      'data-testid': 'webcam-component'
    }, [
      'Mocked Webcam Component',
      mockReact.createElement('button', {
        key: 'trigger-error',
        'data-testid': 'trigger-error',
        onClick: () => onUserMediaError && onUserMediaError(new Error('Camera access denied'))
      }, 'Trigger Error')
    ]);
  });
});

// Mock fetch for image conversion
global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob(['mock image data'], { type: 'image/jpeg' }))
  })
);

describe('CameraCapture Component', () => {
  const mockOnCapture = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    onCapture: mockOnCapture,
    onClose: mockOnClose,
    isActive: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.Date.now = jest.fn(() => 1234567890123);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders when active', () => {
    render(<CameraCapture {...defaultProps} />);
    
    expect(screen.getByText('📸 Capture Medication Label')).toBeInTheDocument();
    expect(screen.getByTestId('webcam-component')).toBeInTheDocument();
  });

  it('does not render when not active', () => {
    render(<CameraCapture {...defaultProps} isActive={false} />);
    
    expect(screen.queryByText('📸 Capture Medication Label')).not.toBeInTheDocument();
  });

  it('displays camera access error', async () => {
    render(<CameraCapture {...defaultProps} />);
    
    const errorButton = screen.getByTestId('trigger-error');
    fireEvent.click(errorButton);
    
    await waitFor(() => {
      expect(screen.getByText('Camera Not Available')).toBeInTheDocument();
      expect(screen.getByText('Camera access denied or not available. Please check your permissions.')).toBeInTheDocument();
    });
  });

  it('captures photo successfully', async () => {
    render(<CameraCapture {...defaultProps} />);
    
    const captureButton = screen.getByTitle('Capture Photo');
    fireEvent.click(captureButton);
    
    await waitFor(() => {
      expect(mockOnCapture).toHaveBeenCalled();
      const [file, dataUrl] = mockOnCapture.mock.calls[0];
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('medication-photo-1234567890123.jpg');
      expect(dataUrl).toBe('data:image/jpeg;base64,mockedImageData');
    });
  });

  it('handles capture failure', async () => {
    // Mock getScreenshot to return null (failure case)
    const mockWebcamRef = {
      current: {
        getScreenshot: jest.fn(() => null)
      }
    };
    
    jest.spyOn(React, 'useRef').mockReturnValue(mockWebcamRef);
    
    render(<CameraCapture {...defaultProps} />);
    
    const captureButton = screen.getByTitle('Capture Photo');
    fireEvent.click(captureButton);
    
    await waitFor(() => {
      expect(mockOnCapture).not.toHaveBeenCalled();
    });
  });

  it('switches camera facing mode', async () => {
    render(<CameraCapture {...defaultProps} />);
    
    const switchButton = screen.getByTitle('Switch Camera');
    fireEvent.click(switchButton);
    
    // Component should re-render with new facing mode
    await waitFor(() => {
      expect(switchButton).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    render(<CameraCapture {...defaultProps} />);
    
    const closeButton = screen.getByTitle('Close Camera');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<CameraCapture {...defaultProps} />);
    
    const cancelButton = screen.getByTitle('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('disables capture button during capturing', async () => {
    render(<CameraCapture {...defaultProps} />);
    
    const captureButton = screen.getByTitle('Capture Photo');
    fireEvent.click(captureButton);
    
    // Button should be disabled during capture
    expect(captureButton).toBeDisabled();
    
    await waitFor(() => {
      expect(captureButton).not.toBeDisabled();
    });
  });

  it('shows capture guide and tips', () => {
    render(<CameraCapture {...defaultProps} />);
    
    expect(screen.getByText(/Position the medication label clearly in frame/)).toBeInTheDocument();
    expect(screen.getByText(/Use good lighting/)).toBeInTheDocument();
  });

  it('displays refresh option when camera error occurs', async () => {
    render(<CameraCapture {...defaultProps} />);
    
    const errorButton = screen.getByTestId('trigger-error');
    fireEvent.click(errorButton);
    
    await waitFor(() => {
      expect(screen.getByText('Refresh Page')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });
});