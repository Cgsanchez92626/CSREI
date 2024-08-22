import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContactsApi } from '../../utils/crmAPI';

// Define the initial state
const initialState = {
  contacts: [],
  status: 'idle',
  error: null,
};

// Define the async thunk for fetching contacts
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (filter) => {
  const agentId = localStorage.getItem('agentId');
  if (!agentId) throw new Error('Agent ID is not available in local storage');
  // console.log("filter: ", filter, agentId);
  const contacts = await fetchContactsApi(filter, agentId);
  return contacts;
});

// Create the contacts slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contactSlice.reducer;