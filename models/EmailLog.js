const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  to: String,
  subject: String,
  type: String, // 'Scheduled' | 'Cancelled'
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
