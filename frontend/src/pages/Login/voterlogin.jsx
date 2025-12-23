import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import authService from '../../services/authService';
import { Lock, AlertCircle } from 'lucide-react';
import '../../styles/Login.css';

const VoterLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pollId, setPollId] = useState(null);

  // Get poll ID from location state, URL params, or localStorage
  useEffect(() => {
    const id = location.state?.pollId || new URLSearchParams(location.search).get('pollId') || localStorage.getItem('pendingPollId');
    if (id) {
      setPollId(id);
      console.log('📋 Poll ID to redirect to:', id);
    }
  }, [location]);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        console.log('✅ Login successful');
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome, ${result.user.name}!`,
          timer: 1500,
          showConfirmButton: false
        });

        // Clear pending poll ID
        localStorage.removeItem('pendingPollId');

        // ✅ REDIRECT TO POLL IF COMING FROM PRIVATE POLL
        if (pollId) {
          console.log('🔄 Redirecting to poll:', pollId);
          navigate(`/vote/${pollId}`, { replace: true });
        } else {
          console.log('📊 No poll ID, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.message || 'Invalid email or password',
          confirmButtonColor: '#667eea'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
        confirmButtonColor: '#667eea'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Lock size={32} style={{ color: '#667eea' }} />
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              Voter Login
            </h1>
          </div>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            margin: 0
          }}>
            {pollId 
              ? 'Log in to access and vote on the private poll' 
              : 'Enter your credentials to access your account'}
          </p>
        </div>

        {/* Login Alert */}
        {pollId && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} style={{ color: '#d97706', flexShrink: 0 }} />
            <p style={{
              color: '#92400e',
              margin: 0,
              fontSize: '0.875rem'
            }}>
              This poll requires authentication. After login, you'll be redirected back to the poll.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1f2937',
              fontSize: '0.875rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="your@email.com"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            {errors.email && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                margin: '0.25rem 0 0 0'
              }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1f2937',
              fontSize: '0.875rem'
            }}>
              Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="••••••"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '2.5rem',
                  border: errors.password ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: '#6b7280',
                  fontSize: '1rem',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                margin: '0.25rem 0 0 0'
              }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#d1d5db' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#5568d3';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#667eea';
            }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          <p style={{ margin: '0.5rem 0' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup', { state: { pollId } })}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: 'inherit'
              }}
            >
              Sign up
            </button>
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: 'inherit'
              }}
            >
              Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoterLogin;