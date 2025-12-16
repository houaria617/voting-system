// services/voteService.js
import axios from 'axios';

// Create axios instance with base URL pointing to backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

class VoteService {
  /**
   * Fetch poll data for voting
   * @param {string} pollId - Poll ID
   * @returns {Promise<Object>} Poll data with success flag
   */
  async fetchPollForVoting(pollId) {
    try {
      if (!pollId) {
        throw new Error('Poll ID is required');
      }

      console.log('📥 Fetching poll for voting:', pollId);

      const response = await API.get(`/polls/${pollId}`);
      
      const pollData = response.data.poll || response.data;

      if (!pollData.id) {
        return {
          success: false,
          error: 'Invalid poll data'
        };
      }

      console.log('✅ Poll fetched for voting:', pollData.id);

      return {
        success: true,
        poll: pollData
      };
    } catch (err) {
      console.error('❌ Error fetching poll:', err.message);
      
      if (err.response?.status === 404) {
        return {
          success: false,
          error: 'Poll not found'
        };
      }
      
      return {
        success: false,
        error: err.message || 'Error loading poll'
      };
    }
  }

  /**
   * Fetch poll data by ID (alias for fetchPollForVoting)
   * @param {string} pollId - Poll ID
   * @returns {Promise<Object>} Poll data with success flag
   */
  async getPoll(pollId) {
    return this.fetchPollForVoting(pollId);
  }

  /**
   * Extract and format poll options
   * @param {Object} pollData - Poll data from API
   * @returns {Array} Formatted options array
   */
  formatOptions(pollData) {
    if (!pollData) return [];

    let pollOptions = [];

    if (pollData.options && Array.isArray(pollData.options)) {
      pollOptions = pollData.options.map((opt, idx) => ({
        id: opt.id || idx + 1,
        text: typeof opt === 'string' ? opt : opt.text || opt.option_text || opt,
        votes: opt.vote_count || 0
      }));
    } else if (pollData.poll_options && Array.isArray(pollData.poll_options)) {
      pollOptions = pollData.poll_options.map((opt, idx) => ({
        id: opt.id || idx + 1,
        text: opt.option_text || opt.text || opt,
        votes: opt.vote_count || 0
      }));
    }

    return pollOptions;
  }

  /**
   * Check if poll is closed
   * @param {Object} pollData - Poll data
   * @returns {boolean} True if poll is closed
   */
  isPollClosed(pollData) {
    if (!pollData) return false;

    const closeDate = new Date(pollData.end_time || pollData.close_date || pollData.closeDate);
    const now = new Date();

    return now > closeDate;
  }

  /**
   * Submit a vote
   * @param {string} pollId - Poll ID
   * @param {number|array} optionId - Single option ID or array of IDs
   * @returns {Promise<Object>} Vote result with success flag
   */
  async submitVote(pollId, optionId) {
    try {
      if (!pollId) {
        throw new Error('Poll ID is required');
      }

      if (!optionId || (Array.isArray(optionId) && optionId.length === 0)) {
        throw new Error('Please select an option');
      }

      console.log('🗳️ Submitting vote for poll:', pollId, 'option(s):', optionId);

      // Ensure optionId is always an array for backend
      const optionIds = Array.isArray(optionId) ? optionId : [optionId];

      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Create headers with auth token if available
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Submit vote to backend
      const response = await API.post(
        `/polls/${pollId}/vote`,
        { optionId: optionIds },
        { headers }
      );

      console.log('✅ Vote successful:', response.data);

      return {
        success: true,
        message: response.data.message || 'Vote recorded successfully',
        data: response.data
      };
    } catch (err) {
      console.error('❌ Vote error:', err.message);

      // Handle specific error responses
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 403) {
          return {
            success: false,
            error: 'Already voted',
            message: data.message || 'You have already voted on this poll',
            statusCode: 403
          };
        } else if (status === 400) {
          return {
            success: false,
            error: 'Invalid vote',
            message: data.message || 'Cannot submit vote',
            statusCode: 400
          };
        } else if (status === 404) {
          return {
            success: false,
            error: 'Poll not found',
            message: data.message || 'Poll does not exist',
            statusCode: 404
          };
        } else if (status === 500) {
          return {
            success: false,
            error: 'Server error',
            message: data.message || 'Server error - please try again',
            statusCode: 500
          };
        }

        return {
          success: false,
          error: 'Vote failed',
          message: data.message || `Failed to submit vote (Status: ${status})`,
          statusCode: status
        };
      }

      // Handle network errors
      return {
        success: false,
        error: 'Network error',
        message: err.message || 'An error occurred while submitting your vote'
      };
    }
  }

  /**
   * Format date to readable string
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return 'Not set';

    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid date';
    }
  }

  /**
   * Get theme settings from poll
   * @param {Object} pollData - Poll data
   * @returns {Object} Theme settings with defaults
   */
  getThemeSettings(pollData) {
    if (!pollData) {
      return {
        primaryColor: '#137fec',
        secondaryColor: '#ffffff',
        backgroundColor: '#ffffff',
        fontStyle: 'inter',
        backgroundImage: null
      };
    }

    const theme = pollData.theme_settings || pollData.theme || {};

    return {
      primaryColor: theme.primaryColor || '#137fec',
      secondaryColor: theme.secondaryColor || '#ffffff',
      backgroundColor: theme.backgroundColor || '#ffffff',
      fontStyle: theme.fontStyle || 'inter',
      backgroundImage: theme.backgroundImage || null,
      logo: theme.logo || null
    };
  }
}

export default new VoteService();