import "../OptionInput/OptionInput";

const PollOptionsInput = ({ options, setOptions }) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">Options</label>
      
      {options.map((option, index) => (
        <OptionInput
          key={index}
          value={option}
          onChange={handleOptionChange}
          onRemove={handleRemoveOption}
          index={index}
          showRemove={options.length > 2}
        />
      ))}
      
      <button
        type="button"
        className="btn btn-link text-primary p-0 mt-2"
        onClick={handleAddOption}
      >
        ➕ Add Option
      </button>
    </div>
  );
};

export default PollOptionsInput;