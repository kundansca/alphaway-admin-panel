// pages/LoginProtected.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const LoginProtected = ({ children }) => {
  const { userData } = useSelector((state) => state.auth);

  if (userData) {
    return <Navigate to="/admin/bookaviewing" replace />;
  }

  return children;
};

export default LoginProtected;
