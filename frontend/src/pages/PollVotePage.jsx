import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/pollLanding/PageHeader';
import PollQuestion from '../components/pollLanding/PollQuestion';
import PollActions from '../components/pollLanding/PollActions';
import pollService from '../services/pollService';
import Swal from 'sweetalert2';
import '../styles/pollLanding.css'; // Reuse same CSS + themes

const PollVotePage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load poll data
  useEffect(() => {
    const loadPoll = async () => {
      try {
        const result = await pollService.getPoll(pollId);
        if (result.success) {
          const pollData = result.poll;
          setPoll(pollData);
          
          const pollOptions = pollData.poll_options?.map(opt => ({
            id: opt.id,
            text: opt.option_text || opt.text,
            vote_count_cache: opt.vote_count_cache || 0
          })) || [];
          
          setOptions(pollOptions);
          setHasVoted(result.user_has_voted || false);
        } else {
          throw new Error(result.message || 'Poll not found');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Poll Not Found',
          text: error.message,
          confirmButtonColor: '#137fec'
        }).then(() => navigate('/dashboard'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPoll();
  }, [pollId, navigate]);

  // Formatted data for components (SAME as landing)
  const formattedPollData = poll && options.length ? {
    question: poll.title,
    description: poll.description || '',
    options: options.map((opt, index) => ({
      id: opt.id,
      text: opt.text,
      votes: opt.vote_count_cache || 0
    })),
    theme: poll.theme_settings || {},
    settings: {
      allowMultiple: poll.allow_multiple_choices,
      isAnonymous: poll.is_anonymous,
      visibility: poll.results_visibility
    }
  } : null;

  // Handle voting
  const handleVote = async () => {
    if (!formattedPollData) return;
    
    const isMultiple = formattedPollData.settings.allowMultiple;
    const selection = isMultiple ? selectedOptions : selectedOption;
    
    if (!selection || (Array.isArray(selection) && selection.length === 0)) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select an option',
        confirmButtonColor: '#137fec'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await pollService.vote(pollId, selection);
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Vote Recorded!',
          text: 'Thank you for voting!',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Refresh poll data to show updated counts
        const freshPoll = await pollService.getPoll(pollId);
        if (freshPoll.success) {
          setPoll(freshPoll.poll);
          const freshOptions = freshPoll.poll.poll_options?.map(opt => ({
            id: opt.id,
            text: opt.option_text,
            vote_count_cache: opt.vote_count_cache || 0
          })) || [];
          setOptions(freshOptions);
          setHasVoted(true);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Voting Failed',
        text: error.message || 'Please try again',
        confirmButtonColor: '#137fec'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (optionId, isMultipleChoice) => {
    if (hasVoted) return; // Prevent changes after voting
    
    if (isMultipleChoice) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOption(prev => prev === optionId ? null : optionId);
    }
  };

  const handleBackToDashboard = () => navigate('/dashboard');

  if (isLoading) {
    return (
      <div className="poll-landing-page" data-theme="corporate">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Loading poll...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!formattedPollData) {
    return (
      <div className="poll-landing-page">
        <PageHeader onBackToDashboard={handleBackToDashboard} />
        <main className="poll-landing-main">
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
            <div style={{ fontSize: '2rem' }}>⚠️</div>
            <p>Poll not available</p>
          </div>
        </main>
      </div>
    );
  }

 return (
  <div
    className="poll-landing-page"
    data-theme={formattedPollData.theme.selectedTheme || 'corporate'}
    style={{
      '--primary-color': formattedPollData.theme.primaryColor || '#137fec',
      '--secondary-color': formattedPollData.theme.secondaryColor || '#ffffff',
      '--font-family': "'Inter', sans-serif",
      backgroundImage: formattedPollData.theme.backgroundImage
        ? `url(${formattedPollData.theme.backgroundImage})`
        : 'none'
    }}
  >
    <PageHeader onBackToDashboard={handleBackToDashboard} />

    <main className="poll-landing-main">
      <div className="poll-landing-container">
        <div className="page-intro">
          <h1 className="page-title">{formattedPollData.question}</h1>
          <p className="page-subtitle">
            {formattedPollData.settings.allowMultiple
              ? 'You can select multiple options.'
              : 'Please select one option.'}
          </p>
        </div>

        <div className="poll-question-card">
          <PollQuestion
            question={formattedPollData.question}
            description={formattedPollData.description}
            options={formattedPollData.options}
            selectedOption={
              formattedPollData.settings.allowMultiple
                ? selectedOptions
                : selectedOption
            }
            onOptionChange={handleOptionChange}
            isMultipleChoice={formattedPollData.settings.allowMultiple}
            hasVoted={hasVoted}
          />

          <button
            className="submit-button"
            onClick={handleVote}
            disabled={
              isSubmitting ||
              (!formattedPollData.settings.allowMultiple &&
                !selectedOption) ||
              (formattedPollData.settings.allowMultiple &&
                selectedOptions.length === 0) ||
              hasVoted
            }
          >
            {hasVoted ? 'You already voted' : isSubmitting ? 'Submitting…' : 'Submit Vote'}
          </button>
        </div>
      </div>
    </main>
  </div>
);

};

export default PollVotePage;
