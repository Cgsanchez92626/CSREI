import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "../features/listings/listingSlice";
import authReducer from "../features/auth/authSlice";
import contactReducer from "../features/crm/contactSlice";
import propertyReducer from "../features/crm/propertySlice";

export const store = configureStore({
  reducer: {
    listing: listingReducer,
    auth: authReducer,
    contact: contactReducer,
    property: propertyReducer,
  },
});
