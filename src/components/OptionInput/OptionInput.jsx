const OptionInput = ({ value, onChange, onRemove, index, showRemove }) => {
  return (
    <div className="mb-2">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter an answer option"
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
        />
        {showRemove && (
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={() => onRemove(index)}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default OptionInput;