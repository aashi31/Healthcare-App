import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [socket, setSocket] = useState(null);

  const fetchAppointments = async () => {
    const res = await API.get(`/appointments/patient/${user._id}`);
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
    const newSocket = io('http://localhost:5000'); // adjust if deployed
    newSocket.emit('register', { userId: user._id, role: 'Patient' });

    newSocket.on('appointment-update', ({ appointmentId, status }) => {
      setAppointments(prev =>
        prev.map(a =>
          a._id === appointmentId ? { ...a, status } : a
        )
      );
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

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
      alert('Report not available.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={logout}>Logout</button>
      </div>

      <h2 className="text-lg font-semibold mb-2">My Appointments</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Doctor</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Report</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt._id}>
              <td className="border p-2">{appt.doctor?.name}</td>
              <td className="border p-2">{new Date(appt.date).toLocaleString()}</td>
              <td className="border p-2">
                <span className={
                  appt.status === 'Scheduled' ? 'text-blue-600' :
                  appt.status === 'Completed' ? 'text-green-600' :
                  'text-red-600'
                }>
                  {appt.status}
                </span>
              </td>
              <td className="border p-2">
                {appt.status === 'Completed' && (
                  <button
                    onClick={() => downloadReport(appt._id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
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

export default PatientDashboard;
