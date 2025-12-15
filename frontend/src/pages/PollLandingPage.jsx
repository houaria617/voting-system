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
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load poll data on component mount
  useEffect(() => {
    const loadPollData = async () => {
      try {
        // First check if poll data was passed via navigation state
        if (state?.poll) {
          console.log('📥 Poll data from state:', state.poll);
          setPoll(state.poll);
          setIsLoading(false);
          return;
        }

        // If no state data, fetch from API using pollId
        if (pollId) {
          console.log('🔄 Fetching poll data for ID:', pollId);
          const result = await pollService.getPoll(pollId);
          
          if (result.success) {
            console.log('✅ Poll data fetched:', result.poll);
            setPoll(result.poll);
          } else {
            throw new Error(result.message || 'Failed to load poll');
          }
        } else {
          throw new Error('No poll data available');
        }
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
  
  console.log('🔍 FULL poll:', poll);
  
  // ✅ CORRECT: Handle EXACT API format from your tests
  const optionsArray = (poll.poll_options || [])
    .map(opt => opt.option_text || opt.text || opt)  // API returns {option_text: "..."}
    .filter(opt => opt && opt.trim() !== '');       // Remove truly empty
  
  const editData = {
    title: poll.title || poll.question || '',
    description: poll.description || '',
    options: optionsArray.length >= 2 ? optionsArray : ['', '']
  };
  
  console.log('✅ FIXED editData:', editData);
  console.log('✅ Options:', editData.options);
  
  navigate('/configure-poll', {
    state: {
      pollData: editData,
      isEditing: true,
      pollId: poll.id
    }
  });
};


  const handleSharePoll = () => {
    if (!poll) return;

    // Navigate to share page with poll data
    navigate('/share-poll', {
      state: {
        poll: poll,
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
    // Handle both formats: direct options array or poll_options with option_text
    options: (poll.options || poll.poll_options?.map((opt, index) => ({
      id: opt.id || index + 1,
      text: opt.option_text || opt,
      votes: opt.vote_count || 0
    })) || []).map((opt, index) => 
      typeof opt === 'string' 
        ? { id: index + 1, text: opt, votes: 0 }
        : opt
    ),
    theme: poll.theme_settings || poll.theme || {},
    schedule: poll.schedule || {
      startDate: poll.start_date || poll.startDate,
      closeDate: poll.close_date || poll.closeDate
    },
    settings: poll.settings || {}
  };

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
            
            {/* ✅ Show Poll Schedule */}
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