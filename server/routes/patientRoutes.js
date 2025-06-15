const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const controller = require('../controllers/patientController');

// Doctor adds summary
router.post('/summary', auth, role(['Doctor']), controller.addSummary);

// Doctor/Admin views summaries of a patient
router.get('/summary/:patientId', auth, role(['Admin', 'Doctor']), controller.getPatientSummaries);

// Doctor generates post-visit report
router.get('/summary/report/:id', auth, role(['Doctor']), controller.downloadReport);

module.exports = router;
