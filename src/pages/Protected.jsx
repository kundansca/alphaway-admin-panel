import React from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";
import { logout } from '../features/auth/authSlice';
export default function Protected(props) {
    const dispatch=useDispatch();
    const authData=useSelector((state)=>{
        return state.auth;

    });
   if(!authData || !authData.userData){
    return <Navigate to="/login" replace />;
   }
   console.log(authData);
   const expiresDate = new Date(authData.userData.expiresAt.split('.')[0] + "Z");
   const now = new Date();
   
  if (now > expiresDate) {
     dispatch(logout());
    return <Navigate to="/login" replace />; 
  }

    
  return props.children;
  
}
