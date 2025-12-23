import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import voteService from '../services/voteService1';
import '../styles/pollVoting.css';

const PollVotingPage = () => {
  const navigate = useNavigate();
  const { pollId } = useParams();

  // STATE MANAGEMENT
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  
  // Poll Status States
  const [hasVoted, setHasVoted] = useState(false);
  const [pollClosed, setPollClosed] = useState(false);
  const [requiresLogin, setRequiresLogin] = useState(false);
  
  // Theme & UI
  const [theme, setTheme] = useState(null);

  // Load Poll Data
  useEffect(() => {
    if (pollId) {
      loadPoll();
    }
  }, [pollId]);

  const loadPoll = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!pollId) {
        setError('Poll not found');
        setIsLoading(false);
        return;
      }

      console.log('📥 Loading poll:', pollId);

      const result = await voteService.getPoll(pollId);

      // Check if private poll requires login
      if (!result.success) {
        console.error('❌ Poll load failed:', result);

        // Private poll - not authenticated
        if (result.code === 'NOT_AUTHENTICATED' || result.requiresLogin) {
          console.log('🔐 Private poll - Redirecting to login');
          
          // Store poll ID in localStorage
          localStorage.setItem('pendingPollId', pollId);
          
          // Redirect to voter login with poll ID
          navigate('/voter-login', { 
            state: { pollId },
            replace: true 
          });
          setIsLoading(false);
          return;
        }

        // Email not authorized
        if (result.code === 'EMAIL_NOT_AUTHORIZED') {
          console.log('❌ Email not authorized');
          setError('EMAIL_NOT_AUTHORIZED');
          setIsLoading(false);
          return;
        }

        // Poll not found
        if (result.error === 'Poll not found') {
          setError('Poll not found');
          setIsLoading(false);
          return;
        }

        // Other errors
        setError(result.error || 'Failed to load poll');
        setIsLoading(false);
        return;
      }

      const pollData = result.poll;
      console.log('✅ Poll loaded:', pollData.id);

      // Format options
      const formattedOptions = voteService.formatOptions(pollData);
      if (!formattedOptions || formattedOptions.length === 0) {
        setError('Poll has no options');
        setIsLoading(false);
        return;
      }

      // Check poll status
      const isClosed = voteService.isPollClosed(pollData);
      const themeSettings = voteService.getThemeSettings(pollData);

      // Check if already voted
      if (pollData.user_has_voted) {
        console.log('⚠️ User already voted on this poll');
        setHasVoted(true);
      }

      // Set all poll data
      setPoll(pollData);
      setOptions(formattedOptions);
      setPollClosed(isClosed);
      setTheme(themeSettings);
      setIsLoading(false);

    } catch (err) {
      console.error('❌ Error loading poll:', err);
      setError('Error loading poll data');
      setIsLoading(false);
    }
  };

  // Handle option selection
  const handleOptionChange = (optionId) => {
    if (hasVoted || pollClosed || isVoting) {
      return;
    }

    console.log('🔘 Selected option:', optionId);

    if (poll?.allow_multiple_choices) {
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        }
        return [...prev, optionId];
      });
    } else {
      setSelectedOption(selectedOption === optionId ? null : optionId);
    }
  };

  // Submit vote
  const handleSubmitVote = async () => {
    if (hasVoted) {
      Swal.fire({
        icon: 'info',
        title: 'Already Voted',
        text: 'You have already voted on this poll.',
        confirmButtonColor: '#137fec'
      });
      return;
    }

    // Validate selection
    const optionsToSubmit = poll?.allow_multiple_choices ? selectedOptions : selectedOption;
    if (!optionsToSubmit || (Array.isArray(optionsToSubmit) && optionsToSubmit.length === 0)) {
      Swal.fire({
        icon: 'warning',
        title: 'No Option Selected',
        text: 'Please select an option before voting.',
        confirmButtonColor: '#137fec'
      });
      return;
    }

    setIsVoting(true);

    try {
      console.log('🗳️ Submitting vote...');
      const result = await voteService.submitVote(pollId, optionsToSubmit);

      if (!result.success) {
        console.error('❌ Vote failed:', result);

        // Already voted
        if (result.statusCode === 403) {
          setHasVoted(true);
          Swal.fire({
            icon: 'info',
            title: 'Already Voted',
            text: 'You have already voted on this poll.',
            confirmButtonColor: '#137fec'
          });
        } 
        // Not authenticated
        else if (result.code === 'NOT_AUTHENTICATED') {
          Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'You must be logged in to vote on this private poll.',
            confirmButtonColor: '#137fec',
            confirmButtonText: 'Go to Login'
          }).then(() => {
            localStorage.setItem('pendingPollId', pollId);
            navigate('/voter-login', { state: { pollId } });
          });
        }
        // Email not authorized
        else if (result.code === 'EMAIL_NOT_AUTHORIZED') {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Your email is not authorized to vote on this private poll.',
            confirmButtonColor: '#137fec'
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Vote Failed',
            text: result.message || 'Failed to submit vote. Please try again.',
            confirmButtonColor: '#137fec'
          });
        }
        setIsVoting(false);
        return;
      }

      // Success
      console.log('✅ Vote submitted successfully');
      setHasVoted(true);
      setSelectedOption(null);
      setSelectedOptions([]);

      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: 'Your vote has been recorded successfully.',
        confirmButtonColor: '#137fec'
      });

    } catch (err) {
      console.error('❌ Vote error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
        confirmButtonColor: '#137fec'
      });
      setIsVoting(false);
    }
  };

  // Get font family
  const getFontFamily = () => {
    if (!theme) return "'Inter', sans-serif";
    if (theme.fontStyle === 'roboto') return "'Roboto', sans-serif";
    if (theme.fontStyle === 'poppins') return "'Poppins', sans-serif";
    if (theme.fontStyle === 'playfair') return "'Playfair Display', serif";
    return "'Inter', sans-serif";
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-emoji">⏳</div>
          <p className="loading-text">Loading poll...</p>
        </div>
      </div>
    );
  }

  // REQUIRES LOGIN
  if (requiresLogin) {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <Lock className="access-denied-icon" style={{ color: '#f59e0b', width: '60px', height: '60px' }} />
          <h1 className="access-denied-title">🔐 Private Poll</h1>
          <p className="access-denied-text">
            This is a private poll. You must log in with your authorized email to access and vote.
          </p>
          <button
            onClick={() => {
              localStorage.setItem('pendingPollId', pollId);
              navigate('/voter-login', { state: { pollId } });
            }}
            className="access-denied-btn"
            style={{ backgroundColor: '#137fec' }}
          >
            Login to Vote
          </button>
          <button
            onClick={() => navigate('/')}
            className="access-denied-btn"
            style={{ backgroundColor: '#6b7280', marginTop: '10px' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // EMAIL NOT AUTHORIZED
  if (error === 'EMAIL_NOT_AUTHORIZED') {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <AlertCircle className="access-denied-icon" style={{ color: '#ef4444', width: '60px', height: '60px' }} />
          <h1 className="access-denied-title">❌ Access Denied</h1>
          <p className="access-denied-text">
            Your email is not authorized to vote on this private poll. Please contact the poll creator.
          </p>
          <button
            onClick={() => navigate('/')}
            className="access-denied-btn"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // POLL NOT FOUND
  if (error === 'Poll not found') {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <AlertCircle className="access-denied-icon" style={{ color: '#ef4444', width: '60px', height: '60px' }} />
          <h1 className="access-denied-title">Poll Not Found</h1>
          <p className="access-denied-text">
            The poll you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate('/')}
            className="access-denied-btn"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // POLL DATA MISSING
  if (!poll || !theme) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <AlertCircle className="access-denied-icon" />
          <p className="loading-text">Poll data not available</p>
        </div>
      </div>
    );
  }

  // ALREADY VOTED
  if (hasVoted) {
    return (
      <div 
        className="voting-page-container"
        style={{ fontFamily: getFontFamily() }}
      >
        <div className="voting-wrapper">
          <div className="access-denied-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
            <div className="access-denied-card" style={{ width: '100%' }}>
              <CheckCircle className="access-denied-icon" style={{ color: '#10b981', width: '60px', height: '60px' }} />
              <h1 className="access-denied-title">Thank You!</h1>
              <p className="access-denied-text">
                You have already voted on this poll.
              </p>
              <div style={{ 
                marginTop: '2rem', 
                padding: '1.5rem', 
                backgroundColor: `${theme.primaryColor}10`,
                borderRadius: '0.75rem',
                borderLeft: `4px solid ${theme.primaryColor}`
              }}>
                <h3 style={{ color: theme.primaryColor, marginTop: 0 }}>Poll Information</h3>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Total Options:</strong> {options.length}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Poll Type:</strong> {poll.allow_multiple_choices ? 'Multiple Choice' : 'Single Choice'}
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="access-denied-btn"
                style={{ marginTop: '1.5rem' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN VOTING PAGE
  return (
    <div 
      className="voting-page-container"
      style={{ fontFamily: getFontFamily() }}
    >
      <div className="voting-wrapper">
        {/* POLL HEADER */}
        <div className="voting-header" style={{ borderLeftColor: theme.primaryColor }}>
          <h1 className="voting-title" style={{ color: theme.primaryColor }}>
            {poll.title}
          </h1>
          {poll.description && (
            <p className="voting-description">{poll.description}</p>
          )}

          {/* POLL INFO */}
          <div 
            className="voting-info-box"
            style={{ 
              backgroundColor: `${theme.primaryColor}10`,
              borderColor: `${theme.primaryColor}30`
            }}
          >
            <div className="voting-info-content">
              <div className="voting-info-item">
                <strong style={{ color: theme.primaryColor }}>Options:</strong> {options.length}
              </div>
              <div className="voting-info-item">
                <strong style={{ color: theme.primaryColor }}>Type:</strong>
                <span 
                  className="voting-type-badge"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {poll.allow_multiple_choices ? '☑️ Multiple Choice' : '🔘 Single Choice'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* POLL CLOSED MESSAGE */}
        {pollClosed && (
          <div className="alert-message alert-closed">
            <AlertCircle className="alert-icon" />
            <div>
              <span className="alert-title">Poll Closed</span>
              <span className="alert-closed-text"> - Voting is no longer available</span>
            </div>
          </div>
        )}

        {/* VOTING CARD */}
        <div className="voting-card">
          <h2 className="voting-card-title">Cast Your Vote</h2>

          {/* OPTIONS */}
          <div className="voting-options-container">
            {options.map((option, idx) => {
              const optionId = option.id || idx + 1;
              const isSelected = poll.allow_multiple_choices
                ? selectedOptions.includes(optionId)
                : selectedOption === optionId;

              return (
                <label
                  key={optionId}
                  className={`voting-option ${isSelected ? 'selected' : ''} ${pollClosed || isVoting ? 'disabled' : ''}`}
                  onClick={() => !pollClosed && !isVoting && handleOptionChange(optionId)}
                  style={isSelected ? {
                    borderColor: theme.primaryColor,
                    backgroundColor: `${theme.primaryColor}15`,
                    boxShadow: `0 0 0 3px ${theme.primaryColor}20`
                  } : {}}
                >
                  <input
                    type={poll.allow_multiple_choices ? 'checkbox' : 'radio'}
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={pollClosed || isVoting}
                    style={{ accentColor: theme.primaryColor }}
                  />
                  <span 
                    className="voting-option-label"
                    style={isSelected ? { color: theme.primaryColor } : {}}
                  >
                    {option.text}
                  </span>
                </label>
              );
            })}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmitVote}
            disabled={pollClosed || isVoting || (!selectedOption && !selectedOptions.length)}
            className="voting-submit-btn"
            style={{ 
              backgroundColor: pollClosed ? '#d1d5db' : theme.primaryColor,
              opacity: (pollClosed || isVoting || (!selectedOption && !selectedOptions.length)) ? 0.6 : 1,
              cursor: (pollClosed || isVoting || (!selectedOption && !selectedOptions.length)) ? 'not-allowed' : 'pointer'
            }}
          >
            {isVoting ? '⏳ Submitting...' : pollClosed ? '❌ Poll Closed' : 'Submit Vote'}
          </button>
        </div>

        {/* SCHEDULE INFO */}
        <div 
          className="schedule-section"
          style={{ borderTopColor: theme.primaryColor }}
        >
          <div className="schedule-header">
            <Clock 
              className="schedule-icon"
              style={{ color: theme.primaryColor }}
            />
            <div className="schedule-content">
              <h3 className="schedule-title">Poll Schedule</h3>
              <div className="schedule-dates">
                <div className="schedule-date-item">
                  <p className="schedule-date-label">Starts:</p>
                  <p className="schedule-date-value">
                    {voteService.formatDate(poll.start_time || poll.start_date || poll.startDate)}
                  </p>
                </div>
                <div className="schedule-date-item">
                  <p className="schedule-date-label">Closes:</p>
                  <p className="schedule-date-value">
                    {voteService.formatDate(poll.end_time || poll.end_date || poll.closeDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {pollClosed && (
            <div className="schedule-closed-message">
              This poll has ended and is no longer accepting votes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollVotingPage;