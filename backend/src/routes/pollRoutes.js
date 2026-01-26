const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const voteController = require('../controllers/voteController');
const { authenticate, authorize, optionalAuth } = require('../middlewares/authMiddleware');

// 1. Create Poll (Admin Only)
router.post('/', authenticate, authorize('ADMIN'), pollController.createPoll);

// === 2. DASHBOARD ROUTE (MUST BE BEFORE /:id) ===
router.get('/dashboard', authenticate, pollController.getDashboard);

// 3. Vote Route
router.post('/:pollId/vote', optionalAuth, voteController.submitVote);

// === 4. EDIT ROUTE ===
router.put('/:id', authenticate, pollController.editPoll);

// === 5. DELETE ROUTE ===
router.delete('/:id', authenticate, pollController.deletePoll);

// 6. Get Single (Must be last)
router.get('/:id', optionalAuth, pollController.getPoll);




module.exports = router;