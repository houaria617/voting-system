import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import '../../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';
import { deletePoll } from '../../api/pollApi';
import Swal from 'sweetalert2';

const PollItem = ({ poll, onPollDeleted }) => {
  const navigate = useNavigate();

  const handleViewPoll = () => {
    navigate(`/poll/${poll.id}/results`);
  };

  const handleEditPoll = () => {
    navigate(`/configurePoll/${poll.id}`);
  };

  const handleDeletePoll = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Delete Poll?',
      text: `Are you sure you want to delete "${poll.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePoll(poll.id);
        
        if (response.success) {
          Swal.fire('Deleted!', 'Poll has been deleted.', 'success');
          // Call the callback to refresh the dashboard
          if (onPollDeleted) {
            onPollDeleted(poll.id);
          }
        } else {
          Swal.fire('Error!', response.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete poll', 'error');
        console.error('Delete error:', error);
      }
    }
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
          <button className="icon-btn" onClick={handleViewPoll} title="View Results">
            <Eye size={20}/>
          </button>
          <button className="icon-btn" onClick={handleEditPoll} title="Edit Poll">
            <Edit2 size={20} />
          </button>
          <button className="icon-btn icon-btn-danger" onClick={handleDeletePoll} title="Delete Poll">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollItem;
