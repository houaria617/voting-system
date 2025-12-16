const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const voteController = require('../controllers/voteController');
const { authenticate, authorize, optionalAuth } = require('../middlewares/authMiddleware');

router.post('/', authenticate, authorize('ADMIN'), pollController.createPoll);
router.get('/dashboard', authenticate, pollController.getDashboard);
router.post('/:pollId/vote', optionalAuth, voteController.submitVote);
router.put('/:id', authenticate, pollController.editPoll);
router.delete('/:id', authenticate, pollController.deletePoll);  // ← Fixed!
router.get('/:id', optionalAuth, pollController.getPoll);       // Last!


module.exports = router;