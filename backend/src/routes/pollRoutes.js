// routes/pollRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth, authorize } = require('../middleware/authMiddleware');
const { createPoll, getPoll, editPoll, deletePoll, getDashboard } = require('../controllers/pollController');
const { submitVote } = require('../controllers/voteController');

// ========================================
// PUBLIC ROUTES (with optional auth)
// ========================================

// Get single poll (public, but detects if user is logged in)
router.get('/:id', optionalAuth, getPoll);

// Submit vote (public, but detects if user is logged in for private polls)
router.post('/:pollId/vote', optionalAuth, submitVote);

// ========================================
// PROTECTED ROUTES (require authentication)
// ========================================

// Create poll (admin/voter can create)
router.post('/', authenticate, createPoll);

// Edit poll (only creator)
router.put('/:id', authenticate, editPoll);

// Delete poll (only creator)
router.delete('/:id', authenticate, deletePoll);

// Get dashboard (user's polls)
router.get('/dashboard/my-polls', authenticate, getDashboard);

module.exports = router;