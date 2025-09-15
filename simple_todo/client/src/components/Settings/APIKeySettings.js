import React, { useState, useEffect } from 'react';

const APIKeySettings = ({ onApiKeyChange, currentApiKey = '' }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      if (onApiKeyChange) {
        onApiKeyChange(savedApiKey);
      }
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      alert('OpenAI API keys should start with "sk-"');
      return;
    }

    // Save to localStorage
    localStorage.setItem('openai-api-key', apiKey.trim());
    
    // Notify parent component
    if (onApiKeyChange) {
      onApiKeyChange(apiKey.trim());
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('openai-api-key');
    if (onApiKeyChange) {
      onApiKeyChange('');
    }
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>🔑 OCR Settings</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          OpenAI API Key (for GPT-4 Vision OCR)
        </label>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-proj-..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
          />
          
          <button
            onClick={() => setShowKey(!showKey)}
            style={{
              padding: '10px 12px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={handleSaveApiKey}
          disabled={!apiKey.trim()}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            backgroundColor: isSaved ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: apiKey.trim() ? 'pointer' : 'not-allowed',
            opacity: apiKey.trim() ? 1 : 0.6
          }}
        >
          {isSaved ? '✅ Saved' : '💾 Save API Key'}
        </button>

        {apiKey && (
          <button
            onClick={handleClearApiKey}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear
          </button>
        )}

        <span style={{ 
          fontSize: '12px', 
          color: apiKey ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {apiKey ? '✅ API Key Set' : '❌ API Key Required'}
        </span>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e7f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '4px',
        fontSize: '13px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>ℹ️ About GPT-4 Vision OCR:</p>
        <ul style={{ margin: 0, paddingLeft: '18px' }}>
          <li>More accurate than traditional OCR for medical text</li>
          <li>Automatically extracts structured medication data</li>
          <li>Identifies pill names, dosages, instructions, and more</li>
          <li>Your API key is stored locally in your browser</li>
        </ul>
        
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontStyle: 'italic' }}>
          <strong>Get your API key:</strong> Visit{' '}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#007bff' }}
          >
            platform.openai.com/api-keys
          </a>
        </p>
      </div>
    </div>
  );
};

export default APIKeySettings;