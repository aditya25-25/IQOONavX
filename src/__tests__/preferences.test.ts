import request from 'supertest';
import { app } from '../app';

describe('Navigation Preferences Endpoints', () => {
  const token = 'Bearer mock-token-pilot-001';

  it('GET /api/v1/preferences should return user preferences', async () => {
    const res = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('voice_enabled');
    expect(res.body.data).toHaveProperty('travel_mode');
  });

  it('PUT /api/v1/preferences should update preferences', async () => {
    const res = await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', token)
      .send({
        voice_enabled: false,
        travel_mode: 'two_wheeler',
        speed_unit: 'mph',
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('voice_enabled', false);
    expect(res.body.data).toHaveProperty('travel_mode', 'two_wheeler');
    expect(res.body.data).toHaveProperty('speed_unit', 'mph');
  });

  it('PUT /api/v1/preferences with invalid travel mode should fail with 422', async () => {
    const res = await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', token)
      .send({
        travel_mode: 'spaceship_unsupported_mode',
      });

    expect(res.status).toBe(422);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});
