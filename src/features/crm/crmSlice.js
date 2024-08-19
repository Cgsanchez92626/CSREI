import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  contacts: [],
  properties: [],
  selectedContact: null,
  filters: [],
  status: "idle",
  error: null,
};

// Thunks for API calls
export const fetchContacts = createAsyncThunk(
  "crm/fetchContacts",
  async (filter) => {
    const response = await fetch(`/api/crm/contacts?filter=${filter}`);
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }
    return response.json();
  }
);

export const fetchProperties = createAsyncThunk(
  "crm/fetchProperties",
  async (contactId) => {
    const response = await fetch(`/api/crm/properties?contactId=${contactId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }
    return response.json();
  }
);

const crmSlice = createSlice({
  name: "crm",
  initialState,
  reducers: {
    setSelectedContact(state, action) {
      state.selectedContact = action.payload;
    },
    clearSelectedContact(state) {
      state.selectedContact = null;
      state.properties = [];
    },
    // Add additional reducers here for adding, updating, and deleting contacts/properties
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSelectedContact, clearSelectedContact } = crmSlice.actions;
export default crmSlice.reducer;
