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

        // ✅ NEW: 2.5. CHECK IF PRIVATE POLL - VERIFY EMAIL ACCESS (Security check)
        const accessType = poll.theme_settings?.access_type || 'PUBLIC';
        
        if (accessType === 'PRIVATE') {
            console.log('🔐 PRIVATE POLL - Verifying vote access...');

            const userEmail = req.user ? req.user.email : null;

            if (!userEmail) {
                // Private polls require authentication
                return res.status(403).json({
                    message: "You must be logged in to vote on this private poll.",
                    code: "NOT_AUTHENTICATED"
                });
            }

            const userDomain = userEmail.split('@')[1];
            
            // Get the list of allowed voters for this poll
            const allowedVoters = poll.invited_emails || poll.allowed_voters || [];
            const allowedDomains = poll.allowed_domains || [];
            
            console.log('📧 User email:', userEmail);
            console.log('📧 User domain:', userDomain);
            console.log('📧 Allowed voters:', allowedVoters);
            console.log('📧 Allowed domains:', allowedDomains);

            // Check if user's email is in the whitelist
            const isEmailAllowed = allowedVoters.some(email => 
                email.toLowerCase().trim() === userEmail.toLowerCase().trim()
            );

            // Check if user's domain is in the whitelist
            const isDomainAllowed = allowedDomains.some(domain =>
                domain.toLowerCase().trim() === userDomain.toLowerCase().trim()
            );

            // Access granted if EITHER email OR domain is allowed
            if (!isEmailAllowed && !isDomainAllowed) {
                return res.status(403).json({
                    message: "You are not authorized to vote on this private poll. Your email is not in the invited list.",
                    code: "EMAIL_NOT_AUTHORIZED"
                });
            }

            console.log('✅ Email is authorized for this private poll');
        }
        // =====================================================

        // === SECURITY FIX: Verify Option belongs to Poll ===
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