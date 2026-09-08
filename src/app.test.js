const request = require('supertest');
const app = require('./app');

describe('CloudPulse API Endpoints', () => {
  it('GET /healthz should return 200 and healthy status', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/v1/pulse should return 200 and service metadata', async () => {
    const res = await request(app).get('/api/v1/pulse');
    expect(res.statusCode).toEqual(200);
    expect(res.body.service).toBe('cloudpulse-api');
  });
});