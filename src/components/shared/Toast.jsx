// Toast.js
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Function to trigger toasts
export const Notify = (message, type = "success") => {
  if (type === "error") {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  } else if (type === "info") {
    toast.info(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } else if (type === "warning") {
    toast.warning(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  } else {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  }
};

// Shared ToastContainer component
const Toast = () => {
  return <ToastContainer />;
};

export default Toast;
