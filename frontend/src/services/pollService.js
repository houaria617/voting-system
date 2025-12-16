// services/pollService.js
import API from '../api/axiosConfig';
import Swal from 'sweetalert2';

class PollService {
  /**
   * Create a new poll
   */
  async createPoll(pollData, configData) {
    try {
      if (!pollData || !pollData.title || pollData.title.trim() === '') {
        throw new Error('Poll must have a title');
      }

      if (!pollData.options || !Array.isArray(pollData.options) || pollData.options.length < 2) {
        throw new Error('Poll must have at least 2 options');
      }

      if (!configData.startDate || configData.startDate.trim() === '') {
        throw new Error('Start date is required');
      }

      if (!configData.closeDate || configData.closeDate.trim() === '') {
        throw new Error('Close date is required');
      }

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

      const originalOptions = pollData.options.filter(opt => opt.trim() !== '').map(opt => opt.trim());

      const completeData = {
        title: pollData.title.trim(),
        description: pollData.description?.trim() || '',
        options: originalOptions,
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

      const response = await API.post('/polls', completeData);

      console.log('✅ Poll created successfully:', response.data);

      let pollWithOptions = response.data.poll || response.data;
      
      if (!pollWithOptions.options && !pollWithOptions.poll_options) {
        console.warn('⚠️ Backend did not return options! Adding them manually...');
        pollWithOptions.options = originalOptions;
      }

      if (!pollWithOptions.options && !pollWithOptions.poll_options && pollWithOptions.id) {
        console.warn('⚠️ Attempting to fetch poll with options...');
        try {
          const fetchResult = await this.getPoll(pollWithOptions.id);
          if (fetchResult.success && (fetchResult.poll.options || fetchResult.poll.poll_options)) {
            pollWithOptions = fetchResult.poll;
            console.log('✅ Successfully fetched poll with options');
          } else {
            console.error('❌ Backend does not return options - adding manually as fallback');
            pollWithOptions.options = originalOptions;
          }
        } catch (fetchError) {
          console.error('❌ Failed to fetch poll:', fetchError);
          pollWithOptions.options = originalOptions;
        }
      }

      return {
        success: true,
        poll: pollWithOptions,
        share: response.data.share,
        message: 'Poll created successfully!'
      };
    } catch (err) {
      console.error('❌ Error creating poll:', err);

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
   * ✅ Save poll as draft
   */
  async saveDraft(pollId, pollData, configData) {
    try {
      console.log('💾 [DRAFT] Saving poll as draft...', { pollId, pollData, configData });

      // ✅ Safety checks
      if (!pollData) {
        throw new Error('Poll data is required');
      }
      if (!configData) {
        throw new Error('Configuration data is required');
      }

      let result;

      // 🔧 EDIT MODE: Update existing poll as draft
      if (pollId) {
        console.log('📝 [DRAFT-EDIT] Updating poll', pollId, 'as draft');

        const draftUpdateData = {
          title: pollData.title || 'Untitled Poll',
          description: pollData.description || '',
          
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
            visibility: configData.showResults ? 'ALWAYS' : 'AFTER_VOTE',
            enableComments: configData.enableComments !== undefined ? configData.enableComments : true,
            showResults: configData.showResults !== undefined ? configData.showResults : false
          },
          
          schedule: {
            startDate: configData.startDate || null,
            closeDate: configData.closeDate || null
          },
          
          status: 'DRAFT' // ✅ Mark as draft
        };

        result = await this.updatePoll(pollId, draftUpdateData);
      }
      // ➕ CREATE MODE: Create new poll as draft
      else {
        console.log('➕ [DRAFT-CREATE] Creating new poll as draft');

        const validOptions = (pollData.options || []).filter(opt => opt && opt.trim() !== '');
        
        const draftData = {
          title: pollData.title || 'Untitled Poll',
          description: pollData.description || '',
          options: validOptions.length >= 2 ? validOptions : ['Option 1', 'Option 2'],
          
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
            visibility: configData.showResults ? 'ALWAYS' : 'AFTER_VOTE',
            accessType: configData.visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
            allowMultiple: configData.ismultiplechoice || false,
            enableComments: configData.enableComments !== undefined ? configData.enableComments : true,
            showResults: configData.showResults !== undefined ? configData.showResults : false
          },
          
          schedule: {
            startDate: configData.startDate || null,
            closeDate: configData.closeDate || null
          },
          
          invitedEmails: configData.visibility === 'private' ? (configData.allowedVoters || []) : [],
          allowedDomains: configData.visibility === 'private' ? (configData.allowedDomains || []) : [],
          
          status: 'DRAFT' // ✅ Mark as draft
        };

        // For draft, we don't validate strict requirements
        result = await API.post('/polls', draftData);
        
        if (result.data.success !== false) {
          return {
            success: true,
            poll: result.data.poll || result.data,
            message: 'Poll saved as draft successfully!'
          };
        } else {
          throw new Error(result.data.message || 'Failed to save draft');
        }
      }

      if (result.success) {
        console.log('✅ [DRAFT] Poll saved as draft successfully!');
        return result;
      } else {
        throw new Error(result.message || 'Failed to save draft');
      }

    } catch (error) {
      console.error('❌ [DRAFT] Error saving draft:', error);

      let errorMessage = 'Failed to save draft';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Update an existing poll
   */
  async updatePoll(pollId, updateData) {
    try {
      console.log('📝 Updating poll:', pollId, updateData);

      const response = await API.put(`/polls/${pollId}`, updateData);

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
   */
  async deletePoll(pollId) {
    try {
      console.log('🗑️ Deleting poll:', pollId);

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
   */
  async getPoll(pollId) {
    try {
      const response = await API.get(`/polls/${pollId}`);
      
      console.log('📥 Fetched poll data:', response.data);

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
   * Submit a vote
   */
  async vote(pollId, optionIdOrArray) {
    try {
      console.log('🗳️ Submitting vote for poll:', pollId, 'option(s):', optionIdOrArray);
      
      const optionIds = Array.isArray(optionIdOrArray) 
        ? optionIdOrArray 
        : [optionIdOrArray];

      if (!optionIds || optionIds.length === 0) {
        throw new Error('No option selected');
      }

      const token = localStorage.getItem('token');
      
      const response = await API.post(`/polls/${pollId}/vote`, {
        optionId: optionIds
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Vote successful:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Vote recorded successfully!'
      };

    } catch (err) {
      console.error('❌ Vote error:', err);
      
      let errorMessage = 'Failed to submit vote';
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
}

// Export as singleton
export default new PollService();