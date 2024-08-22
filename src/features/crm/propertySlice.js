import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPropertiesApi } from '../../utils/crmAPI';

// Define the initial state
const initialState = {
  properties: [],
  status: 'idle',
  error: null,
  selectedContact: null,
};

// Define the async thunk for fetching properties
export const fetchProperties = createAsyncThunk('properties/fetchProperties', async (contactId) => {
  const properties = await fetchPropertiesApi(contactId);
  return properties;
});

// Create the properties slice
const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSelectedContact(state, action) {
      state.selectedContact = action.payload;
    },
    clearSelectedContact(state) {
      state.selectedContact = null;
      state.properties = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSelectedContact, clearSelectedContact } = propertySlice.actions;
export default propertySlice.reducer;