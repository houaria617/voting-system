import React from 'react';
import '../../styles/pollLanding.css';

const PollActions = ({ onEditPoll, onSharePoll }) => {
  return (
    <div className="poll-actions">
      <button onClick={onEditPoll} className="action-button action-button-secondary">
        Edit Poll
      </button>
      <button onClick={onSharePoll} className="action-button action-button-primary">
        Share Poll
      </button>
    </div>
  );
};

export default PollActions;
