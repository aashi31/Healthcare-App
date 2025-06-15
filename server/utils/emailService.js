const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'smtp.ethereal.email' etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send an email to a recipient
 * @param {String} subject
 * @param {String} message
 * @param {Object} user - User object with email & name
 */
const sendEmail = async (subject, message, user) => {
  try {
    if (!user || !user.email) return;

    const mailOptions = {
      from: `"MedMitra Clinic" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject,
      html: `
        <p>Dear ${user.name || 'User'},</p>
        <p>${message}</p>
        <p>Thank you,<br/>MedMitra Clinic</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${user.email}`);
  } catch (error) {
    console.error('Email error:', error.message);
  }
};

module.exports = { sendEmail };
