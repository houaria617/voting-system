const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// Middlewares
app.use(express.json()); // Parses incoming JSON
app.use(cors());         // Allow frontend communication
app.use(helmet());       // Security headers
app.use(morgan('dev'));  // Logging

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

app.get('/', (req, res) => {
    res.send('Polling System API is running');
});

module.exports = app;