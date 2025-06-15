const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const EmailLog = require('../models/EmailLog');

// GET /logs/emails
router.get('/emails', verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching email logs' });
  }
});

module.exports = router;

const AuditLog = require('../models/AuditLog');

router.get('/audit', verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});
