// src/controllers/auth.controller.js

const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
    /**
     * @route   POST /api/auth/register
     * @desc    Register a new user
     * @access  Public
     */
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;

            const result = await authService.register({
                name,
                email,
                password,
                role
            });

            return successResponse(
                res,
                result,
                'Registration successful',
                201
            );
        } catch (error) {
            return errorResponse(res, error.message, 400);
        }
    }

    /**
     * @route   POST /api/auth/login
     * @desc    Login user
     * @access  Public
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);

            return successResponse(res, result, 'Login successful');
        } catch (error) {
            return errorResponse(res, error.message, 401);
        }
    }

    /**
     * @route   POST /api/auth/forgot-password
     * @desc    Request password reset
     * @access  Public
     */
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const result = await authService.forgotPassword(email);

            return successResponse(res, result);
        } catch (error) {
            return errorResponse(res, error.message, 400);
        }
    }

    /**
     * @route   POST /api/auth/reset-password
     * @desc    Reset password with token
     * @access  Public
     */
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            const result = await authService.resetPassword(token, newPassword);

            return successResponse(res, result);
        } catch (error) {
            return errorResponse(res, error.message, 400);
        }
    }

    /**
     * @route   GET /api/auth/me
     * @desc    Get current user profile
     * @access  Private
     */
    async getProfile(req, res) {
        try {
            const userId = req.user.userId;

            const user = await authService.getUserProfile(userId);

            return successResponse(res, { user });
        } catch (error) {
            return errorResponse(res, error.message, 404);
        }
    }

    /**
     * @route   POST /api/auth/logout
     * @desc    Logout user (client-side token removal)
     * @access  Private
     */
    async logout(req, res) {
        // In JWT, logout is handled client-side by removing the token
        // Optionally, implement token blacklisting here
        return successResponse(res, null, 'Logged out successfully');
    }
}

module.exports = new AuthController();