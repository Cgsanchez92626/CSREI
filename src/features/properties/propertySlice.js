import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
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

const propertySlice = createSlice({
  name: "properties",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default propertySlice.reducer;
