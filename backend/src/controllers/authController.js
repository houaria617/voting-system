const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const generateToken = require('../utils/jwtGenerator');
const sendEmail = require('../utils/emailService');

// 1. REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
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

        const token = generateToken(newUser.id, newUser.role);
        res.status(201).json({ token, user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid Credential" });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credential" });
        }
        const token = generateToken(user.id, user.role);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
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
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 4. FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check if user exists
        const user = await userModel.findUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Generate and Save Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        await userModel.saveResetToken(user.id, resetToken);

        // 3. Prepare Email Content
        // Note: In a real app, this URL points to your Frontend (e.g., localhost:3000)
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const emailSubject = "Password Reset Request";
        const emailBody = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset</h2>
                <p>Hello ${user.name},</p>
                <p>You requested a password reset. Please click the button below to verify your email:</p>
                <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>Or copy this link: ${resetLink}</p>
                <p>This link expires in 1 hour.</p>
            </div>
        `;

        // 4. Send Email
        await sendEmail(email, emailSubject, emailBody);

        console.log(`✅ Email sent to ${email}`);
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
        console.error(err);
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