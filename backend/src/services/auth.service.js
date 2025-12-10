// src/services/auth.service.js

const { supabase } = require('../config/supabase');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { UserRole, UserStatus } = require('../config/constants');
const crypto = require('crypto');

class AuthService {
    /**
     * Register a new user
     */
    async register({ name, email, password, role = UserRole.VOTER }) {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Create user
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                name,
                email: email.toLowerCase(),
                password_hash,
                role,
                status: UserStatus.ACTIVE,
                is_verified: false
            })
            .select('id, name, email, role, status, is_verified, created_at')
            .single();

        if (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            userId: user.id
        });

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    /**
     * Login user
     */
    async login(email, password) {
        // Find user by email
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            throw new Error('Invalid email or password');
        }

        // Check if user is banned
        if (user.status === UserStatus.BANNED) {
            throw new Error('Your account has been banned. Please contact support.');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            userId: user.id
        });

        // Remove sensitive data
        delete user.password_hash;

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    /**
     * Request password reset
     */
    async forgotPassword(email) {
        const { data: user } = await supabase
            .from('users')
            .select('id, email, name')
            .eq('email', email.toLowerCase())
            .single();

        if (!user) {
            // Don't reveal if user exists
            return { message: 'If an account exists, a reset link has been sent' };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

        // Save reset token
        await supabase
            .from('users')
            .update({
                reset_token: resetToken,
                reset_token_expires: resetTokenExpires.toISOString()
            })
            .eq('id', user.id);

        // TODO: Send email with reset link
        // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        // await emailService.sendPasswordResetEmail(user.email, resetLink);

        return {
            message: 'Password reset link sent to your email',
            resetToken // Remove this in production, only for testing
        };
    }

    /**
     * Reset password with token
     */
    async resetPassword(token, newPassword) {
        // Find user by reset token
        const { data: user } = await supabase
            .from('users')
            .select('id, reset_token_expires')
            .eq('reset_token', token)
            .single();

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Check if token is expired
        if (new Date(user.reset_token_expires) < new Date()) {
            throw new Error('Reset token has expired');
        }

        // Hash new password
        const password_hash = await hashPassword(newPassword);

        // Update password and clear reset token
        const { error } = await supabase
            .from('users')
            .update({
                password_hash,
                reset_token: null,
                reset_token_expires: null
            })
            .eq('id', user.id);

        if (error) {
            throw new Error('Failed to reset password');
        }

        return { message: 'Password reset successful' };
    }

    /**
     * Verify user account (email verification)
     */
    async verifyAccount(userId) {
        const { error } = await supabase
            .from('users')
            .update({ is_verified: true })
            .eq('id', userId);

        if (error) {
            throw new Error('Failed to verify account');
        }

        return { message: 'Account verified successfully' };
    }

    /**
     * Get user profile
     */
    async getUserProfile(userId) {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role, status, is_verified, created_at')
            .eq('id', userId)
            .single();

        if (error || !user) {
            throw new Error('User not found');
        }

        return user;
    }
}

module.exports = new AuthService();