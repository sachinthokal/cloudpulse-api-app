const express = require('express');
const app = express();

app.use(express.json());
const unusedVariable = "this will break eslint"; // Unused

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/api/v1/pulse', (req, res) => {
  res.status(200).json({
    service: 'cloudpulse-api',
    version: process.env.APP_VERSION || '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;