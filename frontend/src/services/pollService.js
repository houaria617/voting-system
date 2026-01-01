// services/pollService.js
import API from '../api/axiosConfig';
import Swal from 'sweetalert2';

class PollService {
  /**
   * Create a new poll
   * @param {Object} pollData - Basic poll data (title, options)
   * @param {Object} configData - Configuration settings
   * @returns {Promise<Object>} Created poll data
   */
  async createPoll(pollData, configData) {
    try {
      // Validate required fields
      if (!pollData.title || !pollData.options || pollData.options.length < 2) {
        throw new Error('Poll must have a title and at least 2 options');
      }

      // Validate dates are not empty
      if (!configData.startDate || configData.startDate.trim() === '') {
        throw new Error('Poll start date is required');
      }

      if (!configData.closeDate || configData.closeDate.trim() === '') {
        throw new Error('Poll close date is required');
      }

      // Validate start date is before close date
      const startDate = new Date(configData.startDate);
      const closeDate = new Date(configData.closeDate);

      if (startDate >= closeDate) {
        throw new Error('Start date must be before close date');
      }

      // Validate dates are in the future
      const now = new Date();
      if (startDate < now) {
        throw new Error('Start date cannot be in the past');
      }

      // Build complete poll data
      const completeData = {
        title: pollData.title || pollData.question,
        description: pollData.description || '',
        options: pollData.options,
        startDate: configData.startDate, // ✅ Send at root level
        endDate: configData.closeDate,   // ✅ Send at root level (backend might expect 'endDate')
        theme: {
          primaryColor: configData.primaryColor,
          secondaryColor: configData.secondaryColor,
          selectedTheme: configData.selectedTheme,
          logo: configData.logo,
          backgroundImage: configData.backgroundImage,
          fontStyle: configData.fontStyle
        },
        settings: {
          isAnonymous: configData.anonymity === 'fully-anonymous',
          visibility: configData.visibility === 'public' ? 'ALWAYS' : 'AFTER_VOTE',
          accessType: configData.visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
          allowMultiple: configData.ismultiplechoice,
          selectionLimit: configData.selectionLimit || 1,
          minSelectionLimit: configData.minSelectionLimit || 1,
          enableComments: configData.enableComments,
          showResults: configData.showResults
        },
        invitedEmails: configData.visibility === 'private' ? configData.allowedVoters : [],
        allowedDomains: configData.visibility === 'private' ? configData.allowedDomains : []
      };

      console.log('📤 Creating poll with data:', completeData);

      // Make API request
      const response = await API.post('/polls', completeData);

      console.log('✅ Poll created successfully:', response.data);

      return {
        success: true,
        poll: response.data.poll,
        message: 'Poll created successfully!'
      };
    } catch (err) {
      console.error('❌ Error creating poll:', err);

      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create poll'
      };
    }
  }

  /**
   * Update an existing poll
   * @param {string} pollId - Poll ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated poll data
   */
  async updatePoll(pollId, updateData) {
    try {
      const response = await API.put(`/polls/${pollId}`, updateData);

      return {
        success: true,
        poll: response.data.poll,
        message: 'Poll updated successfully!'
      };
    } catch (err) {
      console.error('❌ Error updating poll:', err);

      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update poll'
      };
    }
  }

  /**
   * Delete a poll
   * @param {string} pollId - Poll ID
   * @returns {Promise<Object>} Success status
   */
  async deletePoll(pollId) {
    try {
      await API.delete(`/polls/${pollId}`);

      return {
        success: true,
        message: 'Poll deleted successfully!'
      };
    } catch (err) {
      console.error('❌ Error deleting poll:', err);

      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete poll'
      };
    }
  }

  /**
   * Get a single poll (with full details)
   * @param {string} pollId - Poll ID
   * @returns {Promise<Object>} Poll data
   */
  async getPoll(pollId) {
    try {
      const response = await API.get(`/polls/${pollId}`);

      return {
        success: true,
        poll: response.data
      };
    } catch (err) {
      console.error('❌ Error fetching poll:', err);

      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch poll'
      };
    }
  }

  /**
   * Get poll preview (for creator before publishing)
   * @param {string} pollId - Poll ID
   * @returns {Promise<Object>} Poll preview data
   */
  async getPollPreview(pollId) {
    try {
      const response = await API.get(`/polls/${pollId}/preview`);

      return {
        success: true,
        poll: response.data
      };
    } catch (err) {
      console.error('❌ Error fetching poll preview:', err);

      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch poll preview'
      };
    }
  }

  /**
   * Format poll data for display
   * @param {Object} poll - Raw poll data from API
   * @returns {Object} Formatted poll data
   */
  formatPollForDisplay(poll) {
    return {
      id: poll.id,
      question: poll.title,
      description: poll.description || '',
      options: poll.options?.map(opt => ({
        id: opt.id,
        text: opt.text || opt.option_text,
        votes: opt.vote_count || 0
      })) || [],
      settings: {
        isAnonymous: poll.settings?.isAnonymous || false,
        allowMultiple: poll.settings?.allowMultiple || false,
        showResults: poll.settings?.showResults || false,
        visibility: poll.settings?.visibility || 'ALWAYS',
        accessType: poll.settings?.accessType || 'PUBLIC'
      },
      theme: {
        primaryColor: poll.theme?.primaryColor || '#137fec',
        secondaryColor: poll.theme?.secondaryColor || '#ffffff',
        selectedTheme: poll.theme?.selectedTheme || 'corporate',
        logo: poll.theme?.logo || '',
        backgroundImage: poll.theme?.backgroundImage || '',
        fontStyle: poll.theme?.fontStyle || 'inter'
      },
      schedule: {
        startDate: poll.schedule?.startDate || poll.start_date,
        closeDate: poll.schedule?.closeDate || poll.end_date
      },
      createdBy: poll.created_by || poll.creator,
      createdAt: poll.created_at,
      totalVotes: poll.total_votes || 0
    };
  }

  /**
   * Get all polls for current user
   * @returns {Promise<Object>} List of polls
   */
  async getMyPolls() {
    try {
      const response = await API.get('/polls/my-polls');

      return {
        success: true,
        polls: response.data.polls
      };
    } catch (err) {
      console.error('❌ Error fetching polls:', err);

      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch polls'
      };
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate image URL
   * @param {string} url - Image URL
   * @returns {Promise<boolean>} Is valid image
   */
  validateImageUrl(url) {
    if (!url) return Promise.resolve(true);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * Submit a vote for a poll
   * @param {string} pollId - Poll ID
   * @param {number} optionId - Selected option ID
   * @returns {Promise<Object>} Vote submission result
   */
  async submitVote(pollId, optionId) {
    try {
      const response = await API.post(`/polls/${pollId}/vote`, {
        optionId: optionId
      });

      return {
        success: true,
        message: response.data.message || 'Vote submitted successfully'
      };
    } catch (err) {
      console.error('❌ Error submitting vote:', err);

      return {
        success: false,
        message: err.response?.data?.message || 'Failed to submit vote'
      };
    }
  }
}

// Export as singleton
export default new PollService();