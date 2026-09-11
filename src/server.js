const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  const timestamp = new Date().toISOString();
  const environment = process.env.NODE_ENV || 'production';

  console.log(
    `[${timestamp}] [STARTUP] CloudPulse Engine active on port ${PORT}`
  );

  console.log(
    `[${timestamp}] [STARTUP] Environment: ${environment}`
  );

  console.log(
    `[${timestamp}] [STARTUP] Health Endpoint: http://${HOST}:${PORT}/health`
  );
});

// Graceful shutdown for Docker and Kubernetes
const handleShutdown = (signal) => {
  console.log(
    `[${new Date().toISOString()}] ` +
    `[SHUTDOWN] Signal ${signal} received. Closing HTTP server...`
  );

  server.close(() => {
    console.log(
      `[${new Date().toISOString()}] ` +
      '[SHUTDOWN] HTTP server closed cleanly. Exiting.'
    );

    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));