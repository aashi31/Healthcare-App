const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const controller = require('../controllers/analyticsController');

// Admin only analytics
router.get('/appointments', auth, role(['Admin']), controller.getAppointmentStats);
router.get('/top-doctors', auth, role(['Admin']), controller.getTopDoctors);

module.exports = router;
