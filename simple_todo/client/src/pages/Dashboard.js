import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, medicationsAPI } from '../services/api';
import { format } from 'date-fns';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user stats and recent logs in parallel
      const [statsResult, logsResult] = await Promise.all([
        userAPI.getStats(),
        medicationsAPI.getLogs(10) // Get last 10 logs
      ]);

      setStats(statsResult.data);
      setRecentLogs(logsResult.data || []);
      setError(null);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <strong>Error:</strong> {error}
        <button 
          className="btn btn-sm" 
          onClick={loadDashboardData}
          style={{ marginLeft: '10px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
          <p className="text-base text-gray-600">Track your medication adherence and health progress</p>
        </div>
        <Link to="/medications/add" className="btn btn-primary btn-md">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Log Medication
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="stat-card card-hover">
          <div className="stat-value text-primary">
            {stats?.total_medications || 0}
          </div>
          <div className="stat-label">Total Medications</div>
        </div>
        
        <div className="stat-card card-hover">
          <div className="stat-value text-success">
            {stats?.logs_today || 0}
          </div>
          <div className="stat-label">Logged Today</div>
        </div>
        
        <div className="stat-card card-hover">
          <div className="stat-value text-warning">
            {stats?.logs_last_7_days || 0}
          </div>
          <div className="stat-label">Last 7 Days</div>
        </div>
        
        <div className="stat-card card-hover">
          <div className="stat-value text-info">
            {stats?.streak_days || 0}
          </div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/medications/add" className="btn btn-primary btn-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Log Medication
          </Link>
          <Link to="/medications" className="btn btn-secondary btn-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Manage
          </Link>
          <Link to="/progress" className="btn btn-ghost btn-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Progress
          </Link>
          <Link to="/history" className="btn btn-ghost btn-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
          <Link to="/history" className="text-sm text-primary hover:text-primary-hover transition-colors duration-200 font-medium">
            View All →
          </Link>
        </div>
        
        {recentLogs.length === 0 ? (
          <div className="empty-state py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="empty-state-title">No medication logs yet</div>
            <div className="empty-state-description">Start tracking your medication adherence today</div>
            <Link to="/medications/add" className="btn btn-primary btn-md">
              Log Your First Medication
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentLogs.slice(0, 5).map((log, index) => (
              <div 
                key={log.id} 
                className={`list-item ${index !== recentLogs.slice(0, 5).length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="list-item-content">
                  <div className="list-item-title">{log.medication_name}</div>
                  <div className="list-item-subtitle flex items-center gap-2">
                    {log.dosage && <span>Dosage: {log.dosage}</span>}
                    {log.notes && (
                      <span className="text-gray-500">• {log.notes}</span>
                    )}
                  </div>
                </div>
                <div className="list-item-meta text-right">
                  {format(new Date(log.taken_at), 'MMM d, h:mm a')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;