const express = require('express');
const os = require('os');
const path = require('path');

const app = express();

const VERSION = process.env.VERSION || 'v1';
const VERSION_LABEL = process.env.VERSION_LABEL || '1.0.0';
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();
const SERVICE_COLOR = VERSION === 'v1' ? '#3b82f6' : '#f59e0b';
const SERVICE_TYPE = VERSION === 'v1' ? 'stable' : 'canary';
const CONTAINER_ID = os.hostname();

// Per-container request counter
let requestCount = 0;

app.get('/api/info', (req, res) => {
  requestCount++;
  res.json({
    version: VERSION,
    versionLabel: `v${VERSION_LABEL}`,
    buildTime: BUILD_TIME,
    color: SERVICE_COLOR,
    type: SERVICE_TYPE,
    containerId: CONTAINER_ID,
    requestCount,
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    dbPassword: process.env.DB_PASSWORD || 'Not set',
    apiKeys: process.env.API_KEYS || 'Not set',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: VERSION, containerId: CONTAINER_ID });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${SERVICE_TYPE.toUpperCase()}] ${VERSION_LABEL} | Container: ${CONTAINER_ID} | Port: ${PORT}`);
});
