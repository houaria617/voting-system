import React from 'react';
import RadioOption from '../common/RadioOption';
import '../../styles/pollLanding.css';

const PollQuestion = ({ 
  question, 
  description, 
  options, 
  selectedOption, 
  onOptionChange,
  allowMultiple = false
}) => {
  return (
    <div className="poll-question-card">
      <div className="question-header">
        <h2 className="question-title">{question}</h2>
        
        {/* Voting Type Label */}
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          {allowMultiple ? 'Multiple Choice' : 'Single Choice Only'}
        </p>
        
        <p className="question-description">{description}</p>
      </div>

      <div className="options-list">
        {options && options.length > 0 ? (
          options.map(option => (
            <RadioOption
              key={option.id}
              id={`option-${option.id}`}
              name="poll-option"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => onOptionChange(option.id)}
              label={option.text}
            />
          ))
        ) : (
          <p style={{ 
            color: '#9ca3af', 
            fontStyle: 'italic',
            padding: '2rem',
            textAlign: 'center'
          }}>
            No options available
          </p>
        )}
      </div>

      <button 
        className="submit-button"
        disabled={!selectedOption}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default PollQuestion;