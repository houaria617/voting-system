import React from 'react';
import '../../styles/common.css';

const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
