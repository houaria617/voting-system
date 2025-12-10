// middleware/validation.js
const Joi = require('joi');

/**
 * 1. Generic Schema Validator
 * Usage: validate(schema, 'body') or validate(schema, 'query')
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        // Get the data to validate (req.body, req.query, or req.params)
        const data = req[property];

        // Joi validation options
        const options = {
            abortEarly: false, // Include all errors, not just the first one
            stripUnknown: true, // Remove fields that are not in the schema
        };

        const { error, value } = schema.validate(data, options);

        if (error) {
            // Create a simplified error message
            const errorMessage = error.details
                .map((detail) => detail.message.replace(/"/g, ''))
                .join(', ');

            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: errorMessage,
            });
        }

        // Replace req.body with the validated (and cleaned) value
        req[property] = value;
        next();
    };
};

/**
 * 2. File Upload Validator
 * Uses configuration from your .env file
 */
const validateFile = (req, res, next) => {
    // Check if file exists (Multer usually puts file in req.file)
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Parse constraints from .env
    const maxSizeBytes = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // Default 5MB
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',');

    // Check File Size
    if (req.file.size > maxSizeBytes) {
        return res.status(400).json({
            success: false,
            message: `File too large. Maximum size is ${maxSizeBytes / 1024 / 1024}MB`,
        });
    }

    // Check Mime Type
    if (allowedTypes.length > 0 && !allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        });
    }

    next();
};

module.exports = {
    validate,
    validateFile,
    Joi, // Export Joi so we can define schemas in other files
};