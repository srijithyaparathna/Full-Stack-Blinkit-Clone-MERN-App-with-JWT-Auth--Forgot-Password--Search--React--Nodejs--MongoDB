import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Hooks to interact with Redux store.
import { Link, useNavigate } from 'react-router-dom'; // For routing and navigation.
import Divider from './Divider'; // A component to visually divide sections.
import Axios from '../utils/Axios'; // Axios instance for making API requests.
import SummaryApi from '../common/SummaryApi'; // API endpoint definitions.
import { logout } from '../store/userSlice'; // Redux action to log the user out.
import toast from 'react-hot-toast'; // For displaying toast notifications.
import AxiosToastError from '../utils/AxiosToastError'; // Custom error handler for Axios errors.
import { HiOutlineExternalLink } from "react-icons/hi"; // External link icon.
import isAdmin from '../utils/isAdmin'; // Utility to check if a user has admin privileges.

const UserMenu = ({ close }) => {
    // Redux selector to access the current user data from the store.
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch(); // Redux dispatch to trigger actions.
    const navigate = useNavigate(); // For programmatic navigation.

    // Logout handler to log the user out.
    const handleLogout = async () => {
        try {
            // Make a logout API call.
            const response = await Axios({
                ...SummaryApi.logout, // Logout endpoint and config.
            });

            console.log("logout", response);

            // If the logout API call is successful:
            if (response.data.success) {
                if (close) {
                    close(); // Call the `close` function if provided (used to close the menu).
                }
                dispatch(logout()); // Dispatch the logout action to clear the user state.
                localStorage.clear(); // Clear the localStorage (e.g., tokens).
                toast.success(response.data.message); // Display a success message.
                navigate("/"); // Redirect the user to the home page.
            }
        } catch (error) {
            console.log(error);
            AxiosToastError(error); // Handle errors using a custom error handler.
        }
    };

    // Function to close the menu (if the `close` prop is provided).
    const handleClose = () => {
        if (close) {
            close();
        }
    };

    return (
        <div>
            {/* Displaying account section */}
            <div className='font-semibold'>My Account</div>

            {/* Display user information */}
            <div className='text-sm flex items-center gap-2'>
                <span className='max-w-52 text-ellipsis line-clamp-1'>
                    {user.name || user.mobile} {/* Display user's name or mobile */}
                    <span className='text-medium text-red-600'>
                        {user.role === "ADMIN" ? "(Admin)" : ""} {/* Display "Admin" if user is an admin */}
                    </span>
                </span>

                {/* Link to the user's profile */}
                <Link
                    onClick={handleClose}
                    to={"/dashboard/profile"}
                    className='hover:text-primary-200'>
                    <HiOutlineExternalLink size={15} />
                </Link>
            </div>

            <Divider /> {/* A visual divider */}

            {/* List of menu options */}
            <div className='text-sm grid gap-1'>
                {/* Conditional rendering: Show admin-specific links if the user is an admin */}
                {isAdmin(user.role) && (
                    <Link
                        onClick={handleClose}
                        to={"/dashboard/category"}
                        className='px-2 hover:bg-orange-200 py-1'>
                        Category
                    </Link>
                )}

                {isAdmin(user.role) && (
                    <Link
                        onClick={handleClose}
                        to={"/dashboard/subcategory"}
                        className='px-2 hover:bg-orange-200 py-1'>
                        Sub Category
                    </Link>
                )}

                {isAdmin(user.role) && (
                    <Link
                        onClick={handleClose}
                        to={"/dashboard/upload-product"}
                        className='px-2 hover:bg-orange-200 py-1'>
                        Upload Product
                    </Link>
                )}

                {isAdmin(user.role) && (
                    <Link
                        onClick={handleClose}
                        to={"/dashboard/product"}
                        className='px-2 hover:bg-orange-200 py-1'>
                        Product
                    </Link>
                )}

                {/* Common options for all users */}
                <Link
                    onClick={handleClose}
                    to={"/dashboard/myorders"}
                    className='px-2 hover:bg-orange-200 py-1'>
                    My Orders
                </Link>

                <Link
                    onClick={handleClose}
                    to={"/dashboard/address"}
                    className='px-2 hover:bg-orange-200 py-1'>
                    Save Address
                </Link>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className='text-left px-2 hover:bg-orange-200 py-1'>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserMenu;


/* 
this code defines a React Functional component called userMenu it serves as a user account menu
with options for managing account information, navigating to admin-specific pages (if the user is an admin), and logging out.


Redux integration:
    - The useSelector hook fetches the current users data from the Redux store.
    - The useDispatch hook is allows dispatching actions such as to update the Redux store
  
Conditional Rendering for Admin:
    - The isAdmin(user.role) utility function checks if the user has admin privileges.
    - Admin-only links like category, subcategory are displayed conditionally

Logout logic:
    - Makes an API call to log the user out.
    - if successful, it clears local storage,updates the Redux store by dispatching logout display a 
      success toast and navigates the user to the home page.

Menu closure:
    - The close function passed as a prop is used to close the menu when a link or button is clicked.

UI Components:
    - Divider: A visual divider component used to separate sections in the menu.
    - Link: A component from react-router-dom used to navigate to different pages.
    - HiOutlineExternalLink: An icon from react-icons/hi used to indicate an external link.



*/