import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MedicationList from './pages/MedicationList';
import AddMedication from './pages/AddMedication';
import MedicationHistory from './pages/MedicationHistory';
import Progress from './pages/Progress';
import Navigation from './components/Navigation';
import { healthCheck } from './services/api';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check API health
    checkAPIHealth();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkAPIHealth = async () => {
    try {
      console.log('Starting API health check...');
      const result = await healthCheck();
      console.log('API health check successful:', result);
      setApiStatus('online');
    } catch (error) {
      console.error('API health check failed:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        request: error.request ? 'Request was made but no response' : 'No request made'
      });
      setApiStatus('offline');
    }
  };

  return (
    <Router>
      <div className="App">
        <Navigation isOnline={isOnline} apiStatus={apiStatus} />
        
        {!isOnline && (
          <div className="alert alert-error container">
            <strong>Offline:</strong> You're currently offline. Changes will sync when connection is restored.
          </div>
        )}

        {apiStatus === 'offline' && isOnline && (
          <div className="alert alert-error container">
            <strong>API Unavailable:</strong> Server connection failed. Running in offline mode.
          </div>
        )}

        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medications" element={<MedicationList />} />
            <Route path="/medications/add" element={<AddMedication />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/history" element={<MedicationHistory />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;