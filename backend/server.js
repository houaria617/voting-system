const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

// 1. Load Environment Variables FIRST (Best Practice)
require('dotenv').config();

// 2. Import CORS (This was missing!)
const cors = require('cors'); 

const app = require('./src/app');

// 3. Configure CORS
app.use(cors({
  // Do not put a slash '/' at the end!
  origin: ["https://voting-system-cnn7.onrender.com", "http://localhost:3000", "http://localhost:5173"], 
  credentials: true
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    // These logs help you debug, but remember on Render localhost won't work for you
    console.log(`🔗 Frontend should be on http://localhost:5173`); 
    console.log(`🔗 Backend API: http://localhost:${PORT}/api`);
});