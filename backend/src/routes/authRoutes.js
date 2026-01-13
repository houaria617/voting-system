const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. IMPORT MIDDLEWARE CORRECTLY
// We must use { } because authMiddleware.js exports an object
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// 2. USE 'authenticate' (Not verifyToken)
router.post('/logout', authenticate, authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;