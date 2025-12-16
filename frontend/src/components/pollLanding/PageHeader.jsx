import React from 'react';
import { Info } from 'lucide-react';
import '../../styles/pollLanding.css';

const PageHeader = ({ onBackToDashboard, logoUrl }) => {  // ⭐ ADD logoUrl prop
  return (
    <header className="page-header">
      <div className="header-left">
        <div className="logo-container">
          {/* ⭐ CUSTOM LOGO OR DEFAULT ICON */}
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Company Logo" 
              className="custom-logo"
              onError={(e) => {  // Fallback if logo fails
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Info size={24} className="logo-icon" />
          )}
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
