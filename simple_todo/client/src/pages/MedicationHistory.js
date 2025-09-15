import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { medicationsAPI } from '../services/api';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

function MedicationHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, today, week

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const result = await medicationsAPI.getLogs(100); // Get more logs for history
      setLogs(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    
    const logDate = parseISO(log.taken_at);
    if (filter === 'today') return isToday(logDate);
    if (filter === 'week') return isThisWeek(logDate);
    
    return true;
  });

  const groupedLogs = filteredLogs.reduce((groups, log) => {
    const logDate = parseISO(log.taken_at);
    let dateKey;
    
    if (isToday(logDate)) {
      dateKey = 'Today';
    } else if (isYesterday(logDate)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = format(logDate, 'EEEE, MMMM d, yyyy');
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(log);
    
    return groups;
  }, {});

  const getTimeDescription = (takenAt) => {
    const date = parseISO(takenAt);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    return format(date, 'h:mm a');
  };

  if (loading) {
    return <div className="loading">Loading medication history...</div>;
  }

  return (
    <div className="container">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication History</h1>
          <p className="text-gray-600">Track and review your medication logs</p>
        </div>
        <Link 
          to="/medications/add" 
          className="btn btn-primary btn-md inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Log Medication
        </Link>
      </div>

      {/* Error Alert */}
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
            onClick={loadLogs}
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Options */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-gray-700 text-sm">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Time ({logs.length})
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`btn btn-sm ${filter === 'today' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Today ({logs.filter(log => isToday(parseISO(log.taken_at))).length})
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`btn btn-sm ${filter === 'week' ? 'btn-primary' : 'btn-secondary'}`}
            >
              This Week ({logs.filter(log => isThisWeek(parseISO(log.taken_at))).length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredLogs.length === 0 ? (
        <div className="card text-center">
          <div className="empty-state">
            <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="empty-state-title">No medication logs found</h3>
            <p className="empty-state-description">
              {filter === 'all' 
                ? "You haven't logged any medications yet." 
                : `No medications logged ${filter === 'today' ? 'today' : 'this week'}.`
              }
            </p>
            <Link to="/medications/add" className="btn btn-primary btn-md">
              Log Your First Medication
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([dateGroup, dayLogs]) => (
            <div key={dateGroup} className="card">
              {/* Date Header */}
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">{dateGroup}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {dayLogs.length} log{dayLogs.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Logs for this date */}
              <div className="space-y-3">
                {dayLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">
                          {log.medication_name}
                          {log.dosage && (
                            <span className="font-normal text-gray-600 ml-2">
                              ({log.dosage})
                            </span>
                          )}
                        </h4>
                      </div>
                      
                      {log.notes && (
                        <div className="ml-6 text-sm text-gray-700 bg-white/60 p-2 rounded">
                          <svg className="w-4 h-4 inline mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          {log.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-right ml-4">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                        {getTimeDescription(log.taken_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="text-center mt-8">
            <Link to="/medications" className="btn btn-secondary btn-md inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
              </svg>
              Manage Medications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationHistory;