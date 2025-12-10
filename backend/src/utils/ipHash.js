// ============================================

// src/utils/ipHash.js
const crypto = require('crypto');

/**
 * Create a hash of IP address for anonymous voting
 * Combines IP with a secret salt for privacy
 */
const hashIPAddress = (ipAddress) => {
    const salt = process.env.IP_HASH_SALT || 'default-salt-change-in-production';
    return crypto
        .createHash('sha256')
        .update(ipAddress + salt)
        .digest('hex');
};

/**
 * Get client IP from request
 * Handles proxy headers
 */
const getClientIP = (req) => {
    return (
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress
    );
};

module.exports = { hashIPAddress, getClientIP };