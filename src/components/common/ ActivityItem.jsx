import React from 'react';
import '../../styles/common.css';

const ActivityItem = ({ icon: Icon, iconBg, title, time }) => {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${iconBg}`}>
        <Icon size={16} />
      </div>
      <div className="activity-content">
        <p className="activity-title">{title}</p>
        <p className="activity-time">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
