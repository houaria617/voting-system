import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import '../../styles/dashboard.css';
import { useNavigate, Link } from 'react-router-dom';
const PollItem = ({ poll }) => {
  const navigate = useNavigate();
   const handleViewPoll = () => {
    navigate('/poll-preview');
  };
  return (
    <div className="poll-item">
      <div className="poll-info">
        <h3 className="poll-title">{poll.title}</h3>
        <p className="poll-closing">{poll.closingInfo}</p>
      </div>
      
      <div className="poll-actions">
        <div className="poll-votes">
          <div className="votes-number">{poll.votes}</div>
          <div className="votes-label">Votes</div>
        </div>
        
        <Badge variant={poll.status.toLowerCase()}>{poll.status}</Badge>
        
        <div className="poll-buttons">
          <button className="icon-btn" onClick={handleViewPoll} >
            <Eye size={20}/>
          </button>
          <button className="icon-btn">
            <Edit2 size={20} />
          </button>
          <button className="icon-btn icon-btn-danger">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollItem;
