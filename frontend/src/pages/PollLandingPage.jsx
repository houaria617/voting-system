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

        // Check if poll data was passed via navigation (after creation)
        if (location.state?.poll) {
          console.log('📦 Poll from navigation state:', location.state.poll);
          const formattedPoll = pollService.formatPollForDisplay(location.state.poll);
          console.log('✅ Formatted poll:', formattedPoll);
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

        console.log('🔍 Fetching poll with ID:', pollId);
        const result = await pollService.getPoll(pollId);

        if (result.success) {
          console.log('📦 Poll from API:', result.poll);
          const formattedPoll = pollService.formatPollForDisplay(result.poll);
          console.log('✅ Formatted poll:', formattedPoll);
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
        console.error('❌ Error fetching poll:', err);
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

  // Format date for display
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
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
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
          </div>

          <PollQuestion
            question={poll.question}
            description={poll.description}
            options={poll.options}
            selectedOption={selectedOption}
            onOptionChange={handleOptionChange}
            allowMultiple={poll.settings.allowMultiple}
          />

          {/* Poll Schedule Section */}
          <div style={{
            marginTop: '2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Poll Schedule
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem'
            }}>
              {/* Starts */}
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Starts
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  {formatDate(poll.schedule.startDate)}
                </p>
              </div>

              {/* Ends */}
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Ends
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  {formatDate(poll.schedule.closeDate)}
                </p>
              </div>
            </div>
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