import React from 'react';
import { Share2 } from 'lucide-react';
import '../../styles/pollPreview.css';

const PollHeader = ({ title, description }) => {
  return (
    <div className="poll-header">
      <div className="poll-header-content">
        <h1 className="poll-title">Poll Results: {title}</h1>
        <p className="poll-description">{description}</p>
      </div>
      <button className="share-button">
        <Share2 size={20} />
      </button>
    </div>
  );
};

export default PollHeader;