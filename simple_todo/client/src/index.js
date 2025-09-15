import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Global error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Promise:', event.promise);
  
  // Prevent default handling (which shows the error in console)
  // but log it properly for debugging
  if (process.env.NODE_ENV === 'development') {
    console.warn('This error was caught by global handler. Check OCR or performance monitoring code.');
  }
});

// Global error handling for general errors
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  console.error('Source:', event.filename, 'Line:', event.lineno);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);