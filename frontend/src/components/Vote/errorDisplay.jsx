// ============================================
// FILE: src/components/voter/ErrorDisplay.jsx
// ============================================

import React from 'react';

const ErrorDisplay = ({ error, theme, onRetry }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundColor,
    padding: '1rem'
  }}>
    <div style={{
      maxWidth: '28rem',
      width: '100%',
      padding: '1.5rem',
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: '0.5rem',
      textAlign: 'center'
    }}>
      <p style={{ color: '#991b1b', fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>
        Error
      </p>
      <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>{error}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '0.625rem 1.25rem',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.875rem'
        }}
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorDisplay;
