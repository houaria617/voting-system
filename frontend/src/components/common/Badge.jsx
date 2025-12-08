import React from 'react';
import '../../styles/common.css';

const Badge = ({ children, variant = 'active' }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
};

export default Badge;