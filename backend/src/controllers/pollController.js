const pollModel = require('../models/pollModel');
const userModel = require('../models/userModel');
const voteModel = require('../models/voteModel');
const requestIp = require('request-ip');
const crypto = require('crypto');

// Validation Helper
const VALID_VISIBILITY = ['ALWAYS', 'AFTER_VOTE', 'CLOSED'];

// =======================================================
// 1. CREATE POLL
// =======================================================
const createPoll = async (req, res) => {
    try {
        // 1. EXTRACT DATA (Including Dates)
        const {
            title,
            description,
            options,
            theme,
            settings,
            invitedEmails,
            startDate, // <--- Critical
            endDate    // <--- Critical
        } = req.body;

        const creatorId = req.user.id;

        // 2. VALIDATION
        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "Poll must have at least 2 options" });
        }

        let visibility = settings?.visibility || 'ALWAYS';
        if (!VALID_VISIBILITY.includes(visibility)) {
            if (VALID_VISIBILITY.includes(visibility.toUpperCase())) {
                visibility = visibility.toUpperCase();
            } else {
                return res.status(400).json({
                    message: `Invalid visibility. Allowed: ${VALID_VISIBILITY.join(', ')}`
                });
            }
        }

        // 3. PREPARE DATA
        const accessType = settings?.accessType === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC';

        const finalThemeSettings = {
            ...(theme || {}),
            access_type: accessType
        };

        const newPollData = {
            creator_id: creatorId,
            title,
            description,
            theme_settings: finalThemeSettings,
            is_anonymous: settings?.isAnonymous || false,
            results_visibility: visibility,
            allow_multiple_choices: settings?.allowMultiple || false,
            status: 'ACTIVE',

            // 4. MAP TO DATABASE COLUMNS
            // If startDate is missing, use NOW. If endDate is missing, use NULL.
            start_time: startDate || new Date().toISOString(),
            end_time: endDate || null
        };

        // 5. INSERT INTO DB
        const createdPoll = await pollModel.createPoll(newPollData);

        // ... (The rest of your code for options and invites) ...
        const optionsData = options.map((opt, index) => ({
            poll_id: createdPoll.id,
            option_text: opt,
            order_index: index
        }));
        await pollModel.addPollOptions(optionsData);

        if (accessType === 'PRIVATE' && invitedEmails && Array.isArray(invitedEmails)) {
            const validUserIds = [];
            for (const email of invitedEmails) {
                const user = await userModel.findUserByEmail(email);
                if (user) validUserIds.push(user.id);
            }
            if (validUserIds.length > 0) {
                await pollModel.addAllowedVoters(createdPoll.id, validUserIds);
            }
        }

        res.status(201).json({
            message: "Poll created successfully",
            poll: createdPoll,
            share: {
                url: `http://localhost:5173/poll/${createdPoll.id}`,
                mode: accessType
            }
        });

    } catch (err) {
        console.error("Create Poll Error:", err);
        res.status(500).json({ message: "Server Error creating poll" });
    }
};

// =======================================================
// 2. GET POLL
// =======================================================
const getPoll = async (req, res) => {
    try {
        const { id } = req.params;

        const poll = await pollModel.getPollById(id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        const userId = req.user ? req.user.id : null;
        const isCreator = userId === poll.creator_id;

        const privacy = poll.theme_settings?.access_type || 'PUBLIC';
        if (privacy === 'PRIVATE') {
            if (!userId) return res.status(403).json({ message: "Private Poll. Login required." });

            if (!isCreator) {
                const isAllowed = await pollModel.isUserAllowed(poll.id, userId);
                if (!isAllowed) return res.status(403).json({ message: "Access Denied." });
            }
        }

        let hasVoted = false;
        if (userId) {
            hasVoted = await voteModel.hasUserVoted(poll.id, userId);
        } else {
            const clientIp = requestIp.getClientIp(req);
            const ipHash = crypto.createHash('sha256').update(clientIp || 'unknown').digest('hex');
            hasVoted = await voteModel.hasIpVoted(poll.id, ipHash);
        }

        let showResults = false;
        if (isCreator) {
            showResults = true;
        } else if (poll.results_visibility === 'ALWAYS') {
            showResults = true;
        } else if (poll.results_visibility === 'CLOSED') {
            showResults = false;
        } else if (poll.results_visibility === 'AFTER_VOTE') {
            showResults = hasVoted;
        }

        if (!showResults) {
            poll.poll_options = poll.poll_options.map(opt => {
                const { vote_count_cache, ...safeOption } = opt;
                return safeOption;
            });
        }

        res.json({
            ...poll,
            user_has_voted: hasVoted
        });

    } catch (err) {
        console.error("Get Poll Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// =======================================================
// 3. GET DASHBOARD
// =======================================================
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search } = req.query;

        const polls = await pollModel.getUserPolls(userId, search);

        res.json({
            count: polls.length,
            polls: polls
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ message: "Server Error fetching dashboard" });
    }
};

// =======================================================
// 4. EDIT POLL
// =======================================================
const editPoll = async (req, res) => {
    try {
        const { id } = req.params;
        // 3. Added startDate and endDate to destructuring
        const { title, description, theme, settings, status, startDate, endDate } = req.body;
        const userId = req.user.id;

        const poll = await pollModel.getPollById(id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        if (poll.creator_id !== userId) {
            return res.status(403).json({ message: "You are not authorized to edit this poll." });
        }

        if (poll.status === 'CLOSED') {
            return res.status(400).json({ message: "Cannot edit a closed poll." });
        }

        const currentTheme = poll.theme_settings || {};
        const newAccessType = settings?.accessType || currentTheme.access_type;

        const updatedTheme = {
            ...currentTheme,
            ...(theme || {}),
            access_type: newAccessType
        };

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        updateData.theme_settings = updatedTheme;

        // 4. Handle Date Updates
        if (startDate) updateData.start_time = startDate;
        if (endDate) updateData.end_time = endDate;

        if (settings?.isAnonymous !== undefined) updateData.is_anonymous = settings.isAnonymous;
        if (settings?.visibility) updateData.results_visibility = settings.visibility;
        if (status) updateData.status = status;

        const updatedPoll = await pollModel.updatePoll(id, updateData);

        res.json({
            message: "Poll updated successfully",
            poll: updatedPoll
        });

    } catch (err) {
        console.error("Edit Poll Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createPoll,
    getPoll,
    getDashboard,
    editPoll
};