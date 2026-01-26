const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();

const app = require('./src/app'); // app.js handles the CORS now

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});