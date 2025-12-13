const supabase = require('../config/db');

// 1. Check if User voted (Logged in check)
const hasUserVoted = async (pollId, userId) => {
    const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore "Not Found" error
    return !!data; // Returns true if found, false if not
};

// 2. Check if IP voted (Anonymous check)
const hasIpVoted = async (pollId, ipHash) => {
    const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('ip_address_hash', ipHash)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
};

// 3. Save Vote & Update Count
const castVote = async (voteData) => {
    // A. Save the vote record
    const { data, error } = await supabase
        .from('votes')
        .insert([voteData])
        .select()
        .single();

    if (error) throw error;

    // B. Trigger the SQL Function to add +1 to the count
    // We use .rpc() to call the function we created in Step 1
    await supabase.rpc('increment_vote_count', { option_row_id: voteData.option_id });

    return data;
};

module.exports = {
    hasUserVoted,
    hasIpVoted,
    castVote
};