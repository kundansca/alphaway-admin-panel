import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { logout, updateToken } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const ActivityTracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Idle tracking allow/disallow toggle
  const [canTrackIdle, setCanTrackIdle] = useState(true);

  // Getting token and expiry time from Redux store
  const { accessToken, expiresAt } = useSelector((state) => state.auth.userData);

  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(
        `${BASEURL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update new token in Redux store
      dispatch(updateToken(res.data));
    } catch (error) {
      // If refresh fails, log the user out and redirect to login
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  // Called when user becomes idle
  const onIdle = () => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const msToExpire = expires - now;

    // If token will expire in 5 mins or already expired, logout
    if (msToExpire <= 5 * 60 * 1000) {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  // Called when user becomes active or performs an action
  const onActive = () => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const msToExpire = expires - now;

    if (msToExpire > 0 && msToExpire <= 5 * 60 * 1000) {
      // If token is about to expire in 5 mins, refresh it
      refreshAccessToken();
    } else if (msToExpire <= 0) {
      // If token already expired, logout
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  // Initialize idle timer
  useIdleTimer({
    timeout: 10 * 60 * 1000,     // 10 mins inactivity triggers onIdle
    onIdle,
    onActive,
    onAction: onActive,
    debounce: 500,
    crossTab: true,              // Track idle across tabs
  });

  return null; // No UI element rendered
};

export default ActivityTracker;
