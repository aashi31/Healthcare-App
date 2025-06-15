const PatientSummary = require('../models/PatientSummary');
const Appointment = require('../models/Appointment');
const PDFDocument = require('pdfkit');

// Doctor: Add patient visit summary
exports.addSummary = async (req, res) => {
  try {
    const { appointmentId, summary, prescriptions, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized or invalid appointment' });
    }

    const newSummary = await PatientSummary.create({
      patient: appointment.patient,
      doctor: appointment.doctor,
      appointment: appointment._id,
      summary,
      prescriptions,
      notes
    });

    res.status(201).json(newSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin/Doctor: View summary of a patient
exports.getPatientSummaries = async (req, res) => {
  try {
    const summaries = await PatientSummary.find({ patient: req.params.patientId }).populate('doctor appointment');
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate PDF report after visit (Doctor only)
exports.downloadReport = async (req, res) => {
  try {
    const summary = await PatientSummary.findById(req.params.id).populate('patient doctor appointment');
    if (!summary || summary.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized or not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=visit-report.pdf');

    doc.pipe(res);
    doc.fontSize(16).text('Post Visit Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Patient: ${summary.patient.name}`);
    doc.text(`Doctor: ${summary.doctor.name}`);
    doc.text(`Date: ${summary.createdAt.toDateString()}`);
    doc.moveDown();

    doc.text(`Summary:\n${summary.summary}`);
    doc.moveDown();
    doc.text(`Prescriptions:\n${summary.prescriptions}`);
    doc.moveDown();
    doc.text(`Doctor's Notes:\n${summary.notes}`);

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
