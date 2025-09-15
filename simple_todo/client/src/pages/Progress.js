import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { medicationsAPI } from '../services/api';
import { AnalyticsService } from '../services/analyticsService';
import AdherenceChart from '../components/Charts/AdherenceChart';
import StreakDisplay from '../components/Charts/StreakDisplay';
import ProgressSummary from '../components/Charts/ProgressSummary';

function Progress() {
  const [medications, setMedications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, 3months

  // Analytics data
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [medicationAdherence, setMedicationAdherence] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (medications.length > 0 && logs.length > 0) {
      calculateAnalytics();
    }
  }, [medications, logs, selectedPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [medicationsResult, logsResult] = await Promise.all([
        medicationsAPI.getAll(),
        medicationsAPI.getLogs(200) // Get more logs for better analytics
      ]);

      setMedications(medicationsResult.data || []);
      setLogs(logsResult.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load progress data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    try {
      // Daily adherence data
      const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90;
      const daily = AnalyticsService.getDailyAdherenceData(logs, medications, days);
      setDailyData(daily);

      // Monthly trends for 3-month view
      if (selectedPeriod === '3months') {
        const monthly = AnalyticsService.getMonthlyTrends(logs, medications, 3);
        setMonthlyData(monthly);
      }

      // Current streak
      const currentStreak = AnalyticsService.calculateStreak(logs);
      setStreak(currentStreak);

      // Weekly summary
      const weekly = AnalyticsService.getWeeklySummary(logs, medications);
      setWeeklySummary(weekly);

      // Individual medication adherence
      const medAdherence = AnalyticsService.getMedicationAdherence(logs, medications, 30);
      setMedicationAdherence(medAdherence);

    } catch (err) {
      console.error('Failed to calculate analytics:', err);
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case '3months': return 'Last 3 Months';
      default: return 'Progress';
    }
  };

  const getChartData = () => {
    if (selectedPeriod === '3months') {
      return monthlyData;
    }
    return dailyData;
  };

  if (loading) {
    return <div className="loading">Loading your progress...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <strong>Error:</strong> {error}
        <button 
          className="btn btn-sm" 
          onClick={loadData}
          style={{ marginLeft: '10px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div>
        <h2>Progress Tracking</h2>
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
            <h3>No medications to track yet</h3>
            <p>Add your medications to start seeing your progress and adherence trends.</p>
            <Link to="/medications/add" className="btn">
              Add Your First Medication
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div>
        <h2>Progress Tracking</h2>
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📈</div>
            <h3>Start logging to see your progress</h3>
            <p>You have {medications.length} medication{medications.length !== 1 ? 's' : ''} set up. 
               Start logging doses to track your adherence and see progress charts.</p>
            <Link to="/medications/add" className="btn">
              Log Medication
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Progress Tracking</h2>
        <Link to="/medications/add" className="btn btn-success">
          Log Medication
        </Link>
      </div>

      {/* Period Selection */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '500', marginRight: '10px' }}>View:</span>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`btn btn-sm ${selectedPeriod === 'week' ? '' : 'btn-secondary'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`btn btn-sm ${selectedPeriod === 'month' ? '' : 'btn-secondary'}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setSelectedPeriod('3months')}
            className={`btn btn-sm ${selectedPeriod === '3months' ? '' : 'btn-secondary'}`}
          >
            Last 3 Months
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Streak Display */}
        <StreakDisplay streak={streak} logs={logs} />

        {/* Quick Stats */}
        <div className="card">
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Quick Stats</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Medications:</span>
              <strong>{medications.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Logs:</span>
              <strong>{logs.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>This Week:</span>
              <strong>{weeklySummary?.logs || 0} logs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Week Adherence:</span>
              <strong style={{ color: weeklySummary ? (weeklySummary.adherenceRate >= 80 ? '#28a745' : weeklySummary.adherenceRate >= 60 ? '#ffc107' : '#dc3545') : '#6c757d' }}>
                {weeklySummary?.adherenceRate || 0}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Adherence Chart */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
          Adherence Trends - {getPeriodLabel()}
        </h3>
        <AdherenceChart 
          data={getChartData()}
          type={selectedPeriod === '3months' ? 'bar' : 'line'}
          height={350}
        />
      </div>

      {/* Progress Summary */}
      <ProgressSummary 
        summary={weeklySummary}
        medicationAdherence={medicationAdherence}
      />

      {/* Action Links */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/medications" className="btn btn-secondary">
            Manage Medications
          </Link>
          <Link to="/history" className="btn btn-secondary">
            View Full History
          </Link>
          <Link to="/medications/add" className="btn">
            Log Medication
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Progress;