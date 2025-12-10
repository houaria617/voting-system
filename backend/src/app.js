// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { RateLimits } = require('./config/constants');

// Import routes
const authRoutes = require('./routes/auth.routes');
// const pollRoutes = require('./routes/poll.routes');
// const voteRoutes = require('./routes/vote.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ============================================
// Security Middleware
// ============================================

// Helmet - Set security headers
app.use(helmet());

// CORS - Configure allowed origins
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// ============================================
// Rate Limiting
// ============================================

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: RateLimits.API.windowMs,
    max: RateLimits.API.max,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth-specific rate limiter (stricter)
const authLimiter = rateLimit({
    windowMs: RateLimits.AUTH.windowMs,
    max: RateLimits.AUTH.max,
    message: 'Too many authentication attempts, please try again later',
    skipSuccessfulRequests: true
});

// ============================================
// Body Parsers
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Routes
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
// app.use('/api/polls', apiLimiter, pollRoutes);
// app.use('/api/votes', apiLimiter, voteRoutes);
// app.use('/api/dashboard', apiLimiter, dashboardRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ============================================
// Global Error Handler
// ============================================

app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;

// ============================================
// ============================================