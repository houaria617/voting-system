import React from 'react';
import '../../styles/common.css';

const RadioOption = ({ id, name, value, checked, onChange, label }) => {
  return (
    <label className="radio-option">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="radio-input"
      />
      <span className="radio-custom"></span>
      <span className="radio-label">{label}</span>
    </label>
  );
};

export default RadioOption;