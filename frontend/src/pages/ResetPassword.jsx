import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ResetPassword.css';
import authService from '../services/authService';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    if (!token) {
      Swal.fire('Error', 'Invalid or missing token', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.resetPassword(token, newPassword);
      if (result.success) {
        Swal.fire('Success', result.message, 'success').then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1 className="reset-title">Reset Password</h1>
        <p className="reset-subtitle">Enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="form-group">
            <label>New Password</label>
            <div className="password-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="reset-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="login-link">
          Remember your password? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
