// src/config/constants.js

/**
 * User Roles
 */
const UserRole = {
    ADMIN: 'ADMIN',
    VOTER: 'VOTER'
};

/**
 * User Status
 */
const UserStatus = {
    ACTIVE: 'ACTIVE',
    BANNED: 'BANNED'
};

/**
 * Poll Status
 */
const PollStatus = {
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    CLOSED: 'CLOSED',
    ARCHIVED: 'ARCHIVED'
};

/**
 * Poll Results Visibility
 */
const ResultsVisibility = {
    PUBLIC: 'PUBLIC',           // Anyone can see results
    AFTER_VOTE: 'AFTER_VOTE',   // Only after user votes
    AFTER_END: 'AFTER_END',     // Only after poll ends
    PRIVATE: 'PRIVATE'          // Only creator can see
};

/**
 * Poll Participation Constraint
 */
const ParticipationConstraint = {
    ONCE: 'Unique(poll_id, user_id)',  // User can vote once
    MULTIPLE: 'MULTIPLE'                // User can change vote
};

/**
 * Default Theme Settings
 */
const DefaultThemeSettings = {
    colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        background: '#FFFFFF',
        text: '#1F2937',
        accent: '#10B981'
    },
    fonts: {
        family: 'Inter, system-ui, sans-serif',
        headingSize: '24px',
        bodySize: '16px',
        weight: 'normal'
    },
    logo_url: null,
    custom_css: null
};

/**
 * File Upload Limits
 */
const UploadLimits = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    MAX_FILENAME_LENGTH: 255
};

/**
 * Pagination Defaults
 */
const Pagination = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

/**
 * Rate Limiting
 */
const RateLimits = {
    AUTH: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5 // 5 requests per window
    },
    API: {
        windowMs: 15 * 60 * 1000,
        max: 100
    },
    VOTE: {
        windowMs: 60 * 1000, // 1 minute
        max: 10
    }
};

/**
 * JWT Expiry
 */
const TokenExpiry = {
    ACCESS: '7d',
    REFRESH: '30d',
    RESET: '1h'
};

module.exports = {
    UserRole,
    UserStatus,
    PollStatus,
    ResultsVisibility,
    ParticipationConstraint,
    DefaultThemeSettings,
    UploadLimits,
    Pagination,
    RateLimits,
    TokenExpiry
};