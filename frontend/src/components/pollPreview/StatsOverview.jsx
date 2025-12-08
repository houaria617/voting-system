import React from 'react';
import StatCard from '../common/StatCard';
import '../../styles/pollPreview.css';

const StatsOverview = ({ totalVotes, winningOption, liveUpdate }) => {
  return (
    <div className="stats-overview">
      <StatCard 
        label="Total Votes" 
        value={totalVotes.toLocaleString()} 
        valueColor="blue"
      />
      <StatCard 
        label="Winning Option" 
        value={winningOption} 
        valueColor="dark"
      />
      <StatCard 
        label="Live Update" 
        value={liveUpdate} 
        valueColor="green"
      />
    </div>
  );
};

export default StatsOverview;