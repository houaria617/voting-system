import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/ForgotPassword.css';
import { FaHome } from "react-icons/fa";
import authService from '../services/authService';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire('Error', 'Please enter your email', 'error');
      return;
    }

    const result = await authService.forgotPassword(email);

    if (result.success) {
      Swal.fire('Success', result.message, 'success');
    } else {
      Swal.fire('Error', result.message, 'error');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="forgot-password-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon"><FaHome /></span>
            VoteSphere

          </div>
          <nav className="nav-menu">
            <a href="/about" className="nav-link">About Us</a>
            <a href="/elections" className="nav-link">Elections</a>
            <a href="/contact" className="nav-link">Contact Us</a>
            <a href="/login" className="nav-link">Login</a>
            <a href="/signup" className="nav-link signup">Sign Up</a>
          </nav>
        </div>
      </header>

      

      {/* Main Content */}
      <main className="main-content">
        
        <div className="card-container">
          <div className="forgot-password-card">
            <h1 className="title">Forgot Password ?</h1>
            <p className="subtitle">
              No worries, we'll send you reset instructions.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="reset-button">
                Reset Password
              </button>
            </form>

            <p className="login-link">
              Remember your password?{' '}
              <a href="/login" className="login-link-text">Back to Login</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 VoteSphere. Secure Voting System.</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
