import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
// import { updateToken, logoutUser } from './store/authSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { faCloudShowersWater } from '@fortawesome/free-solid-svg-icons';

const ActivityTrackerdemo = () => {
  const dispatch = useDispatch();
  const [canTrackIdle,setCanTrackIdle]=useState(true);
//   const { accessToken, expiresAt } = useSelector((state) => state?.authData?.userData);
  let accessToken=null, expiresAt=null;
  const refreshAccessToken = async () => {
    alert("RefreshAccessToken Called");
    try {
      const res = await axios.post('/api/refresh-token', { accessToken });
    //   dispatch(updateToken(res.data)); // contains: accessToken & new expiresAt
      console.log('🔁 Token refreshed');
    } catch (error) {
    //   dispatch(logoutUser());
      console.error('❌ Token refresh failed. Logging out');
    }
  };

  const onIdle = () => {
    alert("ondle function called");
    const now = new Date();
    const expires = new Date(expiresAt);
    const msToExpire = expires - now;

    if (msToExpire <= 6 * 60 * 1000) {
      // agar 7:54 ke baad tak bhi koi activity nahi huyi
      console.log('⚠️ User idle & token about to expire → Logging out');
      dispatch(logoutUser());
    } else {
      console.log('🕒 Idle but not near expiry yet');
    }
  };

  const onActive = () => {
    
    alert("user Active Active function called");
    const now = new Date();
    const expires = new Date(expiresAt);
    const msToExpire = expires - now;

    if (msToExpire <= 6 * 60 * 1000) {
      console.log('✅ User active before expiry → Refreshing token');
      refreshAccessToken();
    } else {
      console.log('👍 User active, but token still valid');
    }
  };

  useIdleTimer({
    timeout:1 * 60 * 1000,
    onIdle,
    onActive,
    onAction:onActive,
    debounce: 500,
    crossTab: true,
    disabled:canTrackIdle
  
  });



  useEffect(() => {
  const initialTimeout = setTimeout(() => {
    setCanTrackIdle(false); // Ab hum idle tracking start karenge
  },10000); // 7h 40min

  return () => clearTimeout(initialTimeout);
}, []);

  return null;
};

export default ActivityTrackerdemo;
