import React, { useState } from 'react';
import PollHeader from '../components/pollPreview/PollHeader';
import StatsOverview from '../components/pollPreview/StatsOverview';
import ChartTabs from '../components/pollPreview/ChartTabs';
import BarChart from '../components/pollPreview/BarChart';
import PieChart from '../components/pollPreview/PieChart';
import ResultsTable from '../components/pollPreview/ResultsTable';
import { pollResultsData } from '../data/pollData';
import { CHART_TYPES } from '../constants/chartConfig';
import '../styles/pollPreview.css';

const PollPreviewPage = () => {
  const [activeChart, setActiveChart] = useState(CHART_TYPES.BAR);

  return (
    <div className="poll-preview-page">
      <div className="poll-preview-container">
        <PollHeader 
          title={pollResultsData.title}
          description={pollResultsData.description}
        />

        <StatsOverview 
          totalVotes={pollResultsData.totalVotes}
          winningOption={pollResultsData.winningOption}
          liveUpdate={pollResultsData.liveUpdate}
        />

        <ChartTabs 
          activeChart={activeChart}
          setActiveChart={setActiveChart}
        />

        <div className="chart-section">
          {activeChart === CHART_TYPES.BAR ? (
            <BarChart options={pollResultsData.options} />
          ) : (
            <PieChart options={pollResultsData.options} />
          )}
        </div>

        <ResultsTable 
          options={pollResultsData.options}
          lastUpdated={pollResultsData.lastUpdated}
        />
      </div>
    </div>
  );
};

export default PollPreviewPage;