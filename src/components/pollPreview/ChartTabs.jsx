import React from 'react';
import { CHART_TYPES } from '../../constants/chartConfig';
import '../../styles/pollPreview.css';

const ChartTabs = ({ activeChart, setActiveChart }) => {
  return (
    <div className="chart-tabs">
      <button
        onClick={() => setActiveChart(CHART_TYPES.BAR)}
        className={`chart-tab ${activeChart === CHART_TYPES.BAR ? 'chart-tab-active' : ''}`}
      >
        Bar Chart
      </button>
      <button
        onClick={() => setActiveChart(CHART_TYPES.PIE)}
        className={`chart-tab ${activeChart === CHART_TYPES.PIE ? 'chart-tab-active' : ''}`}
      >
        Pie Chart
      </button>
    </div>
  );
};

export default ChartTabs;