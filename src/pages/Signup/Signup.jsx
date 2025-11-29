import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Signup.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });
    validateField(field, formData[field]);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Full name should only contain letters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.trim().length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      username: true,
      password: true,
      confirmPassword: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Signup data:', formData);
      // Add your signup logic here
      // navigate('/login');
    }
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ←
      </button>

      <div className="signup-card">
        <h1 className="signup-title">Secure Online Voting System</h1>
        <p className="signup-subtitle">Create your account to get started.</p>

        <div className="tabs">
          <Link to="/login" className="tab">Log in</Link>
          <button className="tab active">Sign up</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              className={touched.fullName && errors.fullName ? 'input-error' : ''}
            />
            {touched.fullName && errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              className={touched.email && errors.email ? 'input-error' : ''}
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              className={touched.username && errors.username ? 'input-error' : ''}
            />
            {touched.username && errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={touched.password && errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword 
                ? <FaEye />
                : <FaEyeSlash />}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword
                ? <FaEye />
                : <FaEyeSlash />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <div className="divider">Or continue with</div>

        <div className="social-buttons">
          <button className="social-button google-button">
            <span className="google-icon">G</span>
            Google
          </button>
        </div>

        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;