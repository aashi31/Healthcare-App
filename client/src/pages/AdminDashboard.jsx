import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '' });

  const fetchAll = async () => {
    const [apptRes, patRes, docRes] = await Promise.all([
      API.get('/appointments'),
      API.get('/users?role=Patient'),
      API.get('/users?role=Doctor'),
    ]);
    setAppointments(apptRes.data);
    setPatients(patRes.data);
    setDoctors(docRes.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const scheduleAppointment = async e => {
    e.preventDefault();
    await API.post('/appointments', form);
    setForm({ patientId: '', doctorId: '', date: '' });
    fetchAll();
  };

  const cancelAppointment = async id => {
    await API.put(`/appointments/${id}`, { status: 'Cancelled' });
    fetchAll();
  };

  const completeAppointment = async id => {
    await API.put(`/appointments/${id}`, { status: 'Completed' });
    fetchAll();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={logout}>Logout</button>
      </div>

      <form onSubmit={scheduleAppointment} className="mb-6 bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Schedule Appointment</h2>
        <div className="flex gap-2">
          <select name="patientId" value={form.patientId} onChange={handleChange} className="border p-1 rounded">
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <select name="doctorId" value={form.doctorId} onChange={handleChange} className="border p-1 rounded">
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-1 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Schedule</button>
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-2">All Appointments</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Patient</th>
            <th className="border p-2">Doctor</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt._id}>
              <td className="border p-2">{appt.patient?.name}</td>
              <td className="border p-2">{appt.doctor?.name}</td>
              <td className="border p-2">{new Date(appt.date).toLocaleString()}</td>
              <td className="border p-2">{appt.status}</td>
              <td className="border p-2">
                {appt.status === 'Scheduled' && (
                  <>
                    <button onClick={() => completeAppointment(appt._id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                      Complete
                    </button>
                    <button onClick={() => cancelAppointment(appt._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
