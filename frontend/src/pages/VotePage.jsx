import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import voteService from '../services/voteService';
import themeUtils from '../utils/themeUtils';
import OptionCard from '../components/Vote/optionCard';
import LoadingSpinner from '../components/Vote/loadingSpinner';
import ErrorDisplay from '../components/Vote/errorDisplay';
import Alert from '../components/Vote/Alert';

const VoterPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Theme - Apply from poll theme_settings
  const theme = poll ? themeUtils.applyTheme(poll.theme_settings) : themeUtils.applyTheme({});

  // Fetch Poll on Mount
  useEffect(() => {
    if (pollId) {
      loadPoll();
    }
  }, [pollId]);

  const loadPoll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await voteService.fetchPollForVoting(pollId);
      
      if (result.success) {
        setPoll(result.poll);
        setShowResults(result.poll.user_has_voted || false);
        
        if (result.poll.user_has_voted) {
          setSuccessMessage('You have already voted on this poll');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVote = async () => {
    if (!selectedOption) {
      setError('Please select an option before submitting');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const result = await voteService.submitVote(pollId, selectedOption);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setShowResults(true);
        
        // Refresh poll data to get updated results
        await loadPoll();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Calculate total votes for percentage
  const totalVotes = poll?.poll_options?.reduce((sum, opt) => sum + (opt.vote_count_cache || 0), 0) || 0;

  // Render States
  if (loading) {
    return <LoadingSpinner theme={theme} />;
  }

  if (error && !poll) {
    return <ErrorDisplay error={error} theme={theme} onRetry={loadPoll} />;
  }

  if (!poll) {
    return <ErrorDisplay error="Poll not found" theme={theme} onRetry={handleGoHome} />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        padding: '2rem 1rem'
      }}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={handleGoHome}>
            <CheckCircle size={28} style={{ color: theme.primaryColor }} />
            <h1 style={{ color: theme.textColor, fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              Online Voting System
            </h1>
          </div>
          <button
            onClick={handleLogin}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: theme.primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Login
          </button>
        </div>

        {/* Main Content Card */}
        <div style={{
          backgroundColor: theme.cardBackground,
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Poll Image */}
          {poll?.theme_settings?.headerImage && (
            <img
              src={poll.theme_settings.headerImage}
              alt="Poll header"
              style={{
                width: '100%',
                height: '16rem',
                objectFit: 'cover'
              }}
            />
          )}

          <div style={{ padding: '2rem' }}>
            {/* Poll Title and Description */}
            <h2 style={{
              color: theme.textColor,
              fontSize: '1.875rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              {poll?.title}
            </h2>

            {poll?.description && (
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                marginBottom: '2rem',
                lineHeight: '1.5'
              }}>
                {poll.description}
              </p>
            )}

            {/* Alerts */}
            {successMessage && (
              <Alert type="success" message={successMessage} icon={<CheckCircle />} />
            )}

            {error && (
              <Alert type="error" message={error} />
            )}

            {/* Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              {poll?.poll_options && poll.poll_options.length > 0 ? (
                poll.poll_options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    isSelected={selectedOption === option.id}
                    onSelect={setSelectedOption}
                    theme={theme}
                    showResults={showResults}
                    percentage={themeUtils.getPercentage(option.vote_count_cache || 0, totalVotes)}
                  />
                ))
              ) : (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                  No options available for this poll
                </p>
              )}
            </div>

            {/* Submit Button */}
            {!showResults && poll?.poll_options && poll.poll_options.length > 0 && (
              <button
                onClick={handleSubmitVote}
                disabled={submitting || !selectedOption}
                style={{
                  width: '100%',
                  maxWidth: '28rem',
                  padding: '0.875rem',
                  backgroundColor: theme.primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: submitting || !selectedOption ? 'not-allowed' : 'pointer',
                  opacity: submitting || !selectedOption ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Vote'}
              </button>
            )}

            {/* Results Summary */}
            {showResults && totalVotes > 0 && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: `${theme.primaryColor}10`,
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ color: theme.textColor, fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
                  Total Votes: {totalVotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '0.875rem'
        }}>
          <a 
            href="#" 
            style={{ color: '#9ca3af', textDecoration: 'none', marginRight: '1rem' }}
            onClick={(e) => e.preventDefault()}
          >
            Terms of Service
          </a>
          •
          <a 
            href="#" 
            style={{ color: '#9ca3af', textDecoration: 'none', marginLeft: '1rem' }}
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default VoterPage;