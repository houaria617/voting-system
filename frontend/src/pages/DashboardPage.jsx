import React, { useState } from 'react';
import Sidebar from '../components/dashboard/SideBar.jsx';
import PollItem from '../components/dashboard/ PollItem.jsx';
import QuickStats from '../components/dashboard/QuickStats.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import Pagination from '../components/dashboard/Pagination.jsx';
import Button from '../components/common/Button.jsx';
import { BarChart3 } from 'lucide-react';
import { pollsData, statsData, activitiesData } from '../data/mockData.js';
import '../styles/dashboard.css';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');
   const navigate = useNavigate();
  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-spacer"></div>
          <Button variant="primary"
          onClick={() => navigate('/create-poll')}
            >
            Create New Poll
          </Button>
        </header>
        
        <main className="dashboard-main">
          <div className="main-content">
            <div className="polls-section">
              <h1 className="page-title">Active Polls</h1>
              
              <div className="polls-list">
                {pollsData.map(poll => (
                  <PollItem key={poll.id} poll={poll} />
                ))}
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={3}
                onPageChange={setCurrentPage}
              />
            </div>
            
            <div className="sidebar-section">
              <QuickStats stats={statsData} />
              <RecentActivity activities={activitiesData} />
            </div>
          </div>
        </main>
        
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo-icon">
                <BarChart3 size={20} />
              </div>
              <span className="logo-text">VoteSys</span>
            </div>
            
            <div className="footer-links">
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Privacy Policy</a>
            </div>
            
            <p className="footer-copyright">
              © 2024 VoteSys. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
