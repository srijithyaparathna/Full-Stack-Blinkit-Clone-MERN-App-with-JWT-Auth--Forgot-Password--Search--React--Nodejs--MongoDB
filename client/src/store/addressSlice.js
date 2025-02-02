// Importing `createSlice` from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Defining the initial state for addresses
const initialValue = {
    addressList: [] // An array to store a list of addresses
};

// Creating the address slice
const addressSlice = createSlice({
    name: 'address', // Name of the slice
    initialState: initialValue, // Initial state for the slice
    reducers: {
        // Reducer to handle adding addresses
        handleAddAddress: (state, action) => {
            // Updates the address list with the payload
            state.addressList = [...action.payload];
        }
    }
});

// Exporting the action to use in components
export const { handleAddAddress } = addressSlice.actions;

// Exporting the reducer to configure in the store
export default addressSlice.reducer;
