// src/middlewares/auth.js

const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { UserRole } = require('../config/constants');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'No token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        return errorResponse(res, 'Invalid or expired token', 401);
    }
};

/**
 * Check if user has required role
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 'Authentication required', 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            return errorResponse(
                res,
                'You do not have permission to access this resource',
                403
            );
        }

        next();
    };
};

/**
 * Optional authentication - attach user if token exists
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyAccessToken(token);
            req.user = decoded;
        }

        next();
    } catch (error) {
        // Token invalid but continue without user
        next();
    }
};

module.exports = {
    authenticate,
    authorize,
    optionalAuth
};