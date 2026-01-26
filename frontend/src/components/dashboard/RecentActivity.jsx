import React from 'react';
import Card from '../common/Card';
import ActivityItem from '../common/ ActivityItem';
import '../../styles/dashboard.css';

const RecentActivity = ({ activities = [], isLoading = false }) => {
  return (
    <Card>
      <h2 className="activity-title">Recent Activity</h2>
      
      <div className="activity-list">
        {isLoading && <p className="loading-text">Loading activities...</p>}

        {!isLoading && activities.length === 0 && (
          <p className="empty-text">No recent activities yet.</p>
        )}

        {!isLoading &&
          activities.map((activity) => (
            <ActivityItem
              key={activity.id}
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
