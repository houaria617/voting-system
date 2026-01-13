import React, { useState } from 'react';

const OptionCard = ({ option, isSelected, onSelect, theme, showResults, percentage }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (!showResults) {
      onSelect(option.id);
    }
  };

  const getBackgroundColor = () => {
    if (isSelected) return `${theme.primaryColor}15`;
    if (isHovered && !showResults) return theme.optionHoverBackground;
    return theme.optionBackground;
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '1rem',
        marginBottom: '0.75rem',
        borderRadius: '0.5rem',
        border: `2px solid ${isSelected ? theme.primaryColor : '#e5e7eb'}`,
        backgroundColor: getBackgroundColor(),
        cursor: showResults ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        overflow: 'hidden'
      }}
    >
      {showResults && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: `${theme.primaryColor}20`,
            transition: 'width 0.5s ease',
            zIndex: 0
          }}
        />
      )}
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
          <div
            style={{
              width: '1.25rem',
              height: '1.25rem',
              borderRadius: '50%',
              border: `2px solid ${isSelected ? theme.primaryColor : '#d1d5db'}`,
              backgroundColor: isSelected ? theme.primaryColor : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {isSelected && (
              <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: 'white' }} />
            )}
          </div>
          <span style={{ color: theme.textColor, fontSize: '1rem', fontWeight: '500' }}>
            {option.option_text}
          </span>
        </div>
        
        {showResults && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: theme.textColor, fontSize: '0.875rem', fontWeight: '600' }}>
              {percentage}%
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              ({option.vote_count_cache || 0} votes)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionCard;
