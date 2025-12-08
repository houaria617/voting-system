import React from 'react';
import '../../styles/pollPreview.css';

const ResultsTable = ({ options, lastUpdated }) => {
  return (
    <div className="results-table-container">
      <table className="results-table">
        <thead>
          <tr>
            <th className="table-header">OPTION</th>
            <th className="table-header">VOTES</th>
            <th className="table-header">PERCENTAGE</th>
          </tr>
        </thead>
        <tbody>
          {options.map(option => (
            <tr key={option.id} className="table-row">
              <td className="table-cell">{option.name}</td>
              <td className="table-cell">{option.votes.toLocaleString()}</td>
              <td className="table-cell">{option.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        Last updated: {lastUpdated}
      </div>
    </div>
  );
};

export default ResultsTable;
