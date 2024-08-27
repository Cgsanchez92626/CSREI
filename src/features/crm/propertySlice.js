import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPropertiesApi, addPropertyApi } from "../../utils/crmAPI";

// Define the initial state
const initialState = {
  properties: [],
  status: "idle",
  error: null,
  selectedContact: null,
};

// Define the async thunk for fetching properties
export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async (contactId) => {
    // console.log("contactId: ", contactId);
    const properties = await fetchPropertiesApi(contactId);
    // console.log("Fetched properties: ", properties);
    return properties;
  }
);

// Define the async thunk for adding a Property
export const addProperty = createAsyncThunk(
  "contacts/addProperty",
  async (newProperty) => {
    console.log("newProperty: ", newProperty);
    const property = await addPropertyApi(newProperty);
    return property;
  }
);

// Create the properties slice
const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setSelectedContact(state, action) {
      state.selectedContact = action.payload;
    },
    clearProperties(state) {
      state.properties = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.properties.push(action.payload);
      });
  },
});

export const {
  setSelectedContact,
  clearProperties,
} = propertySlice.actions;
export default propertySlice.reducer;
