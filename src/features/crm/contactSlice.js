import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchContactsApi,
  updateContactApi,
  deleteContactApi,
  addContactApi,
} from "../../utils/crmAPI";

// Define the initial state
const initialState = {
  contacts: [],
  status: "idle",
  error: null,
};

// Define the async thunk for fetching contacts
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (filter) => {
    const agentId = localStorage.getItem("agentId");
    if (!agentId) throw new Error("Agent ID is not available in local storage");
    // console.log("filter: ", filter, agentId);
    const contacts = await fetchContactsApi(filter, agentId);
    return contacts;
  }
);

// Define the async thunk for adding a contact
export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (newContact) => {
    // console.log("newContact: ", newContact);
    const contact = await addContactApi(newContact);
    return contact;
  }
);

// Define the async thunk for updating a contact
export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async (contact) => {
    // console.log("contact: ", contact); // Log the contact object to debug
    const updatedContact = await updateContactApi(contact);
    return updatedContact; // Ensure you return the result to be handled by the slice
  }
);

// Define the async thunk for deleting a contact
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId) => {
    if (!contactId) {
      throw new Error("Invalid contact ID");
    }
    // console.log("contactId: ", contactId);
    await deleteContactApi(contactId);
    return contactId; // Return the contactId after successful deletion
  }
);

// Create the contacts slice
const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(
          (contact) => contact._id === action.payload._id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(deleteContact.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted contact from the state
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.payload
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
