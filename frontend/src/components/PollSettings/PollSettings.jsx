const PollSettings = ({ showSettings, onToggle }) => {
  return (
    <div className="settings-container">
      <button
        type="button"
        onClick={onToggle}
        className="settings-toggle-btn"
      >
        <span>Poll Settings</span>
        <svg
          className={`settings-icon ${showSettings ? "expanded" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showSettings && (
        <div className="settings-content">
          <p className="settings-text">
            Additional settings can be added here...
          </p>
        </div>
      )}
    </div>
  );
};

export default PollSettings;
