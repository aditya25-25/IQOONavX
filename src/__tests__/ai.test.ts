import request from 'supertest';
import { app } from '../app';

describe('AI Navigation Assistant & Geocoding Endpoints', () => {
  it('POST /api/v1/ai/navigation-assistant should return AI response payload', async () => {
    const res = await request(app)
      .post('/api/v1/ai/navigation-assistant')
      .send({
        destination: 'iQOO Monster Esports Arena',
        travelMode: 'driving',
        routeSummary: {
          distance: '12.8 km',
          duration: '14 mins',
          trafficCondition: 'smooth',
        },
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('available');
    expect(res.body.data).toHaveProperty('assistantReply');
  });

  it('POST /api/v1/ai/navigation-assistant with missing destination should fail with 422', async () => {
    const res = await request(app)
      .post('/api/v1/ai/navigation-assistant')
      .send({});

    expect(res.status).toBe(422);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('GET /api/v1/geocode?address=Cyber+City should return geocoded coordinates', async () => {
    const res = await request(app).get('/api/v1/geocode?address=Cyber+City');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('location');
    expect(res.body.data.location).toHaveProperty('latitude');
    expect(res.body.data.location).toHaveProperty('longitude');
  });

  it('GET /api/v1/geocode/reverse-geocode?lat=28.5355&lng=77.3910 should return address', async () => {
    const res = await request(app).get('/api/v1/geocode/reverse-geocode?lat=28.5355&lng=77.3910');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('formattedAddress');
  });
});
