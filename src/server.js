const app = require('./app');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[\({new Date().toISOString()}] [STARTUP] CloudPulse Engine active on port\){PORT}`);
  console.log(`[\({new Date().toISOString()}] [STARTUP] Environment:\){process.env.NODE_ENV || 'production'}`);
  console.log(`[\({new Date().toISOString()}] [STARTUP] Health Endpoint: http://0.0.0.0:\){PORT}/health`);
});

// Container Graceful Shutdown (Docker & Kubernetes SIGTERM/SIGINT handling)
const handleShutdown = (signal) => {
  console.log(`[\({new Date().toISOString()}] [SHUTDOWN] Signal\){signal} received. Closing HTTP server...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] [SHUTDOWN] HTTP server closed cleanly. Exiting.`);
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));