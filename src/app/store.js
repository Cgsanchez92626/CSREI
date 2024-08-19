import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from '../features/properties/propertySlice';
import authReducer from '../features/auth/authSlice';
import crmReducer from '../features/crm/crmSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    auth: authReducer,
    crm: crmReducer,
  },
});