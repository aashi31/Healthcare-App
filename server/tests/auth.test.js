const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return JWT token on successful login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123' // make sure this user exists
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'wrongpass'
      });

    expect(res.statusCode).toBe(401);
  });
});
