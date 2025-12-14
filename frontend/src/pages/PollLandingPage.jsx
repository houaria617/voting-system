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
  const location = useLocation();
  
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);

        // Check if poll data was passed via navigation
        if (location.state?.poll) {
          const formattedPoll = pollService.formatPollForDisplay(location.state.poll);
          setPoll(formattedPoll);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        if (!pollId) {
          Swal.fire({
            icon: 'error',
            title: 'No Poll ID',
            text: 'Poll ID is missing.',
            confirmButtonColor: '#137fec'
          }).then(() => navigate('/dashboard'));
          return;
        }

        const result = await pollService.getPoll(pollId);

        if (result.success) {
          const formattedPoll = pollService.formatPollForDisplay(result.poll);
          setPoll(formattedPoll);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message,
            confirmButtonColor: '#137fec'
          }).then(() => navigate('/dashboard'));
        }
      } catch (err) {
        console.error('Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load poll.',
          confirmButtonColor: '#137fec'
        }).then(() => navigate('/dashboard'));
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId, location.state, navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleEditPoll = () => {
    if (!poll) return;
    navigate(`/configure-poll/${poll.id}`, {
      state: {
        pollData: {
          title: poll.question,
          description: poll.description,
          options: poll.options.map(opt => opt.text)
        },
        isEdit: true
      }
    });
  };

  const handleSharePoll = () => {
    if (!poll) return;
    navigate(`/share-poll/${poll.id}`, { state: { poll } });
  };

  if (loading) {
    return (
      <div className="poll-landing-page">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              gap: '1rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#137fec',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading poll...</p>
            </div>
          </div>
        </main>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="poll-landing-page">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '0.5rem' }}>
                Poll Not Found
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                The poll you're looking for doesn't exist.
              </p>
              <button
                onClick={handleBackToDashboard}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#137fec',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
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

  // Format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
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
            
            {/* Poll Schedule Info */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    opacity: 0.9,
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                  }}>
                    STARTS
                  </div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {formatDate(poll.schedule.startDate)}
                  </div>
                </div>

                <div style={{
                  width: '2px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  display: window.innerWidth < 640 ? 'none' : 'block'
                }} />

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    opacity: 0.9,
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                  }}>
                    ENDS
                  </div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {formatDate(poll.schedule.closeDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PollQuestion
            question={poll.question}
            description={poll.description}
            options={poll.options}
            selectedOption={selectedOption}
            onOptionChange={handleOptionChange}
          />

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