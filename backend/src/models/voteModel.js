const supabase = require('../config/db');

// 1. Check if User voted (Logged in check)
const hasUserVoted = async (pollId, userId) => {
    console.log(`🔍 Checking if user ${userId} voted on poll ${pollId}`);
    
    const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId);
    
    if (error) {
        console.error('❌ Error checking user vote:', error);
        throw error;
    }
    
    const hasVoted = data && data.length > 0;
    console.log(`✅ User ${userId} vote check result: ${hasVoted} (found ${data?.length || 0} votes)`);
    
    return hasVoted;
};

// 2. Check if IP voted (Anonymous/Guest check)
const hasIpVoted = async (pollId, ipHash) => {
    console.log(`🔍 Checking if IP ${ipHash.substring(0, 8)}... voted on poll ${pollId}`);
    
    const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('ip_address_hash', ipHash);
    
    if (error) {
        console.error('❌ Error checking IP vote:', error);
        throw error;
    }
    
    const hasVoted = data && data.length > 0;
    console.log(`✅ IP ${ipHash.substring(0, 8)}... vote check result: ${hasVoted} (found ${data?.length || 0} votes)`);
    
    return hasVoted;
};

// 3. Save Vote & Update Count
const castVote = async (voteData) => {
    console.log('💾 Casting vote:', voteData);
    
    // A. Save the vote record
    const { data, error } = await supabase
        .from('votes')
        .insert([voteData])
        .select();

    if (error) {
        console.error('❌ Error casting vote:', error);
        throw error;
    }

    console.log('✅ Vote inserted:', data);

    // B. Trigger the SQL Function to add +1 to the count
    try {
        const rpcResult = await supabase.rpc('increment_vote_count', { 
            option_row_id: voteData.option_id 
        });
        console.log('✅ Vote count incremented');
    } catch (rpcError) {
        console.error('⚠️ Warning: Vote count increment failed (vote still saved):', rpcError);
        // Continue - vote is already saved, just count might be delayed
    }

    return data ? data[0] : null;
};

module.exports = {
    hasUserVoted,
    hasIpVoted,
    castVote
};