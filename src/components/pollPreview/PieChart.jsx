import React from 'react';
import '../../styles/pollPreview.css';

const PieChart = ({ options }) => {
  // Calculate cumulative percentages for the conic gradient
  let cumulativePercentage = 0;
  const gradientStops = options.map((option, index) => {
    const start = cumulativePercentage;
    cumulativePercentage += option.percentage;
    const end = cumulativePercentage;
    return `${option.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Voting Results</h3>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">Live</span>
        </div>
      </div>

      <div className="pie-chart">
        <div className="pie-chart-visual">
          <div 
            className="pie-chart-circle"
            style={{
              background: `conic-gradient(${gradientStops})`
            }}
          ></div>
        </div>

        <div className="pie-chart-legend">
          {options.map(option => (
            <div key={option.id} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: option.color }}
              ></div>
              <span className="legend-label">{option.name}</span>
              <span className="legend-percentage">{option.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;