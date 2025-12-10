// src/validators/auth.validator.js
const Joi = require('joi');
const { UserRole } = require('../config/constants');

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    role: Joi.string().valid(...Object.values(UserRole)).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).max(100).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};

// ============================================

// src/validators/poll.validator.js
const Joi = require('joi');
const { PollStatus, ResultsVisibility } = require('../config/constants');

const createPollSchema = Joi.object({
    title: Joi.string().min(3).max(500).required(),
    description: Joi.string().max(2000).allow(null, ''),
    is_anonymous: Joi.boolean().default(false),
    allow_multiple_choices: Joi.boolean().default(false),
    results_visibility: Joi.string()
        .valid(...Object.values(ResultsVisibility))
        .default(ResultsVisibility.PUBLIC),
    start_time: Joi.date().iso().optional(),
    end_time: Joi.date().iso().greater(Joi.ref('start_time')).optional(),

    // Options array
    options: Joi.array()
        .items(
            Joi.object({
                option_text: Joi.string().min(1).max(500).required(),
                order_index: Joi.number().integer().min(0).required()
            })
        )
        .min(2)
        .max(20)
        .required(),

    // Theme settings (optional)
    theme_settings: Joi.object({
        colors: Joi.object({
            primary: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
            secondary: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
            background: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
            text: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
            accent: Joi.string().pattern(/^#[0-9A-F]{6}$/i)
        }),
        fonts: Joi.object({
            family: Joi.string().max(100),
            headingSize: Joi.string().pattern(/^\d+(px|rem|em)$/),
            bodySize: Joi.string().pattern(/^\d+(px|rem|em)$/),
            weight: Joi.string().valid('normal', 'bold', 'light')
        }),
        logo_url: Joi.string().uri().allow(null),
        custom_css: Joi.string().max(5000).allow(null)
    }).optional(),

    // Allowed voters (user IDs)
    allowed_voters: Joi.array().items(Joi.number().integer()).optional()
});

const updatePollSchema = Joi.object({
    title: Joi.string().min(3).max(500),
    description: Joi.string().max(2000).allow(null, ''),
    status: Joi.string().valid(...Object.values(PollStatus)),
    results_visibility: Joi.string().valid(...Object.values(ResultsVisibility)),
    end_time: Joi.date().iso(),
    theme_settings: Joi.object().optional()
}).min(1); // At least one field required

const getPollsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid(...Object.values(PollStatus)).optional(),
    search: Joi.string().max(200).optional(),
    sortBy: Joi.string().valid('created_at', 'title', 'end_time').default('created_at'),
    order: Joi.string().valid('asc', 'desc').default('desc')
});

module.exports = {
    createPollSchema,
    updatePollSchema,
    getPollsSchema
};

// ============================================

// src/validators/vote.validator.js
const Joi = require('joi');

const submitVoteSchema = Joi.object({
    poll_id: Joi.number().integer().required(),
    option_id: Joi.number().integer().required(),
    // For authenticated users
    user_id: Joi.number().integer().optional()
});

module.exports = {
    submitVoteSchema
};

// ============================================

// src/middlewares/validation.js
const { errorResponse } = require('../utils/response');

/**
 * Validation middleware factory
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return errorResponse(res, 'Validation failed', 400, errors);
        }

        // Replace req.body with validated value
        req.body = value;
        next();
    };
};

/**
 * Validate query parameters
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return errorResponse(res, 'Query validation failed', 400, errors);
        }

        req.query = value;
        next();
    };
};

module.exports = {
    validate,
    validateQuery
};