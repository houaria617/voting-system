const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

// Helper function to verify token string (internal use only)
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * 1. AUTHENTICATE: Verify Token & Check Blacklist
 */
const authenticate = async (req, res, next) => {
    try {
        // A. Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // B. Check Blacklist (Database Check)
        const isBlacklisted = await userModel.isTokenBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Session expired. Please login again.' });
        }

        // C. Verify Token (Crypto Check)
        const decoded = verifyAccessToken(token);

        // D. Attach to Request
        req.user = decoded.user; // Contains { id, role, ... }
        req.token = token;       // We need this for the Logout function

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

/**
 * 2. AUTHORIZE: Check User Role (e.g. 'ADMIN')
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // User must be logged in first
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check if user's role is in the allowed list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        next();
    };
};

/**
 * 3. OPTIONAL AUTH: If token exists, attach user. If not, continue as guest.
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            // Check blacklist
            const isBlacklisted = await userModel.isTokenBlacklisted(token);

            if (!isBlacklisted) {
                const decoded = verifyAccessToken(token);
                req.user = decoded.user;
            }
        }
        next();
    } catch (error) {
        // If token is invalid, just ignore it and continue (User is Guest)
        next();
    }
};

module.exports = {
    authenticate,
    authorize,
    optionalAuth
};