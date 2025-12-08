import React from 'react';
import '../../styles/common.css';

const StatCard = ({ label, value, valueColor = 'blue', className = '' }) => {
  return (
    <div className={`stat-card ${className}`}>
      <p className="stat-card-label">{label}</p>
      <p className={`stat-card-value stat-card-value-${valueColor}`}>{value}</p>
    </div>
  );
};

export default StatCard;
