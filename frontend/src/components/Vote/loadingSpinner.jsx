import React from 'react';

const LoadingSpinner = ({ theme }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundColor
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        border: `4px solid ${theme.primaryColor}30`,
        borderTop: `4px solid ${theme.primaryColor}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
      <p style={{ marginTop: '1rem', color: theme.textColor }}>Loading poll...</p>
    </div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;

