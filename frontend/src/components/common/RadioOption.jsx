import React from 'react';
import '../../styles/common.css';

const RadioOption = ({ 
  id, name, value, checked, onChange, label, type = "radio" 
}) => {
  return (
    <label className="radio-option">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}  // ✅ ONLY pass value!
        className="radio-input"
      />
      <span className="radio-custom"></span>
      <span className="radio-label">{label}</span>
    </label>
  );
};

export default RadioOption;
