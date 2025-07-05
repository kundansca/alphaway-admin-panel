import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle logout logic
    function handleLogout() {
      // Remove authentication data (e.g., JWT token) from localStorage or sessionStorage
      localStorage.removeItem('auth'); // Clear the token

      // Optionally, clear any other user data if needed (e.g., user profile)
      // localStorage.removeItem('userProfile');

      // Redirect to the login page or home page after logout
      navigate('/login');
    }

    handleLogout();
  }, [navigate]);

  // Optionally, render a simple message while redirecting
  return <div>Logging out...</div>;
}

export default Logout;
