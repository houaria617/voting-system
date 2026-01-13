import React from 'react';
import { Info } from 'lucide-react';
import '../../styles/pollLanding.css';

const PageHeader = ({ onBackToDashboard }) => {
  return (
    <header className="page-header">
      <div className="header-left">
        <div className="logo-container">
          <Info size={24} className="logo-icon" />
          <span className="logo-text">Online Voting</span>
        </div>
      </div>
      <button onClick={onBackToDashboard} className="back-link">
        Back to Dashboard
      </button>
    </header>
  );
};

export default PageHeader;
