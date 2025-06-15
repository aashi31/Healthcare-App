# MedMitra Healthcare Management System 🏥

A full-stack Node.js + MongoDB based healthcare app to manage patient appointments, summaries, analytics, real-time updates, and more.

## Features
- Role-based Authentication (Admin, Doctor, Patient)
- Real-Time Updates via WebSocket
- Patient Summary & Visit Reports
- Email Notifications (Nodemailer)
- Analytics (Top Doctors, Appointment Trends)
- Dockerized with MongoDB
- Logging with Winston/Morgan
- Unit Tests (Auth + Appointment)
- Swagger API Documentation

## API Docs
Swagger UI: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Running the App
```bash
docker-compose up --build
