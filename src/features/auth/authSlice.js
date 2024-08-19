import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as loginUserApi } from '../../utils/authAPI';

// Define the initial state
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
  token: null,
  status: 'idle',
  error: null,
};

// Define the async thunk for login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
  const data = await loginUserApi(credentials);
  return data.token; // Return the token from the API
});

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload;
        state.status = 'succeeded';
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('authToken', action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;