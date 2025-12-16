import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageHeader from '../components/pollLanding/PageHeader';
import PollQuestion from '../components/pollLanding/PollQuestion';
import PollActions from '../components/pollLanding/PollActions';
import pollService from '../services/pollService';
import Swal from 'sweetalert2';
import '../styles/pollLanding.css';

const PollLandingPage = () => {
  const navigate = useNavigate();
  const { pollId } = useParams();
  const { state } = useLocation();
  
  // ✅ ALL STATE HOOKS FIRST (React rule)
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);   // Single choice
  const [selectedOptions, setSelectedOptions] = useState([]);   // Multiple choice
  const [isLoading, setIsLoading] = useState(true);

  // ✅ useEffect FIRST
  useEffect(() => {
    const loadPollData = async () => {
      try {
        console.log('========================================');
        console.log('📥 LOADING POLL DATA');
        console.log('========================================');
        
        let pollData = null;
        let pollOptions = [];

        if (state?.poll) {
          console.log('✅ Poll data from STATE:', state.poll);
          pollData = state.poll;
          
          if (state.poll.options && Array.isArray(state.poll.options)) {
            console.log('✅ Options found in state.poll.options:', state.poll.options);
            pollOptions = state.poll.options;
          } else if (state.poll.poll_options && Array.isArray(state.poll.poll_options)) {
            console.log('✅ Options found in state.poll.poll_options:', state.poll.poll_options);
            pollOptions = state.poll.poll_options.map(opt => opt.option_text || opt);
          } else {
            console.warn('⚠️ No options in state! Need to fetch from API');
            const result = await pollService.getPoll(state.poll.id);
            if (result.success && result.poll) {
              pollData = result.poll;
              if (result.poll.options) {
                pollOptions = result.poll.options;
              } else if (result.poll.poll_options) {
                pollOptions = result.poll.poll_options.map(opt => opt.option_text || opt);
              }
            }
          }
        } else if (pollId) {
          console.log('🔄 Fetching poll data for ID:', pollId);
          const result = await pollService.getPoll(pollId);
          
          if (result.success) {
            console.log('✅ Poll data fetched from API:', result.poll);
            pollData = result.poll;
            
            if (result.poll.options) {
              pollOptions = result.poll.options;
            } else if (result.poll.poll_options) {
              pollOptions = result.poll.poll_options.map(opt => opt.option_text || opt);
            }
          } else {
            throw new Error(result.message || 'Failed to load poll');
          }
        } else {
          throw new Error('No poll data available');
        }

        console.log('📊 FINAL POLL DATA:', { pollData, pollOptions });

        if (!pollOptions || pollOptions.length === 0) {
          console.error('❌ NO OPTIONS FOUND!');
          Swal.fire({
            icon: 'error',
            title: 'Missing Poll Options',
            text: 'Backend issue - API not returning poll options',
            confirmButtonColor: '#137fec'
          }).then(() => navigate('/dashboard'));
          return;
        }

        setPoll(pollData);
        setOptions(pollOptions);
      } catch (error) {
        console.error('❌ Error loading poll:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error Loading Poll',
          text: error.message || 'Could not load poll data',
          confirmButtonColor: '#137fec'
        }).then(() => navigate('/dashboard'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPollData();
  }, [pollId, state, navigate]);

  // ✅ formattedPollData BEFORE handleOptionChange
  const formattedPollData = poll && options ? {
    question: poll.title,
    description: poll.description || '',
    options: options.map((opt, index) => 
      typeof opt === 'string' 
        ? { id: index + 1, text: opt, votes: 0 }
        : { id: opt.id || index + 1, text: opt.option_text || opt.text || opt, votes: opt.vote_count || 0 }
    ),
    theme: poll.theme_settings || poll.theme || {},
    schedule: {
      startDate: poll.start_time || poll.start_date || poll.startDate,
      closeDate: poll.end_time || poll.end_date || poll.closeDate
    },
    settings: {
      allowMultiple: poll.allow_multiple_choices,
      isAnonymous: poll.is_anonymous,
      visibility: poll.results_visibility
    }
  } : { question: '', description: '', options: [], theme: {}, schedule: {}, settings: {} };

  // ✅ handleOptionChange AFTER formattedPollData
  const handleOptionChange = (optionId, isMultipleChoice) => {
  console.log('🔘 Clicked:', optionId, 'Multiple:', isMultipleChoice);
  
  if (isMultipleChoice) {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);  // ✅ UNCHECK 2nd click
      }
      return [...prev, optionId];  // ✅ CHECK 1st click
    });
  } else {
    if (selectedOption === optionId) {
      setSelectedOption(null);  // ✅ UNCHECK single
    } else {
      setSelectedOption(optionId);
    }
  }
};


  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

