// src/routes/poll.routes.js
const express = require('express');
const router = express.Router();
const pollController = require('../controllers/poll.controller');
const { validateCreatePoll, validateUpdatePoll } = require('../middlewares/validation');
// If you have auth middleware, use it here: const { requireAuth } = require('../middlewares/auth');

router.post('/', /* requireAuth, */ validateCreatePoll, pollController.createPoll);
router.put('/:id', /* requireAuth, */ validateUpdatePoll, pollController.updatePoll);
router.patch('/:id/publish', /* requireAuth, */ pollController.publishPoll);
router.get('/:id', /* optional */ pollController.getPollById);

module.exports = router;
