import React from 'react';
import '../../styles/pollPreview.css';

const BarChart = ({ options }) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Voting Results</h3>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">Live</span>
        </div>
      </div>

      <div className="bar-chart">
        <div className="bar-chart-labels">
          {options.map(option => (
            <div key={option.id} className="bar-label">
              {option.percentage}%
            </div>
          ))}
        </div>

        <div className="bar-chart-bars">
          {options.map(option => (
            <div key={option.id} className="bar-wrapper">
              <div 
                className="bar"
                style={{
                  height: `${option.percentage * 3}px`,
                  backgroundColor: option.color
                }}
              ></div>
              <div className="bar-name">{option.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChart;