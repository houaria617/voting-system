import { useState } from 'react';
const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { icon: "settings", label: "General" },
    { icon: "palette", label: "Themes" },
    { icon: "gavel", label: "Voting Rules" },
    { icon: "calendar_today", label: "Schedule" },
    { icon: "tune", label: "Advanced" },
  ];

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
            <div
              className="sidebar-avatar"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZTjBV5apMvkhGtWfnk_-jM5zTnJfu9ro5mFEUdgdyXMc24La4vRr0a0Khipu40CY5foOYOaS2xuKlbH8t0BY9kMlLoUzdZ2FMdUkr7r-5l3Yfzx5guBIeLitm4BtK-CYiqje27DXKj9ms5-7ZL2Ah9XPRxVm7nxVvEsgLEj0ctJnImsit4JhlNxjcqqDBhkbFH9IDhjdcNV2hDHqExA5X5GjT9V_XaPNNtsT2WzXxRDW7PL4LSCmLpryOHzPW7liztQMmqcvHmlGk')",
              }}
            ></div>
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

        <button className="new-poll-btn">New Poll</button>
      </aside>
    </>
  );
};

export default Sidebar;