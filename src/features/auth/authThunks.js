import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, thunkAPI) => {
    const BASE_URL = import.meta.env.VITE_APP_BASE_API_URL;
    console.log(BASE_URL);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,{email,password} 
        
      );
      

      return response.data
    } catch (error) {
      let message = 'An unexpected error occurred. Please try again.';

      // Handle server response errors
      if (error.response) {
       console.error(error);

      // Optional: Default message
      let message = 'An unexpected error occurred. Please try again.';

      // Handle server response errors
      if (error.response) {
        const status = error.response.status;
        const dataMessage = error.response.data?.message;

        if (status === 401) {
          message = dataMessage || 'Incorrect email or password. Please try again.';
        } else if (status === 403) {
          message = dataMessage || 'You do not have permission to log in.';
        } else if (status === 404) {
          message = dataMessage || 'Login endpoint not found.';
        } else if (status === 500) {
          message = dataMessage || 'Server error. Please try again later.';
        } else {
          message = dataMessage || `Login failed with status code ${status}.`;
        }
      } else if (error.request) {
        // Network error or no response from server
        message = 'Unable to connect to the server. Please check your internet connection.';
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
  }
);
