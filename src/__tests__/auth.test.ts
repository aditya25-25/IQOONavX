import request from 'supertest';
import { app } from '../serverApp';

describe('Auth Endpoints', () => {
  it('GET /api/v1/auth/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('GET /api/v1/auth/me with valid Bearer token should return 200 with user profile', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer mock-token-pilot-007');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data.user).toHaveProperty('id', 'pilot-007');
    expect(res.body.data.user).toHaveProperty('email', 'pilot-007@iqoo-pilot.dev');
  });

  it('POST /api/v1/auth/session with valid token should verify session', async () => {
    const res = await request(app)
      .post('/api/v1/auth/session')
      .set('Authorization', 'Bearer mock-token-pilot-007');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('authenticated', true);
  });

  it('POST /api/v1/auth/logout should return success', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
