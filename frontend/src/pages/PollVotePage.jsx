import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
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

  // ✅ GET POLL ID FROM URL
  useEffect(() => {
    const loadPollData = async () => {
      try {
        setIsLoading(true);
        const pathParts = window.location.pathname.split('/');
        const pollIdFromUrl = pathParts[pathParts.length - 1];

        if (!pollIdFromUrl) {
          setError('Poll not found');
          setIsLoading(false);
          return;
        }

        console.log('📥 Loading poll:', pollIdFromUrl);

        // Fetch poll data from API
        const response = await fetch(`/api/polls/${pollIdFromUrl}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Poll not found');
          } else {
            setError('Failed to load poll');
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        const pollData = data.poll || data;

        // Extract poll options
        let pollOptions = [];
        if (pollData.options && Array.isArray(pollData.options)) {
          pollOptions = pollData.options;
        } else if (pollData.poll_options && Array.isArray(pollData.poll_options)) {
          pollOptions = pollData.poll_options.map((opt, idx) => ({
            id: opt.id || idx + 1,
            text: opt.option_text || opt.text || opt,
            votes: opt.vote_count || 0
          }));
        }

        if (!pollOptions || pollOptions.length === 0) {
          setError('Poll has no options');
          setIsLoading(false);
          return;
        }

        // Check if poll is closed
        const closeDate = new Date(pollData.end_time || pollData.closeDate);
        if (new Date() > closeDate) {
          setPollClosed(true);
        }

        setPoll(pollData);
        setOptions(pollOptions);
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
    console.log('🔘 Selected:', optionId, 'Multiple:', poll?.allow_multiple_choices);

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
    const pollIdFromUrl = window.location.pathname.split('/').pop();
    const optionsToSubmit = poll?.allow_multiple_choices ? selectedOptions : selectedOption;

    if (!optionsToSubmit || (Array.isArray(optionsToSubmit) && optionsToSubmit.length === 0)) {
      alert('Please select an option before voting');
      return;
    }

    setIsVoting(true);

    try {
      console.log('🗳️ Submitting vote:', optionsToSubmit);

      const response = await fetch(`/api/polls/${pollIdFromUrl}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          optionId: optionsToSubmit
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setHasVoted(true);
          alert(data.message || 'You have already voted on this poll');
        } else {
          alert(data.message || 'Failed to submit vote');
        }
        setIsVoting(false);
        return;
      }

      // ✅ SUCCESS - Show message and disable voting
      setHasVoted(true);
      alert('Thank you! Your vote has been recorded');
      console.log('✅ Vote successful:', data);
    } catch (err) {
      console.error('❌ Vote error:', err);
      alert('An error occurred while submitting your vote');
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
  if (!poll) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <AlertCircle className="access-denied-icon" />
          <p className="loading-text">Poll data not available</p>
        </div>
      </div>
    );
  }

  // ✅ FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="voting-page-container">
      <div className="voting-wrapper">
        {/* ✅ POLL HEADER */}
        <div className="voting-header">
          <h1 className="voting-title" style={{ color: poll.theme_settings?.primaryColor || '#137fec' }}>
            {poll.title}
          </h1>
          {poll.description && (
            <p className="voting-description">{poll.description}</p>
          )}

          {/* ✅ POLL INFO STATS */}
          <div className="voting-info-box">
            <div className="voting-info-content">
              <div className="voting-info-item">
                <strong>Poll ID:</strong> {poll.id}
              </div>
              <div className="voting-info-item">
                <strong>Options:</strong> {options.length}
              </div>
              <div className="voting-info-item">
                <strong>Type:</strong>
                <span className={`voting-type-badge ${poll.allow_multiple_choices ? 'voting-type-multiple' : 'voting-type-single'}`}>
                  {poll.allow_multiple_choices ? '☑️ Multiple' : '🔘 Single'}
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
              <span className="alert-closed-text"> - Voting is no longer available for this poll</span>
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
                >
                  <input
                    type={poll.allow_multiple_choices ? 'checkbox' : 'radio'}
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={hasVoted || pollClosed}
                  />
                  <span className="voting-option-label">
                    {typeof option === 'string' ? option : option.text}
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
          >
            {isVoting ? '⏳ Submitting...' : hasVoted ? '✅ Already Voted' : pollClosed ? '❌ Poll Closed' : 'Submit Vote'}
          </button>
        </div>

        {/* ✅ SCHEDULE INFO - BOTTOM */}
        <div className="schedule-section">
          <div className="schedule-header">
            <Clock className="schedule-icon" />
            <div className="schedule-content">
              <h3 className="schedule-title">Poll Schedule</h3>
              <div className="schedule-dates">
                <div className="schedule-date-item">
                  <p className="schedule-date-label">Starts:</p>
                  <p className="schedule-date-value">
                    {formatDate(poll.start_time || poll.start_date || poll.startDate)}
                  </p>
                </div>
                <div className="schedule-date-item">
                  <p className="schedule-date-label">Closes:</p>
                  <p className="schedule-date-value">
                    {formatDate(poll.end_time || poll.end_date || poll.closeDate)}
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