import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhotoCapture from '../PhotoCapture';
import PhotoCaptureWorkflow from '../PhotoCaptureWorkflow';

// Mock the PhotoCaptureWorkflow component
jest.mock('../PhotoCaptureWorkflow', () => {
  return jest.fn(({ onMedicationExtracted, onCancel }) => {
    return (
      <div data-testid="photo-capture-workflow">
        <button 
          data-testid="mock-extract"
          onClick={() => onMedicationExtracted({
            medicationName: 'Ibuprofen',
            dosage: '200mg',
            frequency: 'Every 8 hours'
          })}
        >
          Extract Medication
        </button>
        <button data-testid="mock-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  });
});

describe('PhotoCapture Component', () => {
  const mockOnMedicationExtracted = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onMedicationExtracted: mockOnMedicationExtracted,
    onCancel: mockOnCancel,
    isProcessing: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders PhotoCaptureWorkflow with correct props', () => {
    render(<PhotoCapture {...defaultProps} />);
    
    expect(PhotoCaptureWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        onMedicationExtracted: mockOnMedicationExtracted,
        onCancel: mockOnCancel,
        initialStep: 'camera'
      }),
      {}
    );
  });

  it('calls onMedicationExtracted when workflow extracts medication data', async () => {
    render(<PhotoCapture {...defaultProps} />);
    
    const extractButton = screen.getByTestId('mock-extract');
    fireEvent.click(extractButton);
    
    await waitFor(() => {
      expect(mockOnMedicationExtracted).toHaveBeenCalledWith({
        medicationName: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'Every 8 hours'
      });
    });
  });

  it('calls onCancel when workflow is cancelled', async () => {
    render(<PhotoCapture {...defaultProps} />);
    
    const cancelButton = screen.getByTestId('mock-cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  it('has correct prop types', () => {
    // Test that required props are defined
    expect(PhotoCapture.propTypes.onMedicationExtracted).toBeDefined();
    expect(PhotoCapture.propTypes.onCancel).toBeDefined();
    expect(PhotoCapture.propTypes.isProcessing).toBeDefined();
  });

  it('has correct default props', () => {
    expect(PhotoCapture.defaultProps.isProcessing).toBe(false);
  });

  it('renders workflow with camera step by default', () => {
    render(<PhotoCapture {...defaultProps} />);
    
    expect(PhotoCaptureWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        initialStep: 'camera'
      }),
      {}
    );
  });
});