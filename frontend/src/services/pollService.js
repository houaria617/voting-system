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

      // Build complete poll data
      const completeData = {
        title: pollData.title || pollData.question,
        description: pollData.description || '',
        options: pollData.options,
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
        schedule: {
          startDate: configData.startDate || null,
          closeDate: configData.closeDate || null
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
   * Get a single poll
   * @param {string} pollId - Poll ID
   * @returns {Promise<Object>} Poll data
   */
  async getPoll(pollId) {
    try {
      const response = await API.get(`/polls/${pollId}`);

      return {
        success: true,
        poll: response.data.poll
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
}

// Export as singleton
export default new PollService();