import request from 'supertest';
import { app } from '../serverApp';

describe('Navigation & Recent Routes Endpoints', () => {
  const token = 'Bearer mock-token-pilot-001';

  it('POST /api/v1/navigation/route should calculate route with alternatives and steps', async () => {
    const res = await request(app)
      .post('/api/v1/navigation/route')
      .send({
        origin: { latitude: 28.4595, longitude: 77.0266 },
        destination: { latitude: 28.5355, longitude: 77.391 },
        travelMode: 'driving',
        monsterOptimization: true,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('primaryRoute');
    expect(res.body.data.primaryRoute).toHaveProperty('polyline');
    expect(res.body.data.primaryRoute).toHaveProperty('steps');
    expect(Array.isArray(res.body.data.primaryRoute.steps)).toBe(true);
    expect(res.body.data.primaryRoute.steps.length).toBeGreaterThan(0);
    expect(res.body.data).toHaveProperty('alternatives');
  });

  it('POST /api/v1/navigation/route with invalid origin coordinates should fail with 422', async () => {
    const res = await request(app)
      .post('/api/v1/navigation/route')
      .send({
        origin: { latitude: 120.0, longitude: 77.0266 }, // invalid lat > 90
        destination: { latitude: 28.5355, longitude: 77.391 },
      });

    expect(res.status).toBe(422);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('POST /api/v1/routes/recent should record recent trip (201)', async () => {
    const res = await request(app)
      .post('/api/v1/routes/recent')
      .set('Authorization', token)
      .send({
        source_name: 'Apex Cyber Heights',
        destination_name: 'iQOO Esports Arena',
        distance: 14.2,
        duration: 18,
        travel_mode: 'driving',
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('source_name', 'Apex Cyber Heights');
  });

  it('POST /api/v1/routes/recent with negative distance should return 422', async () => {
    const res = await request(app)
      .post('/api/v1/routes/recent')
      .set('Authorization', token)
      .send({
        source_name: 'A',
        destination_name: 'B',
        distance: -5,
        duration: 10,
      });

    expect(res.status).toBe(422);
  });
});
