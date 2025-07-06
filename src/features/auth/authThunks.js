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
       const status = error.response.status;
      const dataMessage = error.response.data?.message;

        console.log(error);
        if (error?.response?.status === 401) {
            return thunkAPI.rejectWithValue(
           error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } else if (error?.response?.status ===500) {
     
     return thunkAPI.rejectWithValue(
           error.response?.data?.message || 'Oops! Something went wrong.');
  } else {
    return thunkAPI.rejectWithValue(
           error.response?.data?.message || 'Login failed');
  }


    
    }
  }
);
