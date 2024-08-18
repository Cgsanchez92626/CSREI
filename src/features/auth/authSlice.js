import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      // console.log("Login action dispatched.");

    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
      // console.log("Logout action dispatched.");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;