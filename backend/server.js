const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Frontend should be on http://localhost:5173`);
    console.log(`🔗 Backend API: http://localhost:${PORT}/api`);
});