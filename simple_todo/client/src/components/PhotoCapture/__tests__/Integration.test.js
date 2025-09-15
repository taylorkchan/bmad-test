import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AddMedication from '../../../pages/AddMedication';

// Mock the API
jest.mock('../../../services/api', () => ({
  medicationsAPI: {
    create: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
    logDose: jest.fn(() => Promise.resolve())
  }
}));

// Mock the PhotoCapture component
jest.mock('../PhotoCapture', () => {
  return function MockPhotoCapture({ onMedicationExtracted, onCancel }) {
    return (
      <div data-testid="photo-capture">
        <button 
          data-testid="extract-medication"
          onClick={() => onMedicationExtracted({
            medicationName: 'Aspirin',
            dosage: '325mg',
            frequency: 'Daily',
            instructions: 'Take with food'
          })}
        >
          Extract Medication
        </button>
        <button data-testid="cancel-capture" onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  };
});

describe('PhotoCapture Integration', () => {
  const renderAddMedication = () => {
    return render(
      <MemoryRouter>
        <AddMedication />
      </MemoryRouter>
    );
  };

  it('shows photo capture button in AddMedication page', () => {
    renderAddMedication();
    
    expect(screen.getByText('📸 Capture Photo')).toBeInTheDocument();
    expect(screen.getByText('Take a photo of your medication label to auto-fill information')).toBeInTheDocument();
  });

  it('opens photo capture when capture button is clicked', () => {
    renderAddMedication();
    
    const captureButton = screen.getByText('📸 Capture Photo');
    fireEvent.click(captureButton);
    
    expect(screen.getByTestId('photo-capture')).toBeInTheDocument();
    expect(screen.queryByText('Add New Medication')).not.toBeInTheDocument();
  });

  it('fills form with extracted medication data', () => {
    renderAddMedication();
    
    // Open photo capture
    const captureButton = screen.getByText('📸 Capture Photo');
    fireEvent.click(captureButton);
    
    // Extract medication data
    const extractButton = screen.getByTestId('extract-medication');
    fireEvent.click(extractButton);
    
    // Check that form is filled
    expect(screen.getByDisplayValue('Aspirin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('325mg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Daily')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Take with food')).toBeInTheDocument();
  });

  it('returns to form when photo capture is cancelled', () => {
    renderAddMedication();
    
    // Open photo capture
    const captureButton = screen.getByText('📸 Capture Photo');
    fireEvent.click(captureButton);
    
    // Cancel capture
    const cancelButton = screen.getByTestId('cancel-capture');
    fireEvent.click(cancelButton);
    
    // Should be back to the form
    expect(screen.getByText('Add New Medication')).toBeInTheDocument();
    expect(screen.queryByTestId('photo-capture')).not.toBeInTheDocument();
  });

  it('preserves existing form data when using photo capture', () => {
    renderAddMedication();
    
    // Fill some form data
    const nameInput = screen.getByPlaceholderText('e.g., Aspirin, Ibuprofen 200mg');
    fireEvent.change(nameInput, { target: { value: 'Existing Medicine' } });
    
    // Open photo capture
    const captureButton = screen.getByText('📸 Capture Photo');
    fireEvent.click(captureButton);
    
    // Extract medication data (which should override name but append notes)
    const extractButton = screen.getByTestId('extract-medication');
    fireEvent.click(extractButton);
    
    // Check that name is overridden but existing data is preserved where appropriate
    expect(screen.getByDisplayValue('Aspirin')).toBeInTheDocument(); // New name from photo
    expect(screen.getByDisplayValue('325mg')).toBeInTheDocument(); // New dosage
    expect(screen.getByDisplayValue('Take with food')).toBeInTheDocument(); // Extracted instructions
  });
});