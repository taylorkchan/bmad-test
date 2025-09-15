import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ isOnline, apiStatus }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="nav">
      <div className="nav-header">
        <div className="flex items-center">
          <Link to="/dashboard" className="nav-title no-underline hover:text-primary transition-colors duration-200">
            CareHub
          </Link>
          <span className="ml-2 text-xs text-gray-500 hidden sm:inline">Healthcare Management</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="nav-links">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/medications" 
              className={`nav-link ${isActive('/medications') ? 'active' : ''}`}
            >
              Medications
            </Link>
            <Link 
              to="/progress" 
              className={`nav-link ${isActive('/progress') ? 'active' : ''}`}
            >
              Progress
            </Link>
            <Link 
              to="/history" 
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            >
              History
            </Link>
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-danger'}`}
                title={isOnline ? 'Online' : 'Offline'}
              />
              <span className="text-gray-600 hidden md:inline">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {apiStatus && (
              <div className="flex items-center gap-2">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    apiStatus === 'online' ? 'bg-success' : 'bg-warning'
                  }`}
                  title={`API Status: ${apiStatus}`}
                />
                <span className="text-gray-600 hidden lg:inline">
                  API: {apiStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;