import React from 'react';
import { BarChart3 } from 'lucide-react';
import { MENU_ITEMS } from '../../constants/menuItems';
import '../../styles/dashboard.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/Electra_Voting_Platform_Logo_-_Flat_Vector_Design-removebg-preview.png" alt="Electra" className="sidebar-logo-image" />
        <h1 className="logo-text">Electra</h1>
      </div>
      
      <nav className="sidebar-nav">
        {MENU_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon size={20} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;