// Importing `createSlice` from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Defining the initial state for products
const initialValue = {
    allCategory: [], // Array to store all categories
    loadingCategory: false, // Boolean to track loading state of categories
    allSubCategory: [], // Array to store all subcategories
    product: [] // Array to store product details
};

// Creating the product slice
const productSlice = createSlice({
    name: 'product', // Name of the slice
    initialState: initialValue, // Initial state for the slice
    reducers: {
        // Reducer to set all categories
        setAllCategory: (state, action) => {
            state.allCategory = [...action.payload];
        },
        // Reducer to set loading state for categories
        setLoadingCategory: (state, action) => {
            state.loadingCategory = action.payload;
        },
        // Reducer to set all subcategories
        setAllSubCategory: (state, action) => {
            state.allSubCategory = [...action.payload];
        }
    }
});

// Exporting actions to use in components
export const { setAllCategory, setAllSubCategory, setLoadingCategory } = productSlice.actions;

// Exporting the reducer to configure in the store
export default productSlice.reducer;
