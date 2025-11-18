import { useState } from "react";
import PollQuestionInput from "../question/question";
import PollOptionsInput from "../polloptionsinput/polloptionsinput";

const CreatePollForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (options.some((opt) => !opt.trim())) {
      alert("Please fill all options");
      return;
    }

    console.log("Poll Data:", { question, options });
    alert("Poll created successfully!");
  };

  const handleCancel = () => {
    setQuestion("");
    setOptions(["", ""]);
  };

  return (
    <div className="container mt-5">
      <h2>Create Poll</h2>

      <PollQuestionInput
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

    

      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleSubmit}>Create Poll</button>
    </div>
  );
};

export default CreatePollForm;
