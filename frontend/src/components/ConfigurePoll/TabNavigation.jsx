import { navItems } from "../../constants/sidebarItems";

const TabNavigation = ({ activeTab, setActiveTab, visitedTabs }) => {
  
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

          return (
            <button
              key={index}
              onClick={() => handleTabClick(item.label)}
              disabled={isDisabled}
              className={`config-tab-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
            >
              <span className="material-symbols-outlined config-tab-icon">
  {item.icon}
</span>
              <span className="config-tab-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;