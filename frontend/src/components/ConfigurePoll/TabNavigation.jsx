import { navItems } from "../../constants/sidebarItems";

const TabNavigation = ({ 
  activeTab, 
  setActiveTab, 
  visitedTabs, 
  configData,
  tabErrors,
  isTabValid 
}) => {
  
  const handleTabClick = (tabName) => {
    // Only allow clicking on visited tabs
    if (visitedTabs.includes(tabName)) {
      setActiveTab(tabName);
    }
  };

  return (
    <div className="config-tab-navigation">
      <div className="config-tab-container">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.label;
          const isVisited = visitedTabs.includes(item.label);
          const isDisabled = !isVisited;
          const hasErrors = tabErrors[item.label] && tabErrors[item.label].length > 0;
          const isValid = isVisited && !hasErrors;

          return (
            <button
              key={index}
              onClick={() => handleTabClick(item.label)}
              disabled={isDisabled}
              className={`config-tab-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              style={{
                position: 'relative',
                borderBottom: isActive && hasErrors ? '3px solid #ef4444' : 
                             isActive ? '3px solid #137fec' : 
                             hasErrors && isVisited ? '3px solid #fbbf24' : 
                             'none'
              }}
            >
              <span className="material-symbols-outlined config-tab-icon">
                {item.icon}
              </span>
              <span className="config-tab-label">{item.label}</span>
              
              {/* Error indicator - Red asterisk for tabs with errors */}
              {hasErrors && isVisited && (
                <span 
                  style={{
                    marginLeft: '0.5rem',
                    color: '#ef4444',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    lineHeight: '1'
                  }}
                  title={`${tabErrors[item.label].length} error(s) in this tab`}
                >
                  *
                </span>
              )}

              {/* Success indicator - Green checkmark for complete tabs */}
              {isValid && item.label !== activeTab && (
                <span 
                  style={{
                    marginLeft: '0.5rem',
                    color: '#16a34a',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    lineHeight: '1'
                  }}
                  title="This tab is complete"
                >
                  ✓
                </span>
              )}

              {/* Error count badge for tabs with multiple errors */}
              {hasErrors && isVisited && tabErrors[item.label].length > 1 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0.25rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '9999px',
                    minWidth: '1.25rem',
                    textAlign: 'center'
                  }}
                  title={`${tabErrors[item.label].length} errors`}
                >
                  {tabErrors[item.label].length}
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