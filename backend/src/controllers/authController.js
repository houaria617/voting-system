// controllers/authController.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const generateToken = require('../utils/jwtGenerator'); // ✅ Default import
const sendEmail = require('../utils/emailService');

// Debug: Check if generateToken is imported correctly
console.log('🔍 generateToken imported as:', typeof generateToken);

// 1. REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        console.log('📝 Register request:', { name, email, role });

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const userExists = await userModel.findUserByEmail(email);
        if (userExists) {
            return res.status(401).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Default to VOTER if invalid role
        const validRole = role === 'ADMIN' ? 'ADMIN' : 'VOTER';
        const newUser = await userModel.createUser(name, email, passwordHash, validRole);

        console.log('✅ User created:', { id: newUser.id, email: newUser.email, role: newUser.role });
        console.log('🔐 Generating token...');
        
        // ✅ Generate token with all required parameters
        const token = generateToken(newUser.id, newUser.email, newUser.role);
        
        console.log('✅ Token generated successfully');
        
        res.status(201).json({ 
            token, 
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error('❌ Register error:', err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// 2. LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔐 Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await userModel.findUserByEmail(email);
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log('✅ User found:', { id: user.id, email: user.email, role: user.role });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log('❌ Password mismatch');
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log('✅ Password verified');
        console.log('🔐 Generating token for:', { id: user.id, email: user.email, role: user.role });
        
        // ✅ Check if generateToken exists before calling
        if (typeof generateToken !== 'function') {
            console.error('❌ generateToken is not a function! Type:', typeof generateToken);
            throw new Error('Token generation function not available');
        }

        // ✅ Generate token with all required parameters
        const token = generateToken(user.id, user.email, user.role);
        
        console.log('✅ Token generated successfully');
        
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// 3. LOGOUT
const logout = async (req, res) => {
    try {
        const token = req.token;
        if (!token) return res.status(400).json({ message: "No token found" });

        await userModel.addToBlacklist(token);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error('❌ Logout error:', err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 4. FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString('hex');
        await userModel.saveResetToken(user.id, resetToken);

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const emailSubject = "Password Reset Request";
        const emailBody = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset</h2>
                <p>Hello ${user.name},</p>
                <p>You requested a password reset. Please click the button below:</p>
                <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>Or copy this link: ${resetLink}</p>
                <p>This link expires in 1 hour.</p>
            </div>
        `;

        await sendEmail(email, emailSubject, emailBody);

        console.log(`✅ Password reset email sent to ${email}`);
        res.json({ message: "Password reset link sent to your email" });

    } catch (err) {
        console.error("❌ Error in forgotPassword:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 5. RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const resetRecord = await userModel.findResetToken(token);
        if (!resetRecord) return res.status(400).json({ message: "Invalid/Expired Token" });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await userModel.updateUserPassword(resetRecord.user_id, passwordHash);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error('❌ Reset password error:', err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
};