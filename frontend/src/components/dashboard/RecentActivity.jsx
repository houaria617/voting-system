import React from 'react';
import Card from '../common/Card';
import ActivityItem from '../common/ ActivityItem';
import '../../styles/dashboard.css';

const RecentActivity = ({ activities }) => {
  return (
    <Card>
      <h2 className="activity-title">Recent Activity</h2>
      
      <div className="activity-list">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            icon={activity.icon}
            iconBg={activity.iconBg}
            title={activity.title}
            time={activity.time}
          />
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
