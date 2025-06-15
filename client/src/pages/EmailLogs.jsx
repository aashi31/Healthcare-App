import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmailLogs = () => {
  const [logs, setLogs] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/logs/emails');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch email logs');
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Email Notification Logs</h1>
        <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={logout}>Logout</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">To</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td className="border p-2">{log.to}</td>
              <td className="border p-2">{log.subject}</td>
              <td className="border p-2">{log.type}</td>
              <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailLogs;
