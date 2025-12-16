import React from 'react';
import { Info } from 'lucide-react';
import '../../styles/pollLanding.css';

const PageHeader = ({ onBackToDashboard, logoUrl }) => {
  return (
    <header className="page-header">
      <div className="header-left">
        <div className="logo-container">
          {/* ✅ CUSTOM LOGO OR DEFAULT ICON */}
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Company Logo" 
              className="custom-logo"
              style={{
                maxHeight: '40px',
                maxWidth: '150px',
                objectFit: 'contain',
                marginRight: '0.75rem'
              }}
              onError={(e) => {
                // Fallback if logo fails to load
                e.target.style.display = 'none';
                // Show default icon instead
                const icon = document.createElement('div');
                icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
                e.target.parentNode.insertBefore(icon, e.target);
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