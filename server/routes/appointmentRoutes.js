const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const controller = require('../controllers/appointmentController');

// Admin
router.post('/', auth, role(['Admin']), controller.createAppointment);
router.put('/:id/status', auth, role(['Admin']), controller.updateStatus);

// Doctor
router.put('/:id/notes', auth, role(['Doctor']), controller.addNotes);

// Patient
router.get('/my', auth, role(['Patient']), controller.getMyAppointments);

module.exports = router;
