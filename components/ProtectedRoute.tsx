import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowAdmin?: boolean; // true: admin only, false: user only, undefined: both
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowAdmin }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If the route is explicitly for admins only (allowAdmin={true}) and the user is not an admin
  if (allowAdmin === true && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If the route is explicitly for regular users only (allowAdmin={false}) and the user is an admin
  if (allowAdmin === false && isAdmin) {
     return <Navigate to="/admin" replace />;
  }

  // If allowAdmin is undefined, allow both roles
  return <>{children}</>;
};

export default ProtectedRoute;