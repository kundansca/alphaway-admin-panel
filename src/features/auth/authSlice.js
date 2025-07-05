import { createSlice } from '@reduxjs/toolkit';
import { loginAdmin } from './authThunks';
const localData = localStorage.getItem("authData");
const initialState = localData
  ? JSON.parse(localData)
  : {
      loading: false,
      token: null,
      error: null
    };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token =action.payload;

        // ✅ Save full auth state to localStorage
        localStorage.setItem("authData", JSON.stringify(state));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token=null;

        // ✅ Optionally update storage on error too
        localStorage.setItem("authData", JSON.stringify(state));
      });
  }
});

export default authSlice.reducer;