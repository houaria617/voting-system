import { useState } from 'react';
import { navItems } from '../../constants/sidbarItems';
const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  // const navItems = [
  //   { icon: "settings", label: "General" },
  //   { icon: "palette", label: "Themes" },
  //   { icon: "gavel", label: "Voting Rules" },
  //   { icon: "calendar_today", label: "Schedule" },
  //   { icon: "tune", label: "Advanced" },
  // ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div>
          <div className="sidebar-header">
            
            <div className="sidebar-info">
              <h3>My Awesome Poll</h3>
              <p>By John Doe</p>
            </div>
          </div>

          <div className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setIsOpen(false); // Close sidebar on mobile after selection
                }}
                className={`nav-item ${activeTab === item.label ? "active" : ""}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        
      </aside>
    </>
  );
};

export default Sidebar;