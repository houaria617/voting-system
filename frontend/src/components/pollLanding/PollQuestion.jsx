import React from 'react';
import RadioOption from '../common/RadioOption';
import '../../styles/pollLanding.css';

const PollQuestion = ({ 
  question, 
  description, 
  options = [], 
  selectedOption, 
  onOptionChange,
  isMultipleChoice = false  // ✅ Renamed from allowMultiple
}) => {
  console.log('🎯 PollQuestion options:', options);
  
  // ✅ NORMALIZE options to {id, text} format
  const normalizedOptions = options.map((opt, index) => {
    if (typeof opt === 'string') {
      return { id: index + 1, text: opt };
    } else if (opt && (opt.id || opt.option_text || opt.text)) {
      return {
        id: opt.id || index + 1,
        text: opt.option_text || opt.text || opt
      };
    }
    return { id: index + 1, text: 'Option ' + (index + 1) };
  });

  console.log('✅ Normalized options:', normalizedOptions);

  return (
    <div className="poll-question-card">
      <div className="question-header">
        <h2 className="question-title">{question}</h2>
        
        {/* ✅ Voting Type Label */}
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          {isMultipleChoice ? ' Multiple Choice' : ' Single Choice Only'}
        </p>
        
        {description && <p className="question-description">{description}</p>}
      </div>

      <div className="options-list">
        {normalizedOptions.length > 0 ? (
          normalizedOptions.map(option => (
        // In PollQuestion.jsx - RadioOption call:
// In PollQuestion.jsx RadioOption call:
<RadioOption
  key={option.id}
  id={`option-${option.id}`}
  name="poll-option"
  type={isMultipleChoice ? "checkbox" : "radio"}
  value={option.id}
  checked={isMultipleChoice 
    ? (selectedOption || []).includes(option.id)
    : selectedOption === option.id
  }
  onChange={(optionId) => onOptionChange(optionId, isMultipleChoice)}  // ✅ Pass BOTH
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
        disabled={!selectedOption || selectedOption.length === 0}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default PollQuestion;
