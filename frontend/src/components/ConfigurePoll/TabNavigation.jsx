import { navItems } from "../../constants/sidebarItems";

const TabNavigation = ({ activeTab, setActiveTab, visitedTabs, configData }) => {
  
  const handleTabClick = (tabName) => {
    // Only allow clicking on visited tabs
    if (visitedTabs.includes(tabName)) {
      setActiveTab(tabName);
    }
  };

  // Check if Schedule tab is complete
  const isScheduleComplete = configData?.startDate && 
                             configData?.closeDate && 
                             configData.startDate.trim() !== '' && 
                             configData.closeDate.trim() !== '';

  return (
    <div className="config-tab-navigation">
      <div className="config-tab-container">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.label;
          const isVisited = visitedTabs.includes(item.label);
          const isDisabled = !isVisited;
          const isScheduleTab = item.label === "Schedule";
          const showWarning = isScheduleTab && !isScheduleComplete;
          const showSuccess = isScheduleTab && isScheduleComplete;

          return (
            <button
              key={index}
              onClick={() => handleTabClick(item.label)}
              disabled={isDisabled}
              className={`config-tab-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              style={{
                position: 'relative'
              }}
            >
              <span className="material-symbols-outlined config-tab-icon">
                {item.icon}
              </span>
              <span className="config-tab-label">{item.label}</span>
              
              {/* Required indicator (red asterisk) for incomplete Schedule tab */}
              {showWarning && (
                <span style={{
                  marginLeft: '0.25rem',
                  color: '#ef4444',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  lineHeight: '1'
                }}>
                  *
                </span>
              )}

              {/* Success indicator (green checkmark) for complete Schedule tab */}
              {showSuccess && (
                <span style={{
                  marginLeft: '0.25rem',
                  color: '#16a34a',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  lineHeight: '1'
                }}>
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;