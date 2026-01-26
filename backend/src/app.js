const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// FIXED CORS CONFIGURATION
const corsOptions = {
  // We use an array to allow multiple origins
  origin: [
    "https://voting-system-cnn7.onrender.com", // Your Deployed Frontend (CRITICAL)
    "http://localhost:5173",                   // Your Local Frontend
    "http://localhost:3000"                    // Backup Local
  ],
  credentials: true,
  optionsSuccessStatus: 200 // 200 is often safer than 204 for some browsers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

app.get('/', (req, res) => {
    res.send('Polling System API is running');
});

module.exports = app;