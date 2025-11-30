import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Plus, Trash2 } from "lucide-react";
import CreatePollPage from './pages/createPoll/createPoll';
import ConfigurePollPage from './pages/configurePoll/ConfigurePoll';
import './styles/index.css';
import SharePoll from './pages/sharePoll/sharePoll';  
import PollLandingPage from './pages/PollLandingPage';
import DashboardPage from './pages/DashboardPage';
import PollPreviewPage from './pages/PollPreviewPage';
import AccessDenied from "./pages/accessDenied/accessDenied";
import VoteRecorded from "./pages/confirmedPoll/confirmedPoll";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-poll" element={<CreatePollPage />} />
        <Route path="/configure-poll" element={<ConfigurePollPage />} />
        <Route path="/SharePoll" element={<SharePoll />} />
        <Route path='/DashboardPage' element={<DashboardPage />} />
        <Route path='/pollpreview' element={<PollPreviewPage/>} />
        <Route path='/pollpreview' element={<PollPreviewPage/>} />
        <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/poll-confirmed" element={<VoteRecorded />} />


      </Routes>
    </Router>
  )
  
  
}

export default App;
