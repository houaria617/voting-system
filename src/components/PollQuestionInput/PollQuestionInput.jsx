

// type InfoPlaceholderProps = {
//   label: string;
//   placeholder?: string;
//   type?: string;
//   required?: boolean;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// };

// const InfoPlaceholder: React.FC<InfoPlaceholderProps> = ({
//   label,
//   placeholder,
//   type = "text",
//   required = false,
//   value = "",
//   onChange,
// }) => {
//   return (
//     <label style={{ display: "block" }}>
//       <div style={{ marginBottom: 4 }}>{label}</div>
//       <input
//         placeholder={placeholder}
//         type={type}
//         required={required}
//         value={value}
//         onChange={onChange}
//         style={{ padding: 8, width: "100%" }}
//       />
//     </label>
//   );
// };

// interface PollQuestionInputProps {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const PollQuestionInput: React.FC<PollQuestionInputProps> = ({
//   value,
//   onChange,
// }) => {
//   return (
//     <InfoPlaceholder
//       label="Poll Question"
//       placeholder="What's your question?"
//       type="text"
//       required={true}
//       value={value}
//       onChange={onChange}
//     />
//   );
// };

// export default PollQuestionInput;
