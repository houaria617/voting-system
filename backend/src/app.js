const express = require('express');
const cors = require('cors'); // <--- Ensure this is installed: npm install cors
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// ==================================================================
// 🛑 CORS CONFIGURATION (MUST BE THE FIRST MIDDLEWARE)
// ==================================================================
app.use(cors({
  origin: 'http://localhost:5173', // <--- EXACT URL of your Frontend (No trailing slash)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Required if you are sending cookies or auth headers
}));

// ==================================================================

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

module.exports = app;