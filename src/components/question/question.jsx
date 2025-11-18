import InfoPlaceholder from "../info/inf";

const PollQuestionInput = ({ value, onChange }) => {
  return (
    <InfoPlaceholder
      label="Poll Question"
      placeholder="What's your question?"
      required={true}
      value={value}
      onChange={onChange}
    />
  );
};

export default PollQuestionInput;