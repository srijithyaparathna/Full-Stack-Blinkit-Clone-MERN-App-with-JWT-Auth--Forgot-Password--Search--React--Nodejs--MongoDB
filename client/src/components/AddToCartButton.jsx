import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider'; // Importing context functions for managing cart items.
import Axios from '../utils/Axios'; // Axios instance for making API calls.
import SummaryApi from '../common/SummaryApi'; // Contains API endpoint configurations.
import toast from 'react-hot-toast'; // For showing notifications.
import AxiosToastError from '../utils/AxiosToastError'; // Utility for handling API errors.
import Loading from './Loading'; // Loading spinner component.
import { useSelector } from 'react-redux'; // To get state from the Redux store.
import { FaMinus, FaPlus } from "react-icons/fa6"; // Icons for plus and minus buttons.

const AddToCartButton = ({ data }) => {
    // Context functions to fetch, update, and delete cart items.
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
    const [loading, setLoading] = useState(false); // Tracks the loading state of the "Add" button.
    const cartItem = useSelector(state => state.cartItem.cart); // Retrieves cart items from the Redux store.
    const [isAvailableCart, setIsAvailableCart] = useState(false); // Tracks whether the item is already in the cart.
    const [qty, setQty] = useState(0); // Tracks the quantity of the item in the cart.
    const [cartItemDetails, setCartItemsDetails] = useState(); // Stores details of the specific cart item.

    // Function to handle adding an item to the cart.
    const handleADDTocart = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior.
        e.stopPropagation(); // Stops the event from bubbling up.

        try {
            setLoading(true); // Sets loading state to true while the API call is in progress.

            // Makes an API call to add the item to the cart.
            const response = await Axios({
                ...SummaryApi.addTocart, // Endpoint configuration from `SummaryApi`.
                data: {
                    productId: data?._id, // Sends the product ID to the API.
                },
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message); // Displays a success notification.
                if (fetchCartItem) {
                    fetchCartItem(); // Refreshes the cart items from the server.
                }
            }
        } catch (error) {
            AxiosToastError(error); // Handles API errors by displaying a toast.
        } finally {
            setLoading(false); // Resets loading state.
        }
    };

    // Effect to check if the item is already in the cart and to retrieve its details.
    useEffect(() => {
        // Checks if the item exists in the cart.
        const checkingitem = cartItem.some(item => item.productId._id === data._id);
        setIsAvailableCart(checkingitem); // Updates the state to indicate the item's availability in the cart.

        // Finds the specific cart item and sets its details and quantity.
        const product = cartItem.find(item => item.productId._id === data._id);
        setQty(product?.quantity); // Updates the quantity.
        setCartItemsDetails(product); // Stores the cart item details.
    }, [data, cartItem]); // Runs whenever `data` or `cartItem` changes.

    // Function to increase the item's quantity in the cart.
    const increaseQty = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const response = await updateCartItem(cartItemDetails?._id, qty + 1); // Updates the cart item quantity by +1.

        if (response.success) {
            toast.success("Item added"); // Displays a success notification.
        }
    };

    // Function to decrease the item's quantity in the cart or remove it if the quantity is 1.
    const decreaseQty = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (qty === 1) {
            // If quantity is 1, deletes the item from the cart.
            deleteCartItem(cartItemDetails?._id);
        } else {
            // Otherwise, decreases the quantity by -1.
            const response = await updateCartItem(cartItemDetails?._id, qty - 1);

            if (response.success) {
                toast.success("Item removed"); // Displays a success notification.
            }
        }
    };

    return (
        <div className='w-full max-w-[150px]'>
            {isAvailableCart ? (
                // If the item is already in the cart, show quantity controls.
                <div className='flex w-full h-full'>
                    <button
                        onClick={decreaseQty}
                        className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'>
                        <FaMinus /> {/* Decrease quantity button */}
                    </button>

                    <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p> {/* Displays current quantity */}

                    <button
                        onClick={increaseQty}
                        className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'>
                        <FaPlus /> {/* Increase quantity button */}
                    </button>
                </div>
            ) : (
                // If the item is not in the cart, show the "Add" button.
                <button
                    onClick={handleADDTocart}
                    className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                    {loading ? <Loading /> : "Add"} {/* Shows "Add" or a loading spinner */}
                </button>
            )}
        </div>
    );
};

export default AddToCartButton;
    
    // In the above code, we have created a new component named  AddToCartButton  that will be used to add items to the cart. This component will display a button to add items to the cart if they are not already in the cart. If the item is already in the cart, it will display the quantity of the item and provide buttons to increase or decrease the quantity. 
    // The component will also make API calls to add, update, or delete items from the cart. 
    // Step 4: Update the ProductCard Component 
    // Now, we will update the  ProductCard  component to use the  AddToCartButton  component.

    /* 
    
    Summary of Functions
handleADDTocart:
        Adds a product to the cart by calling an API endpoint.
        Displays a success or error toast based on the response.
        Refreshes the cart items if successful.

increaseQty:
        Increases the quantity of the product in the cart by updating the server using updateCartItem.
        Shows a success toast if successful.

decreaseQty:
        Decreases the product quantity.
        Removes the product from the cart if the quantity becomes 1.
        Updates the server using updateCartItem or deleteCartItem.

useEffect:

Monitors if the product is in the cart and updates isAvailableCart, qty, and cartItemDetails accordingly.
   
    */