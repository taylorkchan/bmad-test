import React from 'react';

function ProgressSummary({ summary, medicationAdherence }) {
  if (!summary) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ color: '#666' }}>
          Loading progress summary...
        </div>
      </div>
    );
  }

  const getAdherenceColor = (rate) => {
    if (rate >= 90) return '#28a745'; // Excellent - Green
    if (rate >= 80) return '#007bff'; // Good - Blue
    if (rate >= 70) return '#ffc107'; // Fair - Yellow
    if (rate >= 60) return '#fd7e14'; // Needs improvement - Orange
    return '#dc3545'; // Poor - Red
  };

  const getAdherenceLabel = (rate) => {
    if (rate >= 90) return 'Excellent';
    if (rate >= 80) return 'Good';
    if (rate >= 70) return 'Fair';
    if (rate >= 60) return 'Needs Improvement';
    return 'Poor';
  };

  const CircularProgress = ({ percentage, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e9ecef"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getAdherenceColor(percentage)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          color: getAdherenceColor(percentage)
        }}>
          {percentage}%
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Overall Summary */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
          {summary.period} Summary
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <CircularProgress percentage={summary.adherenceRate} />
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>Overall Adherence</div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: getAdherenceColor(summary.adherenceRate)
              }}>
                {getAdherenceLabel(summary.adherenceRate)}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#007bff',
              marginBottom: '5px'
            }}>
              {summary.logs}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Medications Logged
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              of {summary.expected} expected
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#28a745',
              marginBottom: '5px'
            }}>
              {summary.uniqueDays}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Active Days
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              this period
            </div>
          </div>
        </div>
      </div>

      {/* Individual Medication Adherence */}
      {medicationAdherence && medicationAdherence.length > 0 && (
        <div className="card">
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
            Individual Medication Adherence (30 days)
          </h4>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            {medicationAdherence.map((medication) => (
              <div 
                key={medication.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getAdherenceColor(medication.adherenceRate)}`
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                    {medication.name}
                  </div>
                  {medication.dosage && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {medication.dosage}
                    </div>
                  )}
                  {medication.lastTaken && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                      Last: {new Date(medication.lastTaken).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: getAdherenceColor(medication.adherenceRate)
                  }}>
                    {medication.adherenceRate}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {medication.logs} logs
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#1976d2'
          }}>
            <strong>💡 Tip:</strong> Consistency is more important than perfection. 
            Aim for 80%+ adherence for the best health outcomes.
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressSummary;