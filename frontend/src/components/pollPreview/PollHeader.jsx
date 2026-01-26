import React from 'react';
import { Share2 } from 'lucide-react';
import '../../styles/pollPreview.css';
import { useNavigate } from "react-router-dom";
import Button from '../common/Button';

const PollHeader = ({ title, description, onShare }) => {
  const navigate = useNavigate();
  return (
    <div className="poll-header">
      <div className="poll-header-content">
        <h1 className="poll-title">Poll Results: {title}</h1>
        <p className="poll-description">{description}</p>
      </div>

      {/* BUTTONS CONTAINER */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button className="share-button" onClick={onShare}>
          <Share2 size={20} />
        </button>

        <Button
          variant="primary"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PollHeader;
