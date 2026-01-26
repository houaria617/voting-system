import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PollHeader from '../components/pollPreview/PollHeader';
import StatsOverview from '../components/pollPreview/StatsOverview';
import ChartTabs from '../components/pollPreview/ChartTabs';
import BarChart from '../components/pollPreview/BarChart';
import PieChart from '../components/pollPreview/PieChart';
import ResultsTable from '../components/pollPreview/ResultsTable';
import pollService from '../services/pollService';
import { CHART_TYPES } from '../constants/chartConfig';
import '../styles/pollPreview.css';

const PollResultsPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [activeChart, setActiveChart] = useState(CHART_TYPES.BAR);
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleShare = () => {
    navigate(`/share-poll/${pollId}`);
  };

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        setLoading(true);
        const response = await pollService.getPoll(pollId);
        
        if (response.success) {
          const poll = response.poll;
          const options = poll.poll_options || [];
          
          // Calculate total votes
          const totalVotes = options.reduce((sum, opt) => sum + (opt.vote_count_cache || 0), 0);
          
          // Find winning option
          const winningOption = options.reduce((max, opt) => 
            (opt.vote_count_cache || 0) > (max.vote_count_cache || 0) ? opt : max, options[0]);
          
          // Colors for charts
          const colors = ['#bfdbfe', '#3b82f6', '#93c5fd', '#1e40af', '#60a5fa'];
          
          // Transform options
          const transformedOptions = options.map((opt, index) => ({
            id: opt.id,
            name: opt.option_text,
            votes: opt.vote_count_cache || 0,
            percentage: totalVotes > 0 ? Math.round((opt.vote_count_cache || 0) / totalVotes * 100) : 0,
            color: colors[index % colors.length]
          }));
          
          const data = {
            title: poll.title,
            description: poll.description || 'Poll results',
            totalVotes,
            winningOption: winningOption ? winningOption.option_text : 'No votes yet',
            liveUpdate: 'Live',
            lastUpdated: new Date(poll.updated_at).toLocaleString(),
            options: transformedOptions
          };
          
          setPollData(data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to load poll results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPollResults();
    }
  }, [pollId]);

  if (loading) {
    return (
      <div className="poll-preview-page">
        <div className="poll-preview-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading poll results...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="poll-preview-page">
        <div className="poll-preview-container">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!pollData) {
    return (
      <div className="poll-preview-page">
        <div className="poll-preview-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Poll not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="poll-preview-page">
      <div className="poll-preview-container">
        <PollHeader 
          title={pollData.title}
          description={pollData.description}
          onShare={handleShare}
        />

        <StatsOverview 
          totalVotes={pollData.totalVotes}
          winningOption={pollData.winningOption}
          liveUpdate={pollData.liveUpdate}
        />

        <ChartTabs 
          activeChart={activeChart}
          setActiveChart={setActiveChart}
        />

        <div className="chart-section">
          {activeChart === CHART_TYPES.BAR ? (
            <BarChart options={pollData.options} />
          ) : (
            <PieChart options={pollData.options} />
          )}
        </div>

        <ResultsTable 
          options={pollData.options}
          lastUpdated={pollData.lastUpdated}
        />
      </div>
    </div>
  );
};

export default PollResultsPage;