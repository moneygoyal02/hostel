import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('warden' | 'chiefWarden' | 'student')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if the user has the required role
  if (roles && !roles.includes(userInfo.role)) {
    // Redirect to dashboard or homepage based on authentication status
    return <Navigate to={userInfo ? '/dashboard' : '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 