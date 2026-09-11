const express = require('express');
const path = require('path');
const os = require('os');

const app = express();

app.use(express.json());

// Clean Structured Logging Middleware (Zero npm dependencies)
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[\({new Date().toISOString()}] [HTTP]\){req.method} \({req.originalUrl}\){res.statusCode} - ${duration}ms`);
  });
  next();
});

// Serve UI: index.html आपोआप रूट ('/') वर सर्व्ह होते
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP & Running', timestamp: new Date() });
});

app.get('/api/v1/pulse', (req, res) => {
  res.status(200).json({
    service: 'cloudpulse-api',
    version: process.env.APP_VERSION || '1.1.0',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    telemetry: {
      uptime_seconds: Math.floor(process.uptime()),
      memory_usage_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      node_version: process.version
    },
    cloud_metadata: {
      provider: process.env.CLOUD_PROVIDER || 'azure',
      region: process.env.CLOUD_REGION || 'centralindia',
      host_name: process.env.HOSTNAME || os.hostname()
    },
    k8s_metadata: {
      pod_name: process.env.POD_NAME || null,
      pod_namespace: process.env.POD_NAMESPACE || null,
      pod_ip: process.env.POD_IP || null,
      node_name: process.env.NODE_NAME || null
    }
  });
});

module.exports = app;