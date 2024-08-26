import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser as loginUserApi, refreshToken as refreshTokenApi  } from "../../utils/authAPI";

// Define the initial state
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  token: localStorage.getItem("authToken") || null,
  agentId: localStorage.getItem("agentId") || null,
  status: "idle",
  error: null,
};

// Define the async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials) => {
    const data = await loginUserApi(credentials);
    return data; // Return the token and _id from the API
  }
);

// Define the async thunk for token refresh
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async () => {
    const data = await refreshTokenApi();
    return data;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // Perform any async operations if needed
  // For now, just clear local storage and reset state
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authToken");
  localStorage.removeItem("agentId");
  localStorage.removeItem("contact");
  localStorage.removeItem("property");
  localStorage.removeItem("listing")
  return {}; // No payload needed for logout
});

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.agentId = action.payload._id;
        state.status = "succeeded";
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("agentId", action.payload._id);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.token = null;
        state.agentId = null;
        state.status = "idle";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
      });
  },
});

export default authSlice.reducer;
