import React from 'react';
import RadioOption from '../common/RadioOption';
import '../../styles/pollLanding.css';

const PollQuestion = ({ 
  question, 
  description, 
  options, 
  selectedOption, 
  onOptionChange 
}) => {
  return (
    <div className="poll-question-card">
      <div className="question-header">
        <h2 className="question-title">{question}</h2>
        <p className="question-description">{description}</p>
      </div>

      <div className="options-list">
        {options.map(option => (
          <RadioOption
            key={option.id}
            id={`option-${option.id}`}
            name="poll-option"
            value={option.id}
            checked={selectedOption === option.id}
            onChange={() => onOptionChange(option.id)}
            label={option.text}
          />
        ))}
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