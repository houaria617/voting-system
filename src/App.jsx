import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Plus, Trash2 } from "lucide-react";
import CreatePollPage from './pages/createPoll/createPoll';
import ConfigurePollPage from './pages/configurePoll/ConfigurePoll';
import './styles/index.css';
import SharePoll from './pages/sharePoll/sharePoll';  

import React from 'react';
import './styles/index.css';
import PollLandingPage from './pages/PollLandingPage';
import DashboardPage from './pages/DashboardPage';
import PollPreviewPage from './pages/PollPreviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-poll" element={<CreatePollPage />} />
        <Route path="/configure-poll" element={<ConfigurePollPage />} />
        <Route path="/SharePoll" element={<SharePoll />} />
      </Routes>
    </Router>
  )
  return <DashboardPage />;
}

export default App;