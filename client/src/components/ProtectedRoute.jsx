import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
