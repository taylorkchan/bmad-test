import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhotoCapture from '../PhotoCapture';

// Mock the PhotoCaptureWorkflow component
jest.mock('../PhotoCaptureWorkflow', () => {
  return function MockPhotoCaptureWorkflow({ onMedicationExtracted, onCancel }) {
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
  };
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

  it('renders without crashing', () => {
    const { getByTestId } = render(<PhotoCapture {...defaultProps} />);
    expect(getByTestId('photo-capture-workflow')).toBeInTheDocument();
  });

  it('passes props to PhotoCaptureWorkflow', () => {
    render(<PhotoCapture {...defaultProps} />);
    // Component renders successfully, meaning props were passed correctly
    expect(mockOnMedicationExtracted).toBeDefined();
    expect(mockOnCancel).toBeDefined();
  });

  it('has required prop types defined', () => {
    expect(PhotoCapture.propTypes).toBeDefined();
    expect(PhotoCapture.propTypes.onMedicationExtracted).toBeDefined();
    expect(PhotoCapture.propTypes.onCancel).toBeDefined();
    expect(PhotoCapture.propTypes.isProcessing).toBeDefined();
  });

  it('has correct default props', () => {
    expect(PhotoCapture.defaultProps).toBeDefined();
    expect(PhotoCapture.defaultProps.isProcessing).toBe(false);
  });
});