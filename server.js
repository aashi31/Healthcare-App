const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const { initSocket } = require('./sockets/appointmentSocket');

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });
const logRoutes = require('./routes/logs.routes');
app.use('/logs', logRoutes);
