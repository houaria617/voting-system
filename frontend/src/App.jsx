import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
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
import PollVotePage from './pages/PollVotePage'; 

function App() {
                                                
    return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={< Signup/>}/>

        {/* Poll creation flow */}
        <Route path="/create-poll" element={<CreatePollPage />} />
        <Route path="/configure-poll/:pollId?" element={<ConfigurePollPage />} />
        <Route path="/share-poll" element={<SharePoll />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Poll preview */}
        <Route path="/poll/:pollId" element={<PollLandingPage />} />
        <Route path="/share-poll/:pollId?" element={<SharePoll />} />
        {/* Redirect unknown routes to home */}
        <Route path="/vote/:pollId" element={<PollVotePage />} />
      </Routes>
    </Router>
  );
  
  
}

export default App;


// import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './pages/Login/Login';
// import SignupPage from './pages/Signup/Signup';
// import DashboardPage from './pages/DashboardPage';
// import CreatePollPage from './pages/CreatePoll/createPoll';
// import ConfigurePollPage from './pages/configurePoll/ConfigurePoll';
// import PollLandingPage from './pages/PollLandingPage';
// import SharePollPage from './pages/SharePoll/sharePoll';
// import authService from './services/authService';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = authService.isAuthenticated();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// // Public Route (redirects to dashboard if already logged in)
// const PublicRoute = ({ children }) => {
//   const isAuthenticated = authService.isAuthenticated();
//   return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={
//           <PublicRoute>
//             <LoginPage />
//           </PublicRoute>
//         } />
        
//         <Route path="/signup" element={
//           <PublicRoute>
//             <SignupPage />
//           </PublicRoute>
//         } />

//         {/* Protected Routes */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/create-poll" element={
//           <ProtectedRoute>
//             <CreatePollPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/configure-poll" element={
//           <ProtectedRoute>
//             <ConfigurePollPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/configure-poll/:pollId" element={
//           <ProtectedRoute>
//             <ConfigurePollPage />
//           </ProtectedRoute>
//         } />

//         {/* Poll Preview - with pollId parameter */}
//         <Route path="/poll/:pollId" element={
//           <ProtectedRoute>
//             <PollLandingPage />
//           </ProtectedRoute>
//         } />

//         {/* Share Poll Page */}
//         <Route path="/share-poll/:pollId" element={
//           <ProtectedRoute>
//             <SharePollPage />
//           </ProtectedRoute>
//         } />

//         {/* Default Route */}
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
//         {/* 404 Route */}
//         <Route path="*" element={
//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: '100vh',
//             gap: '1rem'
//           }}>
//             <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
//             <p style={{ fontSize: '1.5rem', color: '#6b7280' }}>Page Not Found</p>
//             <a href="/dashboard" style={{
//               padding: '0.75rem 1.5rem',
//               backgroundColor: '#137fec',
//               color: 'white',
//               textDecoration: 'none',
//               borderRadius: '8px',
//               fontWeight: '600'
//             }}>
//               Go to Dashboard
//             </a>
//           </div>
//         } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;