const handleEditPoll = () => {
  if (!poll) return;
  
  console.log('📝 [EDIT] Starting edit for poll:', poll.id);
  console.log('📝 [EDIT] Poll title:', poll.title);
  
  // ✅ CORRECT: Navigate to /configure-poll/:pollId with pollId in URL
  // This makes ConfigurePollPage load ALL data from API (CASE 1 in useEffect)
  navigate(`/configure-poll/${poll.id}`, {
    state: {
      isEditing: true
      // ❌ DO NOT pass pollData - let API load everything!
    }
  });
};

  const handleSharePoll = () => {
    if (!poll) return;
    navigate('/share-poll', {
      state: { poll: { ...poll, options }, pollId: poll.id }
    });
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="poll-landing-page">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Loading poll preview...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="poll-landing-page">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
              <p>Poll data not available</p>
              <button 
                onClick={handleBackToDashboard}
                style={{
                  marginTop: '1rem', padding: '0.75rem 1.5rem',
                  backgroundColor: '#137fec', color: 'white',
                  border: 'none', borderRadius: '0.5rem', cursor: 'pointer'
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  console.log('✅ Rendering with:', {
    options: formattedPollData.options.length,
    allowMultiple: formattedPollData.settings.allowMultiple,
    selected: formattedPollData.settings.allowMultiple ? selectedOptions : selectedOption
  });

  return (
    <div className="poll-landing-page">
      <PageHeader onBackToDashboard={handleBackToDashboard} />
      <main className="poll-landing-main">
        <div className="poll-landing-container">
          <div className="page-intro">
            <h1 className="page-title">Poll Preview</h1>
            <p className="page-subtitle">
              This is how your poll will appear to participants.
            </p>
            
            <div style={{
              marginTop: '1rem', padding: '1rem',
              backgroundColor: '#f0fdf4', borderRadius: '0.5rem',
              border: '1px solid #bbf7d0', fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div><strong>Poll ID:</strong> {poll.id}</div>
                <div><strong>Options:</strong> {formattedPollData.options.length}</div>
                <div>
                  <strong>Voting Type:</strong>{' '}
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: formattedPollData.settings.allowMultiple ? '#dbeafe' : '#fef3c7',
                    color: formattedPollData.settings.allowMultiple ? '#1e40af' : '#92400e',
                    borderRadius: '0.25rem', fontWeight: 600
                  }}>
                    {formattedPollData.settings.allowMultiple ? '☑️ Multiple Choice' : '🔘 Single Choice'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: formattedPollData.theme.backgroundColor || 'white',
            backgroundImage: formattedPollData.theme.backgroundImage ? `url(${formattedPollData.theme.backgroundImage})` : 'none',
            backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '12px', padding: '2rem'
          }}>
            <PollQuestion
              question={formattedPollData.question}
              description={formattedPollData.description}
              options={formattedPollData.options}
              selectedOption={formattedPollData.settings.allowMultiple ? selectedOptions : selectedOption}
              onOptionChange={handleOptionChange}
              isMultipleChoice={formattedPollData.settings.allowMultiple}
            />
          </div>

          <PollActions onEditPoll={handleEditPoll} onSharePoll={handleSharePoll} />
        </div>
      </main>
    </div>
  );
};

export default PollLandingPage;
