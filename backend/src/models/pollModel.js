const supabase = require('../config/db');

// 1. Create Poll (Standard)
const createPoll = async (pollData) => {
    const { data, error } = await supabase
        .from('polls')
        .insert([pollData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// 2. Add Options (Standard)
const addPollOptions = async (optionsData) => {
    const { data, error } = await supabase
        .from('poll_options')
        .insert(optionsData)
        .select();

    if (error) throw error;
    return data;
};

// 3. Get Poll (Standard)
const getPollById = async (pollId) => {
    const { data, error } = await supabase
        .from('polls')
        .select(`*, poll_options (id, option_text, vote_count_cache)`)
        .eq('id', pollId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Handle 404
        throw error;
    }
    return data;
};

// === NEW: Functions for Private Polls ===

// 4. Add Invited Voters (Populate ALLOWED_VOTERS table)
const addAllowedVoters = async (pollId, userIds) => {
    if (!userIds || userIds.length === 0) return;

    const rows = userIds.map(uid => ({
        poll_id: pollId,
        user_id: uid,
        granted_at: new Date()
    }));

    const { error } = await supabase.from('allowed_voters').insert(rows);
    if (error) throw error;
};

// 5. Check Permissions
const isUserAllowed = async (pollId, userId) => {
    const { data, error } = await supabase
        .from('allowed_voters')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single();

    // If row exists, data is not null -> Return true
    return !!data;
};
// 6. Get all polls for a specific user (Dashboard)
const getUserPolls = async (userId, searchQuery = '') => {
    let query = supabase
        .from('polls')
        .select('*') // We select all poll fields. You could also select specific ones.
        .eq('creator_id', userId)
        .order('created_at', { ascending: false }); // Recent first

    // If a search term exists, add the filter
    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
};
// 7. Update Poll Metadata
const updatePoll = async (pollId, updateData) => {
    const { data, error } = await supabase
        .from('polls')
        .update(updateData)
        .eq('id', pollId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// 8. Delete Poll
const deletePoll = async (pollId) => {
    const { data, error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

    if (error) throw error;
    return data;
};

module.exports = {
    createPoll,
    addPollOptions,
    getPollById,
    addAllowedVoters,
    isUserAllowed,
    getUserPolls,
    updatePoll,
    deletePoll
};

