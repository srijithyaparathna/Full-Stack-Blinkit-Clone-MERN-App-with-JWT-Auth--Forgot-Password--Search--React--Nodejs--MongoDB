// Importing `createSlice` from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Defining the initial state for orders
const initialValue = {
    order: [] // An array to store order details
};

// Creating the order slice
const orderSlice = createSlice({
    name: 'order', // Name of the slice
    initialState: initialValue, // Initial state for the slice
    reducers: {
        // Reducer to set order details
        setOrder: (state, action) => {
            // Updates the order array with the payload
            state.order = [...action.payload];
        }
    }
});

// Exporting the action to use in components
export const { setOrder } = orderSlice.actions;

// Exporting the reducer to configure in the store
export default orderSlice.reducer;
