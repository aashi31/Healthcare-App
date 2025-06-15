import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState({});

  const fetchAppointments = async () => {
    const res = await API.get(`/appointments/doctor/${user._id}`);
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChange = (id, text) => {
    setNotes(prev => ({ ...prev, [id]: text }));
  };

  const handleSubmitNote = async (apptId, patientId) => {
    await API.post('/summaries', {
      appointmentId: apptId,
      patientId,
      doctorId: user._id,
      notes: notes[apptId],
    });
    await API.put(`/appointments/${apptId}`, { status: 'Completed' });
    fetchAppointments();
  };

  const downloadReport = async (appointmentId) => {
    try {
      const res = await API.get(`/summaries/report/${appointmentId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Visit_Report_${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to download report');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={logout}>Logout</button>
      </div>

      <h2 className="text-lg font-semibold mb-2">My Appointments</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Patient</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Notes / Report</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt._id}>
              <td className="border p-2">{appt.patient?.name}</td>
              <td className="border p-2">{new Date(appt.date).toLocaleString()}</td>
              <td className="border p-2">{appt.status}</td>
              <td className="border p-2">
                {appt.status === 'Scheduled' ? (
                  <div>
                    <textarea
                      placeholder="Add visit notes"
                      className="border p-1 rounded w-full mb-1"
                      onChange={e => handleChange(appt._id, e.target.value)}
                    />
                    <button
                      onClick={() => handleSubmitNote(appt._id, appt.patient?._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => downloadReport(appt._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Download Report
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorDashboard;
