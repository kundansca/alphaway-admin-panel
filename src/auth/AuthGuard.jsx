import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// AuthGuard component
const AuthGuard = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authorization');  // Ensure it evaluates to a boolean

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to login
    // return <Navigate to="/login" />;
  }

  return <Outlet />; // If authenticated, render the children (protected route)
};

export default AuthGuard;
