// ===== CreatePollForm.jsx =====
import PollQuestionInput from "../question/question";
import PollOptionsInput from "../polloptionsinput/polloptionsinput";
import PollSettings from "../PollSettings/PollSettings";
import { useState } from "react";

const CreatePollForm = ({ onSubmit, onCancel }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [showSettings, setShowSettings] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      alert("Please enter a poll question");
      return;
    }

    const filledOptions = options.filter((opt) => opt.trim() !== "");
    if (filledOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }

    onSubmit({ question, options: filledOptions });
    setQuestion("");
    setOptions(["", ""]);
  };

  const handleCancelClick = () => {
    setQuestion("");
    setOptions(["", ""]);
    onCancel();
  };

  return (
    <div className="card-container">
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 className="form-section-title">Create a New Poll</h2>
        <p className="form-section-subtitle">
          Fill out the details below to create your poll.
        </p>
      </div>

      <PollQuestionInput
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <PollOptionsInput
        options={options}
        onOptionChange={handleOptionChange}
        onRemoveOption={handleRemoveOption}
      />

      <button
        type="button"
        onClick={handleAddOption}
        className="add-option-btn"
      >
        <span>+</span>
        Add Option
      </button>

      <PollSettings
        showSettings={showSettings}
        onToggle={() => setShowSettings(!showSettings)}
      />

      <div className="button-group">
        <button
          type="button"
          onClick={handleCancelClick}
          className="btn-base btn-cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-base btn-primary"
        >
          Create Poll
        </button>
      </div>
    </div>
  );
};

export default CreatePollForm;