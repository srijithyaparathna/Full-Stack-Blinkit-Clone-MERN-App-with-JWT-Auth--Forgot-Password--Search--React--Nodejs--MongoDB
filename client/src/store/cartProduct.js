// Importing `createSlice` from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Defining the initial state for the shopping cart
const initialState = {
    cart: [] // An array to store cart items
};

// Creating the cart slice
const cartSlice = createSlice({
    name: "cartItem", // Name of the slice
    initialState: initialState, // Initial state for the slice
    reducers: {
        // Reducer to handle adding items to the cart
        handleAddItemCart: (state, action) => {
            // Updates the cart with the payload
            state.cart = [...action.payload];
        }
    }
});

// Exporting the action to use in components
export const { handleAddItemCart } = cartSlice.actions;

// Exporting the reducer to configure in the store
export default cartSlice.reducer;
