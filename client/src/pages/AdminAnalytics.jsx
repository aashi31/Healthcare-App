import { useEffect, useState } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const AdminAnalytics = () => {
  const { logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await API.get('/analytics');
      setAnalytics(res.data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Analytics</h1>
        <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={logout}>Logout</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Appointments</p>
          <p className="text-xl">{analytics.totalAppointments}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Patients</p>
          <p className="text-xl">{analytics.totalPatients}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Doctors</p>
          <p className="text-xl">{analytics.totalDoctors}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">Completed</p>
          <p className="text-xl">{analytics.completedAppointments}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Appointments Per Day</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analytics.appointmentsPerDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminAnalytics;
