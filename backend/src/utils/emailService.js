const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // This must be the App Password
            },
        });

        const mailOptions = {
            from: `"Voting App Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;

    } catch (error) {
        console.error('Email Service Error:', error);
        throw error; // Throw error so Controller knows it failed
    }
};

module.exports = sendEmail;