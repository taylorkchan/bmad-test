import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { medicationsAPI } from '../services/api';
import { format } from 'date-fns';

function MedicationList() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const result = await medicationsAPI.getAll();
      setMedications(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load medications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logMedication = async (medication) => {
    try {
      await medicationsAPI.logDose(medication.id, {
        taken_at: new Date().toISOString(),
        notes: 'Quick log from medications list'
      });
      
      setSuccessMessage(`Logged ${medication.name} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to log medication:', err);
      setError(err.message);
    }
  };

  const deleteMedication = async (medicationId) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    try {
      await medicationsAPI.delete(medicationId);
      setMedications(medications.filter(med => med.id !== medicationId));
      setSuccessMessage('Medication deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete medication:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading medications...</div>;
  }

  return (
    <div className="container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Medications</h1>
          <p className="text-gray-600">Manage and track your medication doses</p>
        </div>
        <Link 
          to="/medications/add" 
          className="btn btn-primary btn-md inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Medication
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span><strong>Error:</strong> {error}</span>
          </div>
          <button 
            className="btn btn-sm btn-secondary ml-4" 
            onClick={loadMedications}
          >
            Retry
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Content */}
      {medications.length === 0 ? (
        <div className="card text-center">
          <div className="empty-state">
            <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="empty-state-title">No medications added yet</h3>
            <p className="empty-state-description">Get started by adding your first medication to track doses and schedules.</p>
            <Link to="/medications/add" className="btn btn-primary btn-md">
              Add Your First Medication
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map((medication) => (
            <div key={medication.id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {medication.name}
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {medication.dosage && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        <span><strong>Dosage:</strong> {medication.dosage}</span>
                      </div>
                    )}
                    
                    {medication.frequency && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Frequency:</strong> {medication.frequency}</span>
                      </div>
                    )}
                  </div>
                  
                  {medication.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {medication.notes}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Added: {format(new Date(medication.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 lg:ml-6">
                  <button
                    onClick={() => logMedication(medication)}
                    className="btn btn-success btn-sm flex items-center gap-2 flex-1 lg:flex-none justify-center"
                    title="Log this medication now"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Log Now
                  </button>
                  
                  <button
                    onClick={() => deleteMedication(medication.id)}
                    className="btn btn-danger btn-sm flex items-center gap-2 flex-1 lg:flex-none justify-center"
                    title="Delete this medication"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {medications.length > 0 && (
        <div className="mt-8 text-center">
          <Link to="/history" className="btn btn-secondary btn-md inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Medication History
          </Link>
        </div>
      )}
    </div>
  );
}

export default MedicationList;