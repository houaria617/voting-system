// server.js

require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/supabase');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('Failed to connect to database. Exiting...');
            process.exit(1);
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════╗
║   🚀 Polling System API Server        ║
║                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}      ║
║   Port: ${PORT}                        ║
║   URL: http://localhost:${PORT}         ║
║                                        ║
║   Health Check: /health                ║
║   API Docs: /api/docs (coming soon)    ║
╚════════════════════════════════════════╝
      `);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Start the server
startServer();
