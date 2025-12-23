const crypto = require('crypto');
const requestIp = require('request-ip');
const voteModel = require('../models/voteModel');
const pollModel = require('../models/pollModel');

const submitVote = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { optionId } = req.body;

        console.log('\n========================================');
        console.log('🗳️ VOTE SUBMISSION STARTED');
        console.log('========================================');

        // 1. Basic Validation
        if (!optionId) {
            console.log('❌ Option ID missing');
            return res.status(400).json({ message: "Option ID is required" });
        }

        // 2. Get Poll Info
        const poll = await pollModel.getPollById(pollId);

        if (!poll) {
            console.log('❌ Poll not found:', pollId);
            return res.status(404).json({ message: "Poll not found" });
        }

        console.log('✅ Poll found:', pollId, '| Type:', poll.theme_settings?.access_type || 'PUBLIC');

        // ✅ CHECK IF PRIVATE POLL - VERIFY EMAIL ACCESS
        const accessType = poll.theme_settings?.access_type || 'PUBLIC';
        
        if (accessType === 'PRIVATE') {
            console.log('🔐 PRIVATE POLL - Verifying access...');

            const userEmail = req.user ? req.user.email : null;

            if (!userEmail) {
                console.log('❌ Private poll: User not authenticated or no email');
                return res.status(403).json({
                    message: "You must be logged in to vote on this private poll.",
                    code: "NOT_AUTHENTICATED"
                });
            }

            const userDomain = userEmail.split('@')[1];
            
            // Get the list of allowed voters for this poll
            const allowedVoters = poll.allowed_voters || [];
            const allowedDomains = poll.allowed_domains || [];
            
            console.log('📧 User email:', userEmail);
            console.log('📧 User domain:', userDomain);

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
                console.log('❌ Email not authorized');
                return res.status(403).json({
                    message: "You are not authorized to vote on this private poll. Your email is not in the invited list.",
                    code: "EMAIL_NOT_AUTHORIZED"
                });
            }

            console.log('✅ Email is authorized');
        }

        // === SECURITY: Verify Option belongs to Poll ===
        const isValidOption = poll.poll_options.some(opt => opt.id === parseInt(optionId));

        if (!isValidOption) {
            console.log('❌ Invalid option:', optionId);
            return res.status(400).json({ message: "Invalid Option. This option does not belong to this poll." });
        }

        console.log('✅ Option is valid:', optionId);

        // === Check if Poll is Closed ===
        if (poll.status === 'CLOSED') {
            console.log('❌ Poll is closed');
            return res.status(400).json({ message: "Voting is closed for this poll." });
        }

        // === Identify Voter ===
        const userId = req.user ? req.user.id : null;
        const clientIp = requestIp.getClientIp(req);
        const ipHash = crypto.createHash('sha256').update(clientIp || 'unknown').digest('hex');

        console.log('👤 User ID:', userId);
        console.log('🌐 Client IP Hash:', ipHash.substring(0, 8) + '...');

        // === DOUBLE VOTE CHECK ===
        let alreadyVoted = false;

        if (userId) {
            // Logged-in user: check by user_id
            alreadyVoted = await voteModel.hasUserVoted(pollId, userId);
            console.log(`🔍 Checking by USER_ID: ${userId} | Already Voted: ${alreadyVoted}`);
        } else {
            // Guest user: check by IP hash
            alreadyVoted = await voteModel.hasIpVoted(pollId, ipHash);
            console.log(`🔍 Checking by IP_HASH: ${ipHash.substring(0, 8)}... | Already Voted: ${alreadyVoted}`);
        }

        if (alreadyVoted) {
            console.log('❌ DOUBLE VOTE BLOCKED');
            return res.status(403).json({ message: "You have already voted on this poll." });
        }

        console.log('✅ No previous vote found - proceeding with vote submission');

        // === Handle Anonymity ===
        const finalUserId = poll.is_anonymous ? null : userId;

        // === Execute Vote ===
        const voteData = {
            poll_id: pollId,
            option_id: optionId,
            user_id: finalUserId,
            ip_address_hash: ipHash
        };

        console.log('💾 Storing vote:', {
            poll_id: pollId,
            option_id: optionId,
            user_id: finalUserId || 'NULL (anonymous)',
            ip_hash: ipHash.substring(0, 8) + '...'
        });

        await voteModel.castVote(voteData);

        console.log('✅ VOTE SUBMITTED SUCCESSFULLY');
        console.log('========================================\n');

        res.status(201).json({ message: "Vote submitted successfully" });

    } catch (err) {
        console.error('\n❌ VOTE ERROR:', err.message);
        console.error('Error Code:', err.code);
        console.error('========================================\n');

        if (err.code === '23505') {
            return res.status(403).json({ message: "You have already voted." });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { submitVote };