import React from 'react';

const PollQuestion = ({ 
  question, 
  description, 
  options, 
  selectedOption, 
  onOptionChange,
  allowMultiple = false,
  theme = {}
}) => {
  const primaryColor = theme.primaryColor || '#137fec';
  const logo = theme.logo || '';

  return (
    <div className="poll-question-card">
      {/* Logo if exists */}
      {logo && (
        <div style={{
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <img 
            src={logo} 
            alt="Poll Logo" 
            style={{
              maxWidth: '150px',
              maxHeight: '80px',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Question */}
      <h2 className="poll-question-title">{question}</h2>
      
      {/* Description */}
      {description && (
        <p className="poll-question-description">{description}</p>
      )}

      {/* Voting Type Indicator */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#f0f7ff',
        border: `1px solid ${primaryColor}20`,
        borderRadius: '6px',
        fontSize: '0.875rem',
        color: primaryColor,
        fontWeight: '600',
        marginBottom: '1.5rem'
      }}>
        {allowMultiple ? (
          <>
            <span>☑</span>
            <span>Multiple Choice</span>
          </>
        ) : (
          <>
            <span>⭕</span>
            <span>Single Choice</span>
          </>
        )}
      </div>

      {/* Options */}
      <div className="poll-options">
        {options.map((option) => {
          const isSelected = allowMultiple 
            ? (Array.isArray(selectedOption) && selectedOption.includes(option.id))
            : selectedOption === option.id;

          return (
            <label
              key={option.id}
              className={`poll-option ${isSelected ? 'selected' : ''}`}
              style={{
                borderColor: isSelected ? primaryColor : '#e5e7eb',
                backgroundColor: isSelected ? `${primaryColor}10` : 'white'
              }}
            >
              <input
                type={allowMultiple ? "checkbox" : "radio"}
                name="poll-option"
                value={option.id}
                checked={isSelected}
                onChange={() => onOptionChange(option.id)}
                style={{
                  accentColor: primaryColor
                }}
              />
              <span className="poll-option-text">{option.text}</span>
              
              {/* Show vote count if available (in results view) */}
              {option.votes !== undefined && option.votes > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontWeight: '600'
                }}>
                  {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PollQuestion;