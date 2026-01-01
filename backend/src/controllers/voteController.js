const crypto = require('crypto');
const requestIp = require('request-ip');
const voteModel = require('../models/voteModel');
const pollModel = require('../models/pollModel');

const submitVote = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { optionId } = req.body;

        // 1. Basic Validation
        if (!optionId) {
            return res.status(400).json({ message: "Option ID is required" });
        }

        // 2. Get Poll Info (This already includes poll_options!)
        const poll = await pollModel.getPollById(pollId);

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        // === 🛑 SECURITY FIX: Verify Option belongs to Poll ===
        // We loop through the poll's options to make sure the sent optionId exists there.
        const isValidOption = poll.poll_options.some(opt => opt.id === parseInt(optionId));

        if (!isValidOption) {
            return res.status(400).json({ message: "Invalid Option. This option does not belong to this poll." });
        }
        // =====================================================

        // 3. Check if Poll is Closed
        if (poll.status === 'CLOSED') {
            return res.status(400).json({ message: "Voting is closed for this poll." });
        }

        // 4. Identify Voter
        const userId = req.user ? req.user.id : null;
        const clientIp = requestIp.getClientIp(req);
        const ipHash = crypto.createHash('sha256').update(clientIp || 'unknown').digest('hex');

        // 5. DOUBLE VOTE CHECK
        let alreadyVoted = false;

        if (userId) {
            alreadyVoted = await voteModel.hasUserVoted(pollId, userId);
        } else {
            alreadyVoted = await voteModel.hasIpVoted(pollId, ipHash);
        }

        if (alreadyVoted) {
            return res.status(403).json({ message: "You have already voted on this poll." });
        }

        // 6. Handle Anonymity
        const finalUserId = poll.is_anonymous ? null : userId;

        // 7. Execute Vote
        const voteData = {
            poll_id: pollId,
            option_id: optionId,
            user_id: finalUserId,
            ip_address_hash: ipHash
        };

        await voteModel.castVote(voteData);

        res.status(201).json({ message: "Vote submitted successfully" });

    } catch (err) {
        if (err.code === '23505') {
            return res.status(403).json({ message: "You have already voted." });
        }
        console.error("Vote Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { submitVote };