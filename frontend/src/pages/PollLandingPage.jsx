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
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Extract theme from poll
  const getThemeStyles = () => {
    if (!poll?.theme_settings) {
      return {
        backgroundColor: '#f9fafb',
        primaryColor: '#137fec',
        secondaryColor: '#ffffff',
        textColor: '#111827',
        cardBackground: '#ffffff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        backgroundImage: null,
        logo: null
      };
    }

    const theme = poll.theme_settings;
    
    return {
      backgroundColor: theme.backgroundColor || '#f9fafb',
      primaryColor: theme.primaryColor || '#137fec',
      secondaryColor: theme.secondaryColor || '#ffffff',
      textColor: theme.textColor || '#111827',
      cardBackground: theme.cardBackground || '#ffffff',
      fontFamily: theme.fontStyle === 'roboto' ? 'Roboto, sans-serif' :
                   theme.fontStyle === 'poppins' ? 'Poppins, sans-serif' :
                   theme.fontStyle === 'playfair' ? 'Playfair Display, serif' :
                   'Inter, system-ui, sans-serif',
      backgroundImage: theme.backgroundImage || null,
      logo: theme.logo || null
    };
  };

  const theme = getThemeStyles();

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

  const handleOptionChange = (optionId, isMultipleChoice) => {
    console.log('🔘 Clicked:', optionId, 'Multiple:', isMultipleChoice);
    
    if (isMultipleChoice) {
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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEditPoll = () => {
    if (!poll) return;
    
    console.log('📝 [EDIT] Starting edit for poll:', poll.id);
    console.log('📝 [EDIT] Poll title:', poll.title);
    
    navigate(`/configure-poll/${poll.id}`, {
      state: {
        isEditing: true
      }
    });
  };

  const handleSharePoll = () => {
    if (!poll) return;
    navigate('/share-poll', {
      state: { poll: { ...poll, options }, pollId: poll.id }
    });
  };

  if (isLoading) {
    return (
      <div className="poll-landing-page" style={{ 
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily 
      }}>
        <PageHeader onBackToDashboard={handleBackToDashboard} logoUrl={theme.logo} />
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
        <PageHeader onBackToDashboard={handleBackToDashboard} logoUrl={theme.logo} />
        <main className="poll-landing-main">
          <div className="poll-landing-container">
            <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
              <p>Poll data not available</p>
              <button 
                onClick={handleBackToDashboard}
                style={{
                  marginTop: '1rem', padding: '0.75rem 1.5rem',
                  backgroundColor: theme.primaryColor, color: 'white',
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

  console.log('✅ Rendering with:', {
    options: formattedPollData.options.length,
    allowMultiple: formattedPollData.settings.allowMultiple,
    selected: formattedPollData.settings.allowMultiple ? selectedOptions : selectedOption
  });

  return (
    <div 
      className="poll-landing-page" 
      style={{ 
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        minHeight: '100vh'
      }}
    >
      <PageHeader 
        onBackToDashboard={handleBackToDashboard} 
        logoUrl={theme.logo}
      />
      
      <main className="poll-landing-main">
        <div className="poll-landing-container">
          {/* Page Intro */}
          <div className="page-intro">
            <h1 className="page-title" style={{ color: theme.textColor }}>
              Poll Preview
            </h1>
            <p className="page-subtitle" style={{ color: theme.textColor, opacity: 0.8 }}>
              This is how your poll will appear to participants.
            </p>
            
            <div style={{
              marginTop: '1rem', 
              padding: '1rem',
              backgroundColor: `${theme.primaryColor}15`,
              borderRadius: '0.5rem',
              border: `1px solid ${theme.primaryColor}40`,
              fontSize: '0.875rem',
              color: theme.textColor
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
                    borderRadius: '0.25rem', 
                    fontWeight: 600
                  }}>
                    {formattedPollData.settings.allowMultiple ? '☑️ Multiple Choice' : '🔘 Single Choice'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ THEMED POLL CARD */}
          <div style={{
            backgroundColor: theme.cardBackground,
            backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${theme.primaryColor}20`
          }}>
            {/* ✅ Pass theme via CSS variables */}
            <style>
              {`
                .poll-question-card {
                  --theme-primary: ${theme.primaryColor};
                  --theme-text: ${theme.textColor};
                  --theme-card-bg: ${theme.cardBackground};
                }
                
                .question-title {
                  color: ${theme.textColor} !important;
                }
                
                .question-description {
                  color: ${theme.textColor} !important;
                  opacity: 0.8;
                }
                
                .submit-button {
                  background-color: ${theme.primaryColor} !important;
                  color: ${theme.secondaryColor} !important;
                }
                
                .submit-button:hover {
                  opacity: 0.9;
                }
                
                .radio-option input:checked + .radio-checkmark {
                  border-color: ${theme.primaryColor} !important;
                }
                
                .radio-option input:checked + .radio-checkmark::after {
                  background-color: ${theme.primaryColor} !important;
                }
              `}
            </style>
            
            <div style={{
  backgroundColor: theme.cardBackground,
  backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.primaryColor}20`
}}>
  {/* ✅ THEMED POLL CARD */}
  <style>
    {`
      .poll-question-card {
        --theme-primary: ${theme.primaryColor};
        --theme-text: ${theme.textColor};
        --theme-card-bg: ${theme.cardBackground};
      }
      
      .question-title {
        color: ${theme.textColor} !important;
      }
      
      .question-description {
        color: ${theme.textColor} !important;
        opacity: 0.8;
      }
      
      .submit-button {
        background-color: ${theme.primaryColor} !important;
        color: ${theme.secondaryColor} !important;
        cursor: pointer !important;
      }
      
      .submit-button:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-2px);
      }
      
      .submit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed !important;
      }
      
      .radio-option input:checked + .radio-checkmark {
        border-color: ${theme.primaryColor} !important;
      }
      
      .radio-option input:checked + .radio-checkmark::after {
        background-color: ${theme.primaryColor} !important;
      }
    `}
  </style>
  
  <div className="poll-question-card">
    <div className="question-header">
      <h2 className="question-title">{formattedPollData.question}</h2>
      
      {/* ✅ Voting Type Label */}
      <p style={{
        fontSize: '0.875rem',
        color: theme.textColor,
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        fontWeight: '500',
        opacity: 0.7
      }}>
        {formattedPollData.settings.allowMultiple ? '☑️ Multiple Choice' : '🔘 Single Choice Only'}
      </p>
      
      {formattedPollData.description && (
        <p className="question-description">{formattedPollData.description}</p>
      )}
    </div>

    <div className="options-list">
      {formattedPollData.options.length > 0 ? (
        formattedPollData.options.map(option => (
          <label
            key={option.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              marginBottom: '0.75rem',
              border: `2px solid ${formattedPollData.settings.allowMultiple 
                ? (selectedOptions.includes(option.id) ? theme.primaryColor : '#e5e7eb')
                : (selectedOption === option.id ? theme.primaryColor : '#e5e7eb')
              }`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              backgroundColor: formattedPollData.settings.allowMultiple 
                ? (selectedOptions.includes(option.id) ? `${theme.primaryColor}10` : 'white')
                : (selectedOption === option.id ? `${theme.primaryColor}10` : 'white'),
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleOptionChange(option.id, formattedPollData.settings.allowMultiple)}
          >
            <input
              type={formattedPollData.settings.allowMultiple ? 'checkbox' : 'radio'}
              name="poll-option"
              value={option.id}
              checked={formattedPollData.settings.allowMultiple 
                ? selectedOptions.includes(option.id)
                : selectedOption === option.id
              }
              onChange={() => {}}
              style={{
                width: '20px',
                height: '20px',
                marginRight: '1rem',
                cursor: 'pointer',
                accentColor: theme.primaryColor
              }}
            />
            <span style={{
              fontSize: '1rem',
              color: theme.textColor,
              fontWeight: formattedPollData.settings.allowMultiple 
                ? (selectedOptions.includes(option.id) ? '600' : '400')
                : (selectedOption === option.id ? '600' : '400')
            }}>
              {option.text}
            </span>
          </label>
        ))
      ) : (
        <p style={{ 
          color: '#9ca3af', 
          fontStyle: 'italic',
          padding: '2rem',
          textAlign: 'center'
        }}>
          No options available
        </p>
      )}
    </div>

    {/* ✅ SUBMIT BUTTON - NOW FUNCTIONAL FOR PREVIEW */}
    <button 
      className="submit-button"
      disabled={formattedPollData.settings.allowMultiple 
        ? selectedOptions.length === 0 
        : !selectedOption
      }
      onClick={() => {
        const selected = formattedPollData.settings.allowMultiple ? selectedOptions : selectedOption;
        alert(`✅ Vote Preview: You selected option(s): ${selected}`);
      }}
      style={{
        width: '100%',
        padding: '0.875rem',
        backgroundColor: theme.primaryColor,
        color: theme.secondaryColor,
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: formattedPollData.settings.allowMultiple 
          ? (selectedOptions.length === 0 ? 'not-allowed' : 'pointer')
          : (!selectedOption ? 'not-allowed' : 'pointer'),
        opacity: formattedPollData.settings.allowMultiple 
          ? (selectedOptions.length === 0 ? 0.5 : 1)
          : (!selectedOption ? 0.5 : 1),
        transition: 'all 0.2s ease',
        marginTop: '1.5rem'
      }}
    >
      Submit Vote (Preview Only)
    </button>

    {/* ✅ PREVIEW NOTICE */}
    <div style={{
      marginTop: '1rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#fef3c7',
      borderLeft: `4px solid #f59e0b`,
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: '#92400e'
    }}>
     This is a preview. Actual votes will be submitted through the public voting page.
    </div>
  </div>
</div>
          </div>

          {/* ✅ THEMED ACTIONS */}
          <style>
            {`
              .action-button-primary {
                background-color: ${theme.primaryColor} !important;
                color: ${theme.secondaryColor} !important;
              }
              
              .action-button-secondary {
                border-color: ${theme.primaryColor} !important;
                color: ${theme.primaryColor} !important;
              }
              
              .action-button-secondary:hover {
                background-color: ${theme.primaryColor}15 !important;
              }
            `}
          </style>
          
          <PollActions onEditPoll={handleEditPoll} onSharePoll={handleSharePoll} />
        </div>
      </main>
    </div>
  );
};

export default PollLandingPage;