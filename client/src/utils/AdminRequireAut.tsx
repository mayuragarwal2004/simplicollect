import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminRequireAuth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return Boolean(isAuthenticated) ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/admin-sign-in" state={{ from: location }} replace />
  );
};

export default AdminRequireAuth;
