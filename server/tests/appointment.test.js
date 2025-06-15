const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

describe('Appointment API', () => {
  let token;
  let patientId;
  let doctorId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Create dummy patient and doctor
    const patient = await User.create({ name: 'Test Patient', email: 'pat@test.com', password: '123', role: 'Patient' });
    const doctor = await User.create({ name: 'Test Doctor', email: 'doc@test.com', password: '123', role: 'Doctor' });

    patientId = patient._id;
    doctorId = doctor._id;

    // Create admin and token
    const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'Admin' });
    token = jwt.sign({ id: admin._id, role: 'Admin' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await Appointment.deleteMany();
    await User.deleteMany();
    await mongoose.disconnect();
  });

  it('should create a new appointment', async () => {
    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patientId,
        doctorId,
        date: new Date(),
        status: 'Scheduled'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('appointment');
    expect(res.body.appointment.status).toBe('Scheduled');
  });
});
