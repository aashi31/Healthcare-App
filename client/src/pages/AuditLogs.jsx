import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await API.get('/logs/audit');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch audit logs');
      }
    };
    fetchAuditLogs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Audit Trail Logs</h1>
        <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={logout}>Logout</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Action</th>
            <th className="border p-2">Entity</th>
            <th className="border p-2">Performed By</th>
            <th className="border p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.entity}</td>
              <td className="border p-2">{log.performedBy}</td>
              <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
