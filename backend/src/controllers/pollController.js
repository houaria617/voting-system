const pollModel = require('../models/pollModel');
const userModel = require('../models/userModel');
const voteModel = require('../models/voteModel');

const VALID_VISIBILITY = ['ALWAYS', 'AFTER_VOTE', 'CLOSED'];
const VALID_STATUS = ['DRAFT', 'ACTIVE', 'CLOSED', 'PAUSED'];

// 1. CREATE POLL
const createPoll = async (req, res) => {
    try {
        const { title, description, options, theme, settings, invitedEmails, schedule, status } = req.body;
        const creatorId = req.user.id;

        // Validation - Relaxed for DRAFT
        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Title is required" });
        }
        
        // Strict Check only if NOT draft
        if (status !== 'DRAFT') {
            if (!options || !Array.isArray(options) || options.length < 2) {
                return res.status(400).json({ message: "Active polls must have at least 2 options" });
            }
            if (!schedule?.startDate || !schedule?.closeDate) {
                 return res.status(400).json({ message: "Active polls must have start and close dates" });
            }
        }

        const visibility = (settings?.visibility && VALID_VISIBILITY.includes(settings.visibility)) 
            ? settings.visibility 
            : 'ALWAYS';
            
        const pollStatus = (status && VALID_STATUS.includes(status)) ? status : 'ACTIVE';

        // Construct Poll Object
        const newPollData = {
            creator_id: creatorId,
            title,
            description,
            theme_settings: { ...(theme || {}), access_type: settings?.accessType || 'PUBLIC' },
            is_anonymous: settings?.isAnonymous || false,
            start_time: schedule?.startDate ? new Date(schedule.startDate).toISOString() : null,
            end_time: schedule?.closeDate ? new Date(schedule.closeDate).toISOString() : null,
            results_visibility: visibility,
            allow_multiple_choices: settings?.allowMultiple || false,
            status: pollStatus
        };

        const createdPoll = await pollModel.createPoll(newPollData);

        // Add Options (if any exist)
        let createdOptions = [];
        if (options && Array.isArray(options) && options.length > 0) {
            const optionsData = options.map((opt, index) => ({
                poll_id: createdPoll.id,
                option_text: opt,
                order_index: index
            }));
            createdOptions = await pollModel.addPollOptions(optionsData);
        }

        // Add Allowed Emails
        if (settings?.accessType === 'PRIVATE' && invitedEmails?.length > 0) {
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
            poll: { ...createdPoll, poll_options: createdOptions },
            share: { url: `/poll/${createdPoll.id}` }
        });

    } catch (err) {
        console.error("Create Poll Error:", err);
        res.status(500).json({ message: "Server Error creating poll" });
    }
};

// 2. GET POLL
const getPoll = async (req, res) => {
    try {
        const { id } = req.params;
        const poll = await pollModel.getPollById(id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        const userId = req.user ? req.user.id : null;
        const isCreator = userId === poll.creator_id;

        // Block drafts from public view
        if (poll.status === 'DRAFT' && !isCreator) {
            return res.status(403).json({ message: "This poll is not yet published." });
        }

        // Simple vote check
        let hasVoted = false;
        if (userId) hasVoted = await voteModel.hasUserVoted(poll.id, userId);

        res.json({ ...poll, user_has_voted: hasVoted });
    } catch (err) {
        console.error("Get Poll Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. EDIT POLL
const editPoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, theme, settings, schedule, status } = req.body;
        const userId = req.user.id;

        const poll = await pollModel.getPollById(id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });
        if (poll.creator_id !== userId) return res.status(403).json({ message: "Unauthorized" });

        // Build update data
        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status) updateData.status = status;
        
        // Merge theme settings
        if (theme) {
            updateData.theme_settings = { 
                ...poll.theme_settings, 
                ...theme 
            };
        }
        
        // Update schedule
        if (schedule?.startDate) updateData.start_time = new Date(schedule.startDate).toISOString();
        if (schedule?.closeDate) updateData.end_time = new Date(schedule.closeDate).toISOString();
        
        // Update settings (merge with existing)
        if (settings) {
            if (settings.isAnonymous !== undefined) updateData.is_anonymous = settings.isAnonymous;
            if (settings.visibility) updateData.results_visibility = settings.visibility;
            if (settings.enableComments !== undefined) {
                updateData.theme_settings = {
                    ...updateData.theme_settings,
                    enableComments: settings.enableComments
                };
            }
            if (settings.showResults !== undefined) {
                updateData.theme_settings = {
                    ...updateData.theme_settings,
                    showResults: settings.showResults
                };
            }
        }

        const updatedPoll = await pollModel.updatePoll(id, updateData);
        res.json({ message: "Poll updated", poll: updatedPoll });

    } catch (err) {
        console.error("Update Poll Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 4. DELETE POLL
const deletePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const poll = await pollModel.getPollById(id);
        if (!poll) return res.status(404).json({ message: "Poll not found" });
        if (poll.creator_id !== userId) return res.status(403).json({ message: "Unauthorized" });

        // Allow deleting DRAFT polls anytime
        // Prevent deleting CLOSED polls with votes
        if (poll.status === 'CLOSED') {
            const voteCount = await pollModel.getVoteCount(id);
            if (voteCount > 0) {
                return res.status(400).json({ message: "Cannot delete closed poll with votes" });
            }
        }

        await pollModel.deletePoll(id);
        res.json({ message: "Poll deleted successfully" });

    } catch (err) {
        console.error("Delete Poll Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 5. GET DASHBOARD
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search } = req.query;
        const polls = await pollModel.getUserPolls(userId, search);
        res.json({ count: polls.length, polls });
    } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard" });
    }
};

module.exports = { 
    createPoll, 
    getPoll, 
    editPoll,  // ← Changed back to editPoll
    deletePoll, 
    getDashboard 
};