import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import voteService from '../services/voteService1';
import '../styles/pollVoting.css';

const PollVotingPage = () => {
  // ✅ STATE HOOKS
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);
  const [pollClosed, setPollClosed] = useState(false);
  const [theme, setTheme] = useState(null);

  // ✅ GET POLL ID FROM URL AND LOAD DATA
  useEffect(() => {
    const loadPollData = async () => {
      try {
        setIsLoading(true);

        // Extract poll ID from URL
        const pathParts = window.location.pathname.split('/');
        const pollIdFromUrl = pathParts[pathParts.length - 1];

        if (!pollIdFromUrl) {
          setError('Poll not found');
          setIsLoading(false);
          return;
        }

        console.log('========================================');
        console.log('📥 LOADING POLL FOR VOTING');
        console.log('========================================');

        // Fetch poll using service
        const result = await voteService.getPoll(pollIdFromUrl);

        if (!result.success) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        const pollData = result.poll;

        // Format options using service
        const formattedOptions = voteService.formatOptions(pollData);

        if (!formattedOptions || formattedOptions.length === 0) {
          setError('Poll has no options');
          setIsLoading(false);
          return;
        }

        // Check if poll is closed using service
        const isClosed = voteService.isPollClosed(pollData);

        // Get theme settings using service
        const themeSettings = voteService.getThemeSettings(pollData);

        setPoll(pollData);
        setOptions(formattedOptions);
        setPollClosed(isClosed);
        setTheme(themeSettings);

        console.log('📊 Poll loaded successfully:', {
          id: pollData.id,
          title: pollData.title,
          options: formattedOptions.length,
          closed: isClosed,
          theme: themeSettings
        });

        setIsLoading(false);
      } catch (err) {
        console.error('❌ Error loading poll:', err);
        setError('Error loading poll data');
        setIsLoading(false);
      }
    };

    loadPollData();
  }, []);

  // ✅ HANDLE OPTION SELECTION
  const handleOptionChange = (optionId) => {
    console.log('🔘 Selected option:', optionId);

    if (poll?.allow_multiple_choices) {
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        }
        return [...prev, optionId];
      });
    } else {
      if (selectedOption === optionId) {
        setSelectedOption(null);
      } else {
        setSelectedOption(optionId);
      }
    }
  };

  // ✅ SUBMIT VOTE
  const handleSubmitVote = async () => {
    const pathParts = window.location.pathname.split('/');
    const pollIdFromUrl = pathParts[pathParts.length - 1];
    const optionsToSubmit = poll?.allow_multiple_choices ? selectedOptions : selectedOption;

    if (!optionsToSubmit || (Array.isArray(optionsToSubmit) && optionsToSubmit.length === 0)) {
      alert('Please select an option before voting');
      return;
    }

    setIsVoting(true);

    try {
      console.log('🗳️ Submitting vote:', optionsToSubmit);

      // Use service to submit vote
      const result = await voteService.submitVote(pollIdFromUrl, optionsToSubmit);

      if (!result.success) {
        if (result.statusCode === 403) {
          // Already voted
          setHasVoted(true);
        }
        alert(result.message || result.error);
        setIsVoting(false);
        return;
      }

      // ✅ SUCCESS
      setHasVoted(true);
      alert('Thank you! Your vote has been recorded successfully');
      console.log('✅ Vote successful:', result.data);
    } finally {
      setIsVoting(false);
    }
  };

  // ✅ ACCESS DENIED PAGE
  if (error === 'Poll not found') {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <AlertCircle className="access-denied-icon" />
          <h1 className="access-denied-title">Access Denied</h1>
          <p className="access-denied-text">
            The poll you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="access-denied-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ✅ LOADING STATE
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

  // ✅ POLL NOT LOADED
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

  // ✅ GET FONT FAMILY FROM THEME
  const getFontFamily = () => {
    if (theme.fontStyle === 'roboto') return "'Roboto', sans-serif";
    if (theme.fontStyle === 'poppins') return "'Poppins', sans-serif";
    if (theme.fontStyle === 'playfair') return "'Playfair Display', serif";
    return "'Inter', sans-serif";
  };

  return (
    <div 
      className="voting-page-container"
      style={{ fontFamily: getFontFamily() }}
    >
      <div className="voting-wrapper">
        {/* ✅ POLL HEADER */}
        <div className="voting-header" style={{ borderLeftColor: theme.primaryColor }}>
          <h1 className="voting-title" style={{ color: theme.primaryColor }}>
            {poll.title}
          </h1>
          {poll.description && (
            <p className="voting-description">{poll.description}</p>
          )}

          {/* ✅ POLL INFO STATS */}
          <div 
            className="voting-info-box"
            style={{ 
              backgroundColor: `${theme.primaryColor}10`,
              borderColor: `${theme.primaryColor}30`
            }}
          >
            <div className="voting-info-content">
              <div className="voting-info-item">
                <strong style={{ color: theme.primaryColor }}>Poll ID:</strong> {poll.id}
              </div>
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

        {/* ✅ POLL CLOSED MESSAGE */}
        {pollClosed && (
          <div className="alert-message alert-closed">
            <AlertCircle className="alert-icon" />
            <div>
              <span className="alert-title">Poll Closed</span>
              <span className="alert-closed-text"> - Voting is no longer available</span>
            </div>
          </div>
        )}

        {/* ✅ ALREADY VOTED MESSAGE */}
        {hasVoted && (
          <div className="alert-message alert-voted">
            <CheckCircle className="alert-icon" />
            <div>
              <span className="alert-title alert-voted-text">Thank You!</span>
              <span className="alert-voted-text"> - You have already voted on this poll</span>
            </div>
          </div>
        )}

        {/* ✅ VOTING CARD */}
        <div className="voting-card">
          <h2 className="voting-card-title">Cast Your Vote</h2>

          {/* ✅ OPTIONS */}
          <div className="voting-options-container">
            {options.map((option, idx) => {
              const optionId = option.id || idx + 1;
              const isSelected = poll.allow_multiple_choices
                ? selectedOptions.includes(optionId)
                : selectedOption === optionId;

              return (
                <label
                  key={optionId}
                  className={`voting-option ${isSelected ? 'selected' : ''} ${hasVoted || pollClosed ? 'disabled' : ''}`}
                  onClick={() => !hasVoted && !pollClosed && handleOptionChange(optionId)}
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
                    disabled={hasVoted || pollClosed}
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

          {/* ✅ SUBMIT BUTTON */}
          <button
            onClick={handleSubmitVote}
            disabled={hasVoted || pollClosed || isVoting}
            className="voting-submit-btn"
            style={{ 
              backgroundColor: hasVoted || pollClosed ? '#d1d5db' : theme.primaryColor
            }}
          >
            {isVoting ? '⏳ Submitting...' : hasVoted ? '✅ Already Voted' : pollClosed ? '❌ Poll Closed' : 'Submit Vote'}
          </button>
        </div>

        {/* ✅ SCHEDULE INFO - BOTTOM */}
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