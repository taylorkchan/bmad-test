import React from 'react';
import { format } from 'date-fns';

function StreakDisplay({ streak, logs, compact = false }) {
  const getStreakColor = (streakDays) => {
    if (streakDays >= 30) return '#28a745'; // Green for 30+ days
    if (streakDays >= 14) return '#007bff'; // Blue for 2+ weeks
    if (streakDays >= 7) return '#ffc107';  // Yellow for 1+ week
    if (streakDays >= 3) return '#fd7e14';  // Orange for 3+ days
    return '#6c757d'; // Gray for less than 3 days
  };

  const getStreakMessage = (streakDays) => {
    if (streakDays === 0) return "Start your streak today!";
    if (streakDays === 1) return "Great start! Keep it going.";
    if (streakDays < 7) return "Building momentum!";
    if (streakDays < 14) return "One week strong!";
    if (streakDays < 30) return "Incredible consistency!";
    if (streakDays < 60) return "You're on fire! 🔥";
    return "Legendary streak! 🏆";
  };

  const getStreakEmoji = (streakDays) => {
    if (streakDays >= 60) return "🏆";
    if (streakDays >= 30) return "🔥";
    if (streakDays >= 14) return "💪";
    if (streakDays >= 7) return "⭐";
    if (streakDays >= 3) return "🎯";
    if (streakDays >= 1) return "✅";
    return "🎯";
  };

  const mostRecentLog = logs && logs.length > 0 
    ? logs.sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at))[0]
    : null;

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: `2px solid ${getStreakColor(streak)}`,
      }}>
        <span style={{ fontSize: '20px' }}>{getStreakEmoji(streak)}</span>
        <div>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '700',
            color: getStreakColor(streak)
          }}>
            {streak}
          </span>
          <span style={{ fontSize: '14px', color: '#666', marginLeft: '4px' }}>
            day{streak !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          fontSize: '48px',
          marginBottom: '10px'
        }}>
          {getStreakEmoji(streak)}
        </div>
        
        <div style={{
          fontSize: '32px',
          fontWeight: '700',
          color: getStreakColor(streak),
          marginBottom: '5px'
        }}>
          {streak}
        </div>
        
        <div style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '10px'
        }}>
          Day{streak !== 1 ? 's' : ''} in a row
        </div>
        
        <div style={{
          fontSize: '14px',
          color: getStreakColor(streak),
          fontWeight: '500',
          marginBottom: '15px'
        }}>
          {getStreakMessage(streak)}
        </div>
      </div>

      {mostRecentLog && (
        <div style={{
          fontSize: '12px',
          color: '#999',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <div>Last logged:</div>
          <div style={{ fontWeight: '500', color: '#666' }}>
            {format(new Date(mostRecentLog.taken_at), 'MMM d, h:mm a')}
          </div>
          <div style={{ marginTop: '4px' }}>
            {mostRecentLog.medication_name}
          </div>
        </div>
      )}

      {streak >= 7 && (
        <div style={{ marginTop: '15px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 8px',
            backgroundColor: getStreakColor(streak),
            color: 'white',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            🎉 Milestone Achievement!
          </div>
        </div>
      )}

      {streak === 0 && logs && logs.length > 0 && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginTop: '10px',
          fontStyle: 'italic'
        }}>
          You've logged medications before - you can do it again!
        </div>
      )}
    </div>
  );
}

export default StreakDisplay;