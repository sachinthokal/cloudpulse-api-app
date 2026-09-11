const request = require('supertest');
const app = require('./app');

describe('CloudPulse API Endpoints', () => {
  it('GET / should return 200 and serve HTML dashboard', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  it('GET /healthz should return 200 and healthy status', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/v1/pulse should return 200 and service metadata', async () => {
    const res = await request(app).get('/api/v1/pulse');
    expect(res.statusCode).toEqual(200);
    expect(res.body.service).toBe('cloudpulse-api');
    expect(res.body.telemetry).toBeDefined();
  });

  it('GET /health should return 200 and UP status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('UP & Running');
  });
});