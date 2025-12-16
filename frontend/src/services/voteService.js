import API from '../api/axiosConfig';

class VoteService {
    /**
     * Fetch poll data for voting
     */
    async fetchPollForVoting(pollId) {
        try {
            const response = await API.get(`/polls/${pollId}`);
            console.log('✅ Fetched poll for voting:', response.data);
            return {
                success: true,
                poll: response.data.poll || response.data
            };
        } catch (err) {
            console.error('❌ Error fetching poll:', err);
            throw new Error(err.response?.data?.message || err.message || 'Failed to fetch poll');
        }
    }

    /**
     * Submit a vote
     */
    async submitVote(pollId, optionId) {
        try {
            // 🛑 FIX: Changed URL from `/vote/${pollId}` to `/polls/${pollId}/vote`
            const response = await API.post(`/polls/${pollId}/vote`, {
                optionId: optionId
            });

            console.log('✅ Vote submitted successfully:', response.data);

            return {
                success: true,
                message: response.data.message || 'Vote submitted successfully!'
            };
        } catch (err) {
            console.error('❌ Error submitting vote:', err);

            throw new Error(
                err.response?.data?.message ||
                err.message ||
                'Failed to submit vote'
            );
        }
    }
}

export default new VoteService();