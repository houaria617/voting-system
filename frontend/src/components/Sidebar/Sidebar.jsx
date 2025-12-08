import { useState } from 'react';
import { navItems } from '../../constants/sidbarItems';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="config-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <aside className={`config-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div>
          <div className="config-sidebar-header">
            <div className="config-sidebar-info">
              <h3>My Awesome Poll</h3>
              <p>By John Doe</p>
            </div>
          </div>

          <div className="config-sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setIsOpen(false);
                }}
                className={`config-nav-item ${activeTab === item.label ? "active" : ""}`}
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