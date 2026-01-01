import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/pollLanding/PageHeader';
import PollQuestion from '../components/pollLanding/PollQuestion';
import PollActions from '../components/pollLanding/PollActions';
import pollService from '../services/pollService';
import '../styles/pollLanding.css';
import Swal from 'sweetalert2';
const PollLandingPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await pollService.getPoll(pollId);
        
        if (response.success) {
          const poll = response.poll;
          setPollData({
            id: poll.id,
            question: poll.title,
            description: poll.description || '',
            options: poll.poll_options ? poll.poll_options.map(opt => ({
              id: opt.id,
              text: opt.option_text
            })) : [],
            userHasVoted: poll.user_has_voted
          });
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to load poll');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleEditPoll = () => {
    navigate('/configure-poll');
  };

  const handleSharePoll = () => {
    navigate(`/share-poll/${pollId}`);
  };

  const handleVote = async () => {
    if (!selectedOption) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select an option',
        text: 'You must choose an option before voting.'
      });
      return;
    }
    try {
      const response = await pollService.submitVote(pollId, selectedOption);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Vote Submitted!',
          text: 'Your vote has been recorded successfully.',
          confirmButtonColor: '#137fec'
        }).then(() => {
          navigate(`/poll/${pollId}/results`);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Vote Failed',
          text: response.message
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting your vote.'
      });
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="poll-landing-page">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading poll...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="poll-landing-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!pollData) {
    return (
      <div className="poll-landing-page">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Poll not found
        </div>
      </div>
    );
  }

  return (
    <div className="poll-landing-page">
      <PageHeader onBackToDashboard={handleBackToDashboard} />

      <main className="poll-landing-main">
        <div className="poll-landing-container">
          <div className="page-intro">
            <h1 className="page-title">Poll</h1>
            <p className="page-subtitle">
              Vote on this poll.
            </p>
          </div>

          <PollQuestion
            question={pollData.question}
            description={pollData.description}
            options={pollData.options}
            selectedOption={selectedOption}
            onOptionChange={handleOptionChange}
          />

          {!pollData.userHasVoted ? (
            <div className="vote-section">
              <button onClick={handleVote} className="vote-button">
                Submit Vote
              </button>
            </div>
          ) : (
            <div className="voted-message">
              <p>You have already voted on this poll.</p>
              <button onClick={() => navigate(`/poll/${pollId}/results`)} className="results-button">
                View Results
              </button>
            </div>
          )}

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
