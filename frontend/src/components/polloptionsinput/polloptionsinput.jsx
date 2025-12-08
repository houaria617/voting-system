// ===== PollOptionsInput.jsx =====
const PollOptionsInput = ({ options, onOptionChange, onRemoveOption }) => {
  return (
    <div className="options-container">
      <label className="form-label">Options</label>
      <div>
        {options.map((option, index) => (
          <div key={index} className="option-item">
            <input
              type="text"
              value={option}
              onChange={(e) => onOptionChange(index, e.target.value)}
              placeholder="Enter an answer option"
              className="form-control option-input"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => onRemoveOption(index)}
                className="remove-option-btn"
                title="Remove option"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollOptionsInput;