import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async (zipCode) => {
    const url = `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=${zipCode}&status_type=ForSale&home_type=Houses%2C%20Multi-family`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "70fd5d602bmshc18ab45d6a6dedcp199b7cjsn840825fcbc8b",
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    };
    const response = await axios.get(url, options);
    return response.data.props;
  }
);

const listingSlice = createSlice({
  name: "listings",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default listingSlice.reducer;
