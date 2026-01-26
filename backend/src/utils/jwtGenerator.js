const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user_id, role) => {
    const payload = {
        user: {
            id: user_id,
            role: role
        }
    };

    // Token expires in 1 hour
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;