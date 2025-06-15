const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: String,
  entity: String, // "Appointment", "Patient", etc.
  performedBy: String, // email or role
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
