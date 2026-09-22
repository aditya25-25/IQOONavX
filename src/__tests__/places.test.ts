import request from 'supertest';
import { app } from '../app';

describe('Saved Places & Places Search Endpoints', () => {
  const token = 'Bearer mock-token-pilot-001';

  it('GET /api/v1/places without auth should return 401', async () => {
    const res = await request(app).get('/api/v1/places');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/places with valid coordinates should create saved place (201)', async () => {
    const res = await request(app)
      .post('/api/v1/places')
      .set('Authorization', token)
      .send({
        name: 'iQOO Speed Lab',
        latitude: 28.5355,
        longitude: 77.391,
        address: 'Velocity Axis 9',
        category: 'track',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('name', 'iQOO Speed Lab');
    expect(res.body.data).toHaveProperty('id');
  });

  it('POST /api/v1/places with invalid latitude (> 90) should return 422 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/places')
      .set('Authorization', token)
      .send({
        name: 'Invalid Latitude Location',
        latitude: 95.5,
        longitude: 77.391,
      });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('POST /api/v1/places with invalid longitude (> 180) should return 422 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/places')
      .set('Authorization', token)
      .send({
        name: 'Invalid Longitude Location',
        latitude: 28.5,
        longitude: 195.0,
      });

    expect(res.status).toBe(422);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('GET /api/v1/places should return saved places for user', async () => {
    const res = await request(app)
      .get('/api/v1/places')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/places/search?q=esports should return search results', async () => {
    const res = await request(app).get('/api/v1/places/search?q=esports');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
