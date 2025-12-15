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
  
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load poll data on component mount
  useEffect(() => {
    const loadPollData = async () => {
      try {
        console.log('========================================');
        console.log('📥 LOADING POLL DATA');
        console.log('========================================');
        
        let pollData = null;
        let pollOptions = [];

        // First check if poll data was passed via navigation state
        if (state?.poll) {
          console.log('✅ Poll data from STATE:', state.poll);
          pollData = state.poll;
          
          // ⚠️ CRITICAL: Check if options exist in state
          if (state.poll.options && Array.isArray(state.poll.options)) {
            console.log('✅ Options found in state.poll.options:', state.poll.options);
            pollOptions = state.poll.options;
          } else if (state.poll.poll_options && Array.isArray(state.poll.poll_options)) {
            console.log('✅ Options found in state.poll.poll_options:', state.poll.poll_options);
            pollOptions = state.poll.poll_options.map(opt => opt.option_text || opt);
          } else {
            console.warn('⚠️ No options in state! Need to fetch from API');
            // Options not in state, need to fetch from API
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
        } 
        // If no state data, fetch from API using pollId
        else if (pollId) {
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

        console.log('========================================');
        console.log('📊 FINAL POLL DATA:');
        console.log('pollData:', pollData);
        console.log('pollOptions:', pollOptions);
        console.log('========================================');

        // ⚠️ CRITICAL CHECK: If still no options, show error
        if (!pollOptions || pollOptions.length === 0) {
          console.error('❌ NO OPTIONS FOUND AFTER ALL ATTEMPTS!');
          console.error('This is a BACKEND ISSUE - the API is not returning poll options');
          
          Swal.fire({
            icon: 'error',
            title: 'Missing Poll Options',
            html: `
              <p>The poll was created but options are missing from the response.</p>
              <p><strong>This is a backend issue.</strong></p>
              <p>Backend needs to include options in the response when creating/fetching polls.</p>
              <hr style="margin: 1rem 0;">
              <p style="text-align: left; font-size: 0.9em;">
                <strong>Backend Fix Needed:</strong><br>
                When returning poll data, include:<br>
                <code>poll_options: [{ id, option_text, vote_count }]</code>
              </p>
            `,
            confirmButtonColor: '#137fec',
            confirmButtonText: 'Go to Dashboard'
          }).then(() => {
            navigate('/dashboard');
          });
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
        }).then(() => {
          navigate('/dashboard');
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPollData();
  }, [pollId, state, navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleEditPoll = () => {
    if (!poll) return;
    
    // Navigate back to configure page with current poll data
    navigate('/configure-poll', {
      state: {
        pollData: {
          title: poll.title,
          description: poll.description,
          options: options
        },
        isEditing: true,
        pollId: poll.id
      }
    });
  };

  const handleSharePoll = () => {
    if (!poll) return;

    // ⚠️ Make sure to pass options to share page
    navigate('/share-poll', {
      state: {
        poll: {
          ...poll,
          options: options // Include options explicitly
        },
        pollId: poll.id
      }
    });
  };

  // ✅ Show loading state
  if (isLoading) {
    return (
      <div className="poll-landing-page">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: '#6b7280' 
            }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '1rem' 
              }}>
                ⏳
              </div>
              <p>Loading poll preview...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ Show error state if no poll
  if (!poll) {
    return (
      <div className="poll-landing-page">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: '#ef4444' 
            }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '1rem' 
              }}>
                ⚠️
              </div>
              <p>Poll data not available</p>
              <button 
                onClick={handleBackToDashboard}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#137fec',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
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

  // ✅ Format poll data for display
  const formattedPollData = {
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
  };

  // ✅ DEBUG: Log the multiple choice setting
  console.log('🔍 Multiple Choice Setting:', {
    allow_multiple_choices: poll.allow_multiple_choices,
    formattedAllowMultiple: formattedPollData.settings.allowMultiple
  });

  // ✅ Format dates for display
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

  console.log('✅ Rendering with options:', formattedPollData.options);

  return (
    <div className="poll-landing-page">
      <PageHeader onBackToDashboard={handleBackToDashboard} />

      <main className="poll-landing-main">
        <div className="poll-landing-container">
          <div className="page-intro">
            <h1 className="page-title">Poll Preview</h1>
            <p className="page-subtitle">
              This is how your poll will appear to participants. You can go back to edit or proceed to share.
            </p>
            
            {/* ✅ Poll Info */}
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.5rem',
              border: '1px solid #bbf7d0',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <strong>Poll ID:</strong> {poll.id}
                </div>
                <div>
                  <strong>Options:</strong> {formattedPollData.options.length}
                </div>
                <div>
                  <strong>Voting Type:</strong>{' '}
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: formattedPollData.settings.allowMultiple ? '#dbeafe' : '#fef3c7',
                    color: formattedPollData.settings.allowMultiple ? '#1e40af' : '#92400e',
                    borderRadius: '0.25rem',
                    fontWeight: 600
                  }}>
                    {formattedPollData.settings.allowMultiple ? '☑️ Multiple Choice' : '🔘 Single Choice'}
                  </span>
                </div>
                <div>
                  <strong>Anonymous:</strong>{' '}
                  {formattedPollData.settings.isAnonymous ? '✅ Yes' : '❌ No'}
                </div>
              </div>
            </div>

            {/* ✅ Show Poll Schedule */}
            {(formattedPollData.schedule.startDate || formattedPollData.schedule.closeDate) && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f0f7ff',
                borderRadius: '0.5rem',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  fontSize: '0.875rem',
                  color: '#1e40af'
                }}>
                  <div>
                    <strong>Start:</strong> {formatDate(formattedPollData.schedule.startDate)}
                  </div>
                  <div>
                    <strong>End:</strong> {formatDate(formattedPollData.schedule.closeDate)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Apply Theme if available */}
          <div style={{
            backgroundColor: formattedPollData.theme.backgroundColor || 'white',
            backgroundImage: formattedPollData.theme.backgroundImage 
              ? `url(${formattedPollData.theme.backgroundImage})` 
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <PollQuestion
              question={formattedPollData.question}
              description={formattedPollData.description}
              options={formattedPollData.options}
              selectedOption={selectedOption}
              onOptionChange={handleOptionChange}
              theme={formattedPollData.theme}
              isMultipleChoice={formattedPollData.settings.allowMultiple}
            />
          </div>

          <PollActions
            onEditPoll={handleEditPoll}
            onSharePoll={handleSharePoll}
          />
        </div>
      </main>
    </div>
  );
};

export default PollLandingPage;