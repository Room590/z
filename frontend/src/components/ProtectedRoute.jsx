import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ roles, children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  if (!token || !user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
