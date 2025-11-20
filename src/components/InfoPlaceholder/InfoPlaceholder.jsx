// InfoPlaceholder.jsx

const InfoPlaceholder = ({
  label,
  placeholder,
  type = "text",
  required = false,
  value = "",
  onChange,
  className = ""
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${className}`}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InfoPlaceholder;
