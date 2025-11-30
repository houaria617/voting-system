import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Plus, Trash2 } from "lucide-react";
import CreatePollPage from './pages/createPoll/createPoll';
import ConfigurePollPage from './pages/configurePoll/ConfigurePoll';
import './styles/index.css';
import SharePoll from './pages/sharePoll/sharePoll';  
import PollLandingPage from './pages/PollLandingPage';
import Home from './pages/Welcome/Welcome';
import Login from './pages/Login/Login';
 

import DashboardPage from './pages/DashboardPage';
import PollPreviewPage from './pages/PollPreviewPage';

function App() {
                                                
    return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vote/:pollId" element={<VotingInterface />} />

        {/* Poll creation flow */}
        <Route path="/create-poll" element={<CreatePollPage />} />
        <Route path="/configure-poll" element={<ConfigurePollPage />} />
        <Route path="/share-poll" element={<SharePoll />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Poll preview */}
        <Route path="/poll-preview" element={<PollPreviewPage />} />
        <Route path="/poll/:pollId" element={<PollLandingPage />} />
      </Routes>
    </Router>
  );
  
  
  
}

export default App;