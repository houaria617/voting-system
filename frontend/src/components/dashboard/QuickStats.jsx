import React from 'react';
import Card from '../common/Card';
import '../../styles/dashboard.css';

const QuickStats = ({ stats }) => {
  return (
    <Card>
      <h2 className="stats-title">Quick Stats</h2>
      
      <div className="stats-content">
        <div className="stat-item">
          <p className="stat-label">Total Active Polls</p>
          <p className="stat-value">{stats.activePolls}</p>
        </div>
        
        <div className="stat-divider"></div>
        
        <div className="stat-item">
          <p className="stat-label">Total Votes Cast</p>
          <p className="stat-value">{stats.totalVotes}</p>
        </div>
      </div>
    </Card>
  );
};

export default QuickStats;
