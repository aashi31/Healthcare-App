const Appointment = require('../models/Appointment');
const { io } = require('../sockets/appointmentSocket');
const { sendEmail } = require('../utils/emailService');

// Admin: Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({ ...req.body, createdBy: req.user._id });

    // Email & WebSocket Notification
    sendEmail('Appointment Scheduled', 'An appointment has been scheduled.',  user);
    io.to(appointment.doctor.toString()).emit('new_appointment', appointment);

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Update status
exports.updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('patient doctor');

    if (!appointment) return res.status(404).json({ message: 'Not found' });

    io.to(appointment.patient._id.toString()).emit('status_update', appointment.status);
    sendEmail('Appointment Update', `Your appointment status is now ${appointment.status}`,  user);

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Doctor: Add notes
exports.addNotes = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });

    if (appointment.doctor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden' });

    appointment.notes = req.body.notes;
    appointment.status = 'Completed';
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Patient: View history
exports.getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor');
  res.json(appointments);
};
