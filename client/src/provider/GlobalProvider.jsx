// Import necessary libraries and modules
import { createContext, useContext, useEffect, useState } from "react"; 
import Axios from "../utils/Axios"; // Axios for API requests
import SummaryApi from "../common/SummaryApi"; // API endpoint configuration
import { useDispatch, useSelector } from "react-redux"; // Redux for state management
import { handleAddItemCart } from "../store/cartProduct"; // Redux action to add items to the cart
import AxiosToastError from "../utils/AxiosToastError"; // Utility for error handling in API calls
import toast from "react-hot-toast"; // Toast for showing notifications
import { pricewithDiscount } from "../utils/PriceWithDiscount"; // Utility for calculating prices after discount
import { handleAddAddress } from "../store/addressSlice"; // Redux action to add address
import { setOrder } from "../store/orderSlice"; // Redux action to set orders

// Create a context to hold global data that will be shared across the app
export const GlobalContext = createContext(null);

// Custom hook to use the GlobalContext in components
export const useGlobalContext = () => useContext(GlobalContext);

// GlobalProvider component that will wrap the app's children and provide the context values
const GlobalProvider = ({children}) => {
    // Dispatch function to dispatch Redux actions
    const dispatch = useDispatch(); 
    
    // State variables to store the total price, total quantity, and other related information
    const [totalPrice, setTotalPrice] = useState(0); 
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0); 
    const [totalQty, setTotalQty] = useState(0); 

    // Accessing Redux state values using selectors
    const cartItem = useSelector(state => state.cartItem.cart); // Cart items in Redux state
    const user = useSelector(state => state?.user); // User information in Redux state

    // Function to fetch cart items from the server
    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getCartItem // Call API to get cart items
            });
            const { data: responseData } = response; // Extract response data
            
            if(responseData.success) {
                // If API call is successful, dispatch Redux action to update the cart
                dispatch(handleAddItemCart(responseData.data));
                console.log(responseData);
            }
        } catch (error) {
            console.log(error); // Log error if the request fails
        }
    };

    // Function to update the quantity of a specific cart item
    const updateCartItem = async (id, qty) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateCartItemQty, // API for updating cart item
                data: { _id: id, qty: qty } // Send updated quantity
            });
            const { data: responseData } = response; // Extract response data
            
            if(responseData.success) {
                fetchCartItem(); // Fetch updated cart items after success
                return responseData; // Return success response
            }
        } catch (error) {
            AxiosToastError(error); // Call the error handling function for Axios errors
            return error; // Return error if the request fails
        }
    };

    // Function to delete a cart item by its ID
    const deleteCartItem = async (cartId) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCartItem, // API for deleting cart item
                data: { _id: cartId } // Send cart ID to delete
            });
            const { data: responseData } = response; // Extract response data
            
            if(responseData.success) {
                toast.success(responseData.message); // Show success toast message
                fetchCartItem(); // Fetch updated cart items after success
            }
        } catch (error) {
            AxiosToastError(error); // Handle error in case of failure
        }
    };

    // `useEffect` hook to calculate total quantity, total price, and price before discount whenever cart items change
    useEffect(() => {
        const qty = cartItem.reduce((prev, curr) => {
            return prev + curr.quantity; // Calculate total quantity
        }, 0);
        setTotalQty(qty); // Update the total quantity state
        
        const tPrice = cartItem.reduce((prev, curr) => {
            const priceAfterDiscount = pricewithDiscount(curr?.productId?.price, curr?.productId?.discount); // Calculate price after discount
            return prev + (priceAfterDiscount * curr.quantity); // Calculate total price
        }, 0);
        setTotalPrice(tPrice); // Update total price state
        
        const notDiscountPrice = cartItem.reduce((prev, curr) => {
            return prev + (curr?.productId?.price * curr.quantity); // Calculate total price without discount
        }, 0);
        setNotDiscountTotalPrice(notDiscountPrice); // Update price before discount state
    }, [cartItem]); // Re-run effect when `cartItem` changes

    // Function to clear the user's local storage and cart items, effectively logging out the user
    const handleLogoutOut = () => {
         localStorage.clear(); // Clear local storage
         dispatch(handleAddItemCart([])); // Clear the cart from Redux state
     };

    // Function to fetch the user's saved address
    const fetchAddress = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getAddress // API to get the address
            });
            const { data: responseData } = response; // Extract response data
            
            if(responseData.success) {
                dispatch(handleAddAddress(responseData.data)); // Dispatch action to store the address in Redux
            }
        } catch (error) {
            // Optionally, handle errors if needed
        }
    };

    // Function to fetch the user's order details
    const fetchOrder = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getOrderItems, // API to get orders
            });
            const { data: responseData } = response; // Extract response data
            
            if(responseData.success) {
                dispatch(setOrder(responseData.data)); // Dispatch action to store orders in Redux
            }
        } catch (error) {
            console.log(error); // Log error if the request fails
        }
    };

    // `useEffect` hook to run the necessary API calls when the user changes
    useEffect(() => {
        fetchCartItem(); // Fetch cart items
      //  handleLogoutOut(); // Clear local storage and cart
        fetchAddress(); // Fetch the user's address
        fetchOrder(); // Fetch the user's order
    }, [user]); // Re-run effect when the `user` changes

    // Provide context values that can be accessed by other components
    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder
        }}>
            {children} {/* Render child components */}
        </GlobalContext.Provider>
    );
};

// Export the GlobalProvider component to be used in the app
export default GlobalProvider;
