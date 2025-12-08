import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaExchangeAlt } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import '../../styles/Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Header */}
      <header className="welcome-header">
        <div className="logo">
          <span className="logo-icon"><FaHome /></span>
          <span className="logo-text">VoteSphere</span>
        </div>
        <nav className="nav-links">
          <a href="#about">About Us</a>
          <a href="#elections">Elections</a>
          <a href="#contact">Contact Us</a>
          <button className="btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="btn-login-header" onClick={() => navigate('/login')}>Login</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Your Voice, Your Vote.<br />Simplified.</h1>
        <p className="hero-subtitle">Create secure and engaging polls in minutes.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate('/signup')}>Create Your First Poll</button>
          <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
        </div>
      </section>

      {/* Key Features */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <p className="section-subtitle">Our platform is designed to be simple, secure, and insightful.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue"><FaPlus /></div>
            <h3>Create Polls</h3>
            <p>Effortlessly create various types of polls with our intuitive poll builder.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon blue"><FaExchangeAlt /></div>
            <h3>Share Easily</h3>
            <p>Share your polls via links, social media, or email to reach your audience.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon blue"><FaChartBar /></div>
            <h3>View Results</h3>
            <p>Track results in real-time with our beautiful and easy-to-understand visualizations.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-icon"><FaPen /></div>
            <h3>Create</h3>
            <p>Step 1: Build your poll with our intuitive builder.</p>
          </div>
          
          <div className="step">
            <div className="step-icon"><FaLink /></div>
            <h3>Share</h3>
            <p>Step 2: Share the poll link with your audience.</p>
          </div>
          
          <div className="step">
            <div className="step-icon"><FaSearch /></div>
            <h3>Analyze</h3>
            <p>Step 3: Analyze the results and gain insights.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon"><FaHome /></span>
              <span className="logo-text">VoteSphere</span>
            </div>
            <p>Secure and transparent online voting for everyone.</p>
            <p className="copyright">© 2024 VoteSphere. All rights reserved.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>About Us</h4>
              <a href="#mission">Our Mission</a>
              <a href="#team">Our Team</a>
              <a href="#careers">Careers</a>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#contact">Contact Us</a>
              <a href="#faq">FAQs</a>
              <a href="#help">Help Center</a>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#terms">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;