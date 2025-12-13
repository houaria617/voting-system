const supabase = require('../config/db');

// Check if email exists
const findUserByEmail = async (email) => {
    // Equivalent to: SELECT * FROM users WHERE email = $1
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single(); // .single() means "I expect only one row"

    if (error && error.code !== 'PGRST116') { // PGRST116 is the code for "No rows found", which is fine here
        throw error;
    }

    return data;
};

// Create new user
const createUser = async (name, email, passwordHash, role = 'VOTER') => {
    // Equivalent to: INSERT INTO users ... RETURNING *
    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                name: name,
                email: email,
                password_hash: passwordHash,
                role: role,
                status: 'ACTIVE',
                created_at: new Date()
            }
        ])
        .select() // This ensures we get the new user data back
        .single();

    if (error) {
        throw error;
    }

    return data;
};
// Save a reset token
const saveResetToken = async (userId, token) => {
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    const { error } = await supabase
        .from('password_resets')
        .insert([{ user_id: userId, token: token, expires_at: expiresAt }]);

    if (error) throw error;
};

// Find token and check if valid
const findResetToken = async (token) => {
    const { data, error } = await supabase
        .from('password_resets')
        .select('*, users(id, email, password_hash)') // Join with users table
        .eq('token', token)
        .gt('expires_at', new Date().toISOString()) // Ensure not expired
        .single();

    if (error) return null;
    return data;
};

// Update User Password
const updateUserPassword = async (userId, newPasswordHash) => {
    const { error } = await supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId);

    if (error) throw error;

    // Optional: Delete used reset tokens
    await supabase.from('password_resets').delete().eq('user_id', userId);
};
const addToBlacklist = async (token) => {
    // We should set the expiry to match the JWT expiry, 
    // but for simplicity, we set it to 1 hour from now.
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    const { error } = await supabase
        .from('token_blacklist')
        .insert([{ token: token, expires_at: expiresAt }]);

    if (error) throw error;
};

const isTokenBlacklisted = async (token) => {
    const { data, error } = await supabase
        .from('token_blacklist')
        .select('id')
        .eq('token', token)
        .single();

    // If we find data, the token IS blacklisted (return true)
    return data ? true : false;
};

module.exports = {
    findUserByEmail,
    createUser,
    saveResetToken,
    findResetToken,
    updateUserPassword,
    addToBlacklist,      // <--- New
    isTokenBlacklisted   // <--- New
};


