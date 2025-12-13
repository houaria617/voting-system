const pollModel = require('../models/pollModel');
const userModel = require('../models/userModel');
const voteModel = require('../models/voteModel'); // <--- YOU WERE MISSING THIS
const requestIp = require('request-ip');          // <--- AND THIS
const crypto = require('crypto');                 // <--- AND THIS

// Validation Helper
const VALID_VISIBILITY = ['ALWAYS', 'AFTER_VOTE', 'CLOSED'];

// =======================================================
// 1. CREATE POLL
// =======================================================
const createPoll = async (req, res) => {
    try {
        const { title, description, options, theme, settings, invitedEmails } = req.body;
        const creatorId = req.user.id;

        // A. Validation
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

        // B. Prepare Data
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
            status: 'ACTIVE'
        };

        // C. Database Calls
        const createdPoll = await pollModel.createPoll(newPollData);

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
// 2. GET POLL (With Result Hiding Logic)
// =======================================================
const getPoll = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch Poll
        const poll = await pollModel.getPollById(id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        // 2. Identify User
        const userId = req.user ? req.user.id : null;
        const isCreator = userId === poll.creator_id;

        // --- A. ACCESS PRIVACY CHECK ---
        const privacy = poll.theme_settings?.access_type || 'PUBLIC';
        if (privacy === 'PRIVATE') {
            if (!userId) return res.status(403).json({ message: "Private Poll. Login required." });

            if (!isCreator) {
                const isAllowed = await pollModel.isUserAllowed(poll.id, userId);
                if (!isAllowed) return res.status(403).json({ message: "Access Denied." });
            }
        }

        // --- B. RESULT VISIBILITY CHECK ---
        let hasVoted = false;

        if (userId) {
            // Check by User ID
            hasVoted = await voteModel.hasUserVoted(poll.id, userId);
        } else {
            // Check by IP Hash (for guests)
            const clientIp = requestIp.getClientIp(req);
            const ipHash = crypto.createHash('sha256').update(clientIp || 'unknown').digest('hex');
            hasVoted = await voteModel.hasIpVoted(poll.id, ipHash);
        }

        // Decision Logic
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

        // --- C. SANITIZE DATA ---
        if (!showResults) {
            poll.poll_options = poll.poll_options.map(opt => {
                const { vote_count_cache, ...safeOption } = opt; // Remove count
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
// 3. GET USER DASHBOARD (My Polls + Search)
// =======================================================
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id; // From Middleware
        const { search } = req.query; // Get ?search=... from URL

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
        const { id } = req.params; // Poll ID
        const { title, description, theme, settings, status } = req.body;
        const userId = req.user.id;

        // 1. Fetch Existing Poll
        const poll = await pollModel.getPollById(id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        // 2. Permission Check (Must be Creator)
        if (poll.creator_id !== userId) {
            return res.status(403).json({ message: "You are not authorized to edit this poll." });
        }

        // 3. Status Check (Cannot edit if CLOSED)
        if (poll.status === 'CLOSED') {
            return res.status(400).json({ message: "Cannot edit a closed poll." });
        }

        // 4. Prepare Update Data
        // We merge the new theme/settings with existing ones to avoid losing data
        const currentTheme = poll.theme_settings || {};

        // Logic: If user sends accessType, update it, otherwise keep old one
        const newAccessType = settings?.accessType || currentTheme.access_type;

        const updatedTheme = {
            ...currentTheme,
            ...(theme || {}), // Overwrite colors/fonts if provided
            access_type: newAccessType
        };

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        updateData.theme_settings = updatedTheme;

        // settings updates
        if (settings?.isAnonymous !== undefined) updateData.is_anonymous = settings.isAnonymous;
        if (settings?.visibility) updateData.results_visibility = settings.visibility;

        // Allow closing/opening the poll
        if (status) updateData.status = status;

        // 5. Update DB
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

