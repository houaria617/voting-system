// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

/**
 * 1. AUTHENTICATE (Required): Must have valid token
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ [AUTH] No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.substring(7);

        // Check if token is blacklisted
        const isBlacklisted = await userModel.isTokenBlacklisted(token);
        if (isBlacklisted) {
            console.log('❌ [AUTH] Token is blacklisted');
            return res.status(401).json({ message: 'Session expired. Please login again.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('✅ [AUTH] Token verified:', {
            userId: decoded.user?.id,
            email: decoded.user?.email,
            role: decoded.user?.role
        });

        // Attach user info to request
        req.user = decoded.user; // { id, email, role }
        req.token = token;

        next();
    } catch (error) {
        console.error('❌ [AUTH] Token verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

/**
 * 2. OPTIONAL AUTH: Try to authenticate, but continue as guest if no token
 * This is CRITICAL for voting - allows both logged-in users and guests
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // No token? Continue as guest
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('👤 [OPTIONAL-AUTH] No token - continuing as guest');
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7);

        // Check if token is blacklisted
        const isBlacklisted = await userModel.isTokenBlacklisted(token);
        if (isBlacklisted) {
            console.log('⚠️ [OPTIONAL-AUTH] Token blacklisted - continuing as guest');
            req.user = null;
            return next();
        }

        // Try to verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('✅ [OPTIONAL-AUTH] User authenticated:', {
            userId: decoded.user?.id,
            email: decoded.user?.email,
            role: decoded.user?.role
        });

        // Attach user info
        req.user = decoded.user;
        req.token = token;

        next();
    } catch (error) {
        // Token invalid? Just continue as guest
        console.log('⚠️ [OPTIONAL-AUTH] Token invalid - continuing as guest:', error.message);
        req.user = null;
        next();
    }
};

/**
 * 3. AUTHORIZE: Check if user has required role
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        next();
    };
};

module.exports = {
    authenticate,
    optionalAuth,
    authorize
};