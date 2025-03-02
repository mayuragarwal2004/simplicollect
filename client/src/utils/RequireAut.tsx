import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface RequireAuthProps {
  children?: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return Boolean(isAuthenticated) ? (
    children || <Outlet />
  ) : (
    <Navigate to="/auth/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
