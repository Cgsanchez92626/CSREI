// utils/tokenManager.js
import { refreshToken } from './authAPI';
import { logoutUser } from '../features/auth/authSlice'; 
import { store } from '../app/store';

const REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh every 5 minutes

const startTokenRefresh = () => {
  setInterval(async () => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      try {
        await refreshToken();
      } catch (error) {
        // Handle refresh failure (e.g., logout user)
        store.dispatch(logoutUser());
      }
    }
  }, REFRESH_INTERVAL);
};

export default startTokenRefresh;