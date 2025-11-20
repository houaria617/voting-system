// ===== PollQuestionInput.jsx =====
const PollQuestionInput = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label className="form-label">
        Poll Question <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="What's your question?"
        className="form-control"
      />
    </div>
  );
};

export default PollQuestionInput;