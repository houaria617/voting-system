import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Login.css';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
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
      case 'emailOrUsername':
        if (!value.trim()) {
          error = 'Email or username is required';
        } else if (value.trim().length < 3) {
          error = 'Must be at least 3 characters';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
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

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email or username is required';
    } else if (formData.emailOrUsername.trim().length < 3) {
      newErrors.emailOrUsername = 'Must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    setTouched({
      emailOrUsername: true,
      password: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      const result = await authService.login(
        formData.emailOrUsername,
        formData.password
      );

      setIsLoading(false);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${result.user.name}!`,
          timer: 2000
        });

        navigate('/dashboard');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.message
        });
      }
    }
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ←
      </button>

      <div className="login-card">
        <h1 className="login-title">Secure Online Voting System</h1>
        <p className="login-subtitle">Welcome! Please enter your details to continue.</p>

        <div className="tabs">
          <button className="tab active">Log in</button>
          <Link to="/signup" className="tab">Sign up</Link>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email or Username</label>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Enter your email or username"
              value={formData.emailOrUsername}
              onChange={handleChange}
              onBlur={() => handleBlur('emailOrUsername')}
              className={touched.emailOrUsername && errors.emailOrUsername ? 'input-error' : ''}
              disabled={isLoading}
            />
            {touched.emailOrUsername && errors.emailOrUsername && (
              <span className="error-message">{errors.emailOrUsername}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={touched.password && errors.password ? 'input-error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Login;
