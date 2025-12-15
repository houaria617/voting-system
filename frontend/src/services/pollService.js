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
      // ✅ FIXED: More thorough validation
      if (!pollData || !pollData.title || pollData.title.trim() === '') {
        throw new Error('Poll must have a title');
      }

      if (!pollData.options || !Array.isArray(pollData.options) || pollData.options.length < 2) {
        throw new Error('Poll must have at least 2 options');
      }

      // ✅ FIXED: Validate dates are present
      if (!configData.startDate || configData.startDate.trim() === '') {
        throw new Error('Start date is required');
      }

      if (!configData.closeDate || configData.closeDate.trim() === '') {
        throw new Error('Close date is required');
      }

      // ✅ FIXED: Validate date logic
      const startDate = new Date(configData.startDate);
      const closeDate = new Date(configData.closeDate);

      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid start date format');
      }

      if (isNaN(closeDate.getTime())) {
        throw new Error('Invalid close date format');
      }

      if (startDate >= closeDate) {
        throw new Error('Start date must be before close date');
      }

      // ✅ FIXED: Build complete poll data with proper field mapping
      const completeData = {
        title: pollData.title.trim(),
        description: pollData.description?.trim() || '',
        options: pollData.options.filter(opt => opt.trim() !== '').map(opt => opt.trim()),
        theme: {
          primaryColor: configData.primaryColor || '#137fec',
          secondaryColor: configData.secondaryColor || '#ffffff',
          selectedTheme: configData.selectedTheme || 'corporate',
          logo: configData.logo || '',
          backgroundImage: configData.backgroundImage || '',
          fontStyle: configData.fontStyle || 'inter'
        },
        settings: {
          isAnonymous: configData.anonymity === 'fully-anonymous',
          visibility: configData.visibility === 'public' ? 'ALWAYS' : 'AFTER_VOTE',
          accessType: configData.visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
          allowMultiple: configData.ismultiplechoice || false,
          selectionLimit: configData.selectionLimit || 1,
          minSelectionLimit: configData.minSelectionLimit || 1,
          enableComments: configData.enableComments !== undefined ? configData.enableComments : true,
          showResults: configData.showResults !== undefined ? configData.showResults : false
        },
        schedule: {
          startDate: configData.startDate,
          closeDate: configData.closeDate
        },
        invitedEmails: configData.visibility === 'private' ? (configData.allowedVoters || []) : [],
        allowedDomains: configData.visibility === 'private' ? (configData.allowedDomains || []) : []
      };

      console.log('📤 Creating poll with data:', completeData);

      // Make API request
      const response = await API.post('/polls', completeData);

      console.log('✅ Poll created successfully:', response.data);

      // ✅ FIXED: Handle different response formats
      return {
        success: true,
        poll: response.data.poll || response.data,
        share: response.data.share,
        message: 'Poll created successfully!'
      };
    } catch (err) {
      console.error('❌ Error creating poll:', err);

      // ✅ FIXED: Better error message handling
      let errorMessage = 'Failed to create poll';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      return {
        success: false,
        message: errorMessage
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
    // ✅ FIXED: Same format as createPoll for consistency
    const completeData = {
      title: updateData.title?.trim() || '',
      description: updateData.description?.trim() || '',
      options: updateData.options?.filter(opt => opt.trim() !== '').map(opt => opt.trim()) || [],
      theme: updateData.theme || {
        primaryColor: updateData.primaryColor || '#137fec',
        secondaryColor: updateData.secondaryColor || '#ffffff'
      },
      settings: updateData.settings || {},
      schedule: updateData.schedule || {},
      invitedEmails: updateData.invitedEmails || [],
      allowedDomains: updateData.allowedDomains || []
    };

    console.log('📤 Updating poll with data:', completeData);
    
    const response = await API.put(`/polls/${pollId}`, completeData);

    console.log('✅ Poll updated successfully:', response.data);

    return {
      success: true,
      poll: response.data.poll || response.data,
      message: 'Poll updated successfully!'
    };
  } catch (err) {
    console.error('❌ Error updating poll:', err);
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Failed to update poll'
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
        message: err.response?.data?.message || err.message || 'Failed to delete poll'
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
        poll: response.data.poll || response.data
      };
    } catch (err) {
      console.error('❌ Error fetching poll:', err);

      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch poll'
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
        polls: response.data.polls || response.data
      };
    } catch (err) {
      console.error('❌ Error fetching polls:', err);

      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch polls'
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
      
      // ✅ ADDED: Timeout to prevent hanging
      setTimeout(() => resolve(false), 5000);
    });
  }
}

// Export as singleton
export default new PollService();