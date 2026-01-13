import React from 'react';
import '../../styles/common.css';
import { FaPoll } from 'react-icons/fa';

const ActivityItem = ({ icon: Icon = FaPoll, iconBg = 'bg-blue-500', title, time }) => {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${iconBg}`}>
        {Icon && <Icon size={16} />} {/* safe rendering */}
      </div>
      <div className="activity-content">
        <p className="activity-title">{title}</p>
        <p className="activity-time">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
