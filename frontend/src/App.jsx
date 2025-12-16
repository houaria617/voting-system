import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Plus, Trash2 } from "lucide-react";
import CreatePollPage from './pages/createPoll/createPoll';
import ConfigurePollPage from './pages/configurePoll/ConfigurePoll';
import './styles/index.css';
import SharePoll from './pages/sharePoll/sharePoll';  
import PollLandingPage from './pages/PollLandingPage';
import Home from './pages/Welcome/Welcome';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import DashboardPage from './pages/DashboardPage';
import PollPreviewPage from './pages/PollPreviewPage';
import VoterPage from './pages/PollVotePage'; 
import authService from './services/authService'; // Add this import

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages - no auth required */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/Signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />

        {/* Protected pages - require login */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-poll" 
          element={
            <ProtectedRoute>
              <CreatePollPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configure-poll/:pollId?" 
          element={
            <ProtectedRoute>
              <ConfigurePollPage />
            </ProtectedRoute>
          } 
        />

        {/* Public poll pages - no login required */}
        <Route path="/poll/:pollId" element={<PollLandingPage />} />
        <Route path="/vote/:pollId" element={<VoterPage />} />
        
        {/* Share pages */}
        <Route path="/share-poll/:pollId?" element={<SharePoll />} />

        {/* 404 Catch-all */}
        <Route path="*" element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem'
          }}>
            <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#6b7280' }}>Page Not Found</p>
            <a href="/dashboard" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#137fec',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Go to Dashboard
            </a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
