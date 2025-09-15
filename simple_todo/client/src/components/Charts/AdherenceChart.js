import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AdherenceChart({ data, type = 'line', title, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#666',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
          <div>No data available yet</div>
          <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>
            Start logging medications to see your progress
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.date || item.month),
    datasets: [
      {
        label: 'Adherence Rate (%)',
        data: data.map(item => item.adherenceRate),
        backgroundColor: type === 'line' ? 'rgba(0, 123, 255, 0.1)' : 'rgba(0, 123, 255, 0.8)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: type === 'line' ? 3 : 1,
        fill: type === 'line',
        tension: type === 'line' ? 0.4 : 0,
        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: type === 'line' ? 6 : 0,
        pointHoverRadius: 8,
      },
      {
        label: 'Medications Logged',
        data: data.map(item => item.actual || item.logs),
        backgroundColor: 'rgba(40, 167, 69, 0.6)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
        type: 'bar',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: '600'
        },
        padding: 20
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
        callbacks: {
          afterBody: (context) => {
            const dataIndex = context[0].dataIndex;
            const item = data[dataIndex];
            const extra = [];
            
            if (item.expected) {
              extra.push(`Expected: ${item.expected} medications`);
            }
            if (item.uniqueDays !== undefined) {
              extra.push(`Active days: ${item.uniqueDays}`);
            }
            
            return extra.length > 0 ? extra : null;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: type === 'line' ? 'Days' : 'Period',
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Adherence Rate (%)',
          font: {
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        title: {
          display: true,
          text: 'Medications Logged',
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <div style={{ height: height, width: '100%' }}>
      <ChartComponent data={chartData} options={options} />
    </div>
  );
}

export default AdherenceChart;