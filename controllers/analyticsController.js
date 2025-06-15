const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Appointments per day (last 7 days)
exports.getAppointmentStats = async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Most active doctors (by number of appointments)
exports.getTopDoctors = async (req, res) => {
  try {
    const topDoctors = await Appointment.aggregate([
      {
        $group: {
          _id: "$doctor",
          totalAppointments: { $sum: 1 }
        }
      },
      {
        $sort: { totalAppointments: -1 }
      },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      {
        $unwind: "$doctorInfo"
      },
      {
        $project: {
          name: "$doctorInfo.name",
          email: "$doctorInfo.email",
          totalAppointments: 1
        }
      }
    ]);
    res.json(topDoctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
