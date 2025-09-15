import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicationsAPI } from '../services/api';

function AddMedication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: 'Ibuprofen',
    dosage: '200',
    frequency: 'Twice a day',
    notes: 'Take one tablet in the morning and one in the evening.',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Medication name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create the medication
      await medicationsAPI.create(formData);

      // Navigate back to medications list
      navigate('/medications');
    } catch (err) {
      console.error('Failed to create medication:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/medications');
  };


  return (
    <div className="relative flex size-full min-h-screen flex-col dark justify-between bg-[#111a22]" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#111a22]/80 backdrop-blur-sm">
          <div className="flex items-center p-4">
            <button 
              className="text-white"
              onClick={handleCancel}
              disabled={loading}
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <h1 className="flex-1 text-center text-xl font-bold text-white pr-8">Edit Medication</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500 rounded-xl text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Medication Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="medication-name">
              Medication Name
            </label>
            <input 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-[#1173d4] focus:ring-[#1173d4] h-14 p-4 text-base" 
              id="medication-name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Dosage */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="dosage">
              Dosage
            </label>
            <div className="relative">
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-[#1173d4] focus:ring-[#1173d4] h-14 p-4 text-base" 
                id="dosage" 
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">mg</span>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="frequency">
              Frequency
            </label>
            <div className="relative">
              <select 
                className="form-select flex w-full min-w-0 flex-1 appearance-none resize-none overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-[#1173d4] focus:ring-[#1173d4] h-14 p-4 text-base" 
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="Once a day">Once a day</option>
                <option value="Twice a day">Twice a day</option>
                <option value="3 times a day">3 times a day</option>
                <option value="As needed">As needed</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">expand_more</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="instructions">
              Instructions
            </label>
            <textarea 
              className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-[#1173d4] focus:ring-[#1173d4] min-h-36 p-4 text-base" 
              id="instructions" 
              name="notes"
              placeholder="e.g. Take with food"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-[#111a22]/80 backdrop-blur-sm p-4">
        <div className="flex gap-4">
          <button 
            className="flex-1 rounded-full h-14 px-5 bg-slate-700 text-white text-base font-bold leading-normal tracking-wide disabled:opacity-50"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="flex-1 rounded-full h-14 px-5 bg-[#1173d4] text-white text-base font-bold leading-normal tracking-wide disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default AddMedication;