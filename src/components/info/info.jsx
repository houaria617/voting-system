import "./InfoPlaceholder.module.css";

const InfoPlaceholder = ({
  label,
  placeholder,
  type = "text",
  required = false,
  value = "",
  onChange,
  color = "#000",
  className
}) => {
  return (
    <div className="input_field">
      <label style={{ color }}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className={className}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InfoPlaceholder;
