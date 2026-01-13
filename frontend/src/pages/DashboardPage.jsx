import React, { useEffect, useState } from 'react';
import Sidebar from '../components/dashboard/SideBar.jsx';
import PollItem from '../components/dashboard/ PollItem.jsx';
import QuickStats from '../components/dashboard/QuickStats.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import Pagination from '../components/dashboard/Pagination.jsx';
import Button from '../components/common/Button.jsx';
import { BarChart3 } from 'lucide-react';
import '../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardPolls } from '../api/pollApi';

const DashboardPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigate = useNavigate();

  const pollsPerPage = 3; // Number of polls per page

  // ============================
  // Fetch Dashboard Data
  // ============================
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchDashboardPolls();
        console.log('📊 DASHBOARD JSON RESPONSE:', data);
        setPolls(data.polls || []);
      } catch (error) {
        console.error('❌ Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Calculate polls for current page
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);

  const totalPages = Math.ceil(polls.length / pollsPerPage);

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dashboard-content">
        {/* ================= HEADER ================= */}
        <header className="dashboard-header">
          <div className="header-spacer"></div>
          <Button variant="primary" onClick={() => navigate('/create-poll')}>
            Create New Poll
          </Button>
        </header>

        {/* ================= MAIN ================= */}
        <main className="dashboard-main">
          <div className="main-content">
            {/* ===== Polls Section ===== */}
            <div className="polls-section">
              <h1 className="page-title">Active Polls</h1>

              <div className="polls-list">
                {loading && <p>Loading polls...</p>}

                {!loading && polls.length === 0 && <p>No polls created yet.</p>}

                {!loading &&
                  currentPolls.map((poll) => (
                    <PollItem key={poll.id} poll={poll} />
                  ))}
              </div>

              {/* Pagination */}
              {polls.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>

            {/* ===== Right Sidebar ===== */}
            <div className="sidebar-section">
              <QuickStats
                stats={[
                  { label: 'Total Polls', value: polls.length },
                  {
                    label: 'Active Polls',
                    value: polls.filter((p) => p.status === 'ACTIVE').length,
                  },
                  {
                    label: 'Closed Polls',
                    value: polls.filter((p) => p.status === 'CLOSED').length,
                  },
                ]}
              />

              <RecentActivity
                activities={polls.slice(0, 5).map((poll) => ({
                  id: poll.id,
                  message: `Poll "${poll.title}" created`,
                  date: poll.created_at,
                }))}
              />
            </div>
          </div>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/Electra_Voting_Platform_Logo_-_Flat_Vector_Design-removebg-preview.png" alt="Electra" className="footer-logo-image" />
              <span className="logo-text">Electra</span>
            </div>

            <div className="footer-links">
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Privacy Policy</a>
            </div>

            <p className="footer-copyright">
              © 2024 Electra. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
