import React, { useState } from 'react';
import PageHeader from '../components/pollLanding/PageHeader';
import PollQuestion from '../components/pollLanding/PollQuestion';
import PollActions from '../components/pollLanding/PollActions';
import { pollVotingData } from '../data/pollVotingData';
import '../styles/pollLanding.css';

const PollLandingPage = () => {
  const [selectedOption, setSelectedOption] = useState(3); // Pre-selected SvelteKit

  const handleBackToDashboard = () => {
    console.log('Navigate back to dashboard');
    // Later: navigate('/dashboard') with React Router
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleEditPoll = () => {
    console.log('Edit poll');
    // Later: navigate to edit page or open modal
  };

  const handleSharePoll = () => {
    console.log('Share poll');
    // Later: open share dialog or copy link
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
          </div>

          <PollQuestion
            question={pollVotingData.question}
            description={pollVotingData.description}
            options={pollVotingData.options}
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
