
// ===== PollHeader.jsx =====
const PollHeader = () => {
  return (
    <div className="card-container">
      <div className="poll-header">
        <div className="header-icon">
          <svg
            className="icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h1 className="header-title">Pollify</h1>
      </div>
    </div>
  );
};

export default PollHeader;