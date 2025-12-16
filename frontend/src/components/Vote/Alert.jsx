// ============================================
// FILE: src/components/voter/Alert.jsx
// ============================================

import React from 'react';

const Alert = ({ type, message, icon }) => {
  const styles = {
    success: {
      bg: '#d1fae5',
      border: '#6ee7b7',
      text: '#065f46',
      iconColor: '#059669'
    },
    error: {
      bg: '#fee2e2',
      border: '#fca5a5',
      text: '#991b1b',
      iconColor: '#dc2626'
    }
  };

  const style = styles[type] || styles.error;

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '0.5rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      {icon && React.cloneElement(icon, { size: 20, style: { color: style.iconColor } })}
      <span style={{ color: style.text, fontWeight: '500' }}>{message}</span>
    </div>
  );
};

export default Alert;


