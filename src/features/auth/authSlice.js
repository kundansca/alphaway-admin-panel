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
   reducers: {
      logout: (state) => {
     state.loading = false;
      state.token = null;
      state.error = null;
      state.userData = null;
      localStorage.removeItem("authData");
    },
     updateToken: (state, action) => {
      const { accessToken, expiresAt } = action.payload;
      if (state.userData) {
        state.userData.accessToken = accessToken;
        state.userData.expiresAt = expiresAt;

        localStorage.setItem("authData", JSON.stringify(state));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
    
        state.userData =action.payload;

        localStorage.setItem("authData", JSON.stringify(state));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userData=null;

        localStorage.setItem("authData", JSON.stringify(state));
      });
  }
});

export default authSlice.reducer;
export const { logout,updateToken } = authSlice.actions;