const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// 1 step back जाण्यासाठी '..' वापरले आहे:
app.use(express.static(path.join(__dirname, '..', 'public')));

// Root URL (/) वर index.html पाठवणे:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

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
      host_name: process.env.HOSTNAME || require('os').hostname()
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