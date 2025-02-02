import React, { useState } from 'react';
// Import React and useState for managing component state.

import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
// Import eye icons for toggling password visibility.

import toast from 'react-hot-toast';
// Import `toast` for displaying notifications.

import Axios from '../utils/Axios';
// Import the custom Axios instance for making API requests.

import SummaryApi from '../common/SummaryApi';
// Import the API endpoints configuration.

import AxiosToastError from '../utils/AxiosToastError';
// Import a utility function to handle errors and display them using toast.

import { Link, useNavigate } from 'react-router-dom';
// Import Link for navigation and useNavigate for programmatic navigation.

import fetchUserDetails from '../utils/fetchUserDetails';
// Import a utility to fetch user details after login.

import { useDispatch } from 'react-redux';
// Import useDispatch to dispatch actions to the Redux store.

import { setUserDetails } from '../store/userSlice';
// Import the Redux action for setting user details.

const Login = () => {
    // Define component state for form inputs and password visibility.
    const [data, setData] = useState({
        email: "", // Email field
        password: "" // Password field
    });

    const [showPassword, setShowPassword] = useState(false);
    // State to toggle password visibility.

    const navigate = useNavigate();
    // Hook for navigating programmatically.

    const dispatch = useDispatch();
    // Hook to dispatch actions to the Redux store.

    // Handle input changes for form fields.
    const handleChange = (e) => {
        const { name, value } = e.target; // Get the name and value of the input.

        setData((preve) => {
            return {
                ...preve, // Keep previous state
                [name]: value // Update the changed field
            };
        });
    };

    // Check if all input fields are filled before enabling the login button.
    const valideValue = Object.values(data).every(el => el);

    // Handle form submission for login.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior.

        try {
            // Make an API call to the login endpoint with the user's data.
            const response = await Axios({
                ...SummaryApi.login, // Login API endpoint details (e.g., URL, method).
                data: data // Pass the form data in the request body.
            });

            // If the response contains an error, display an error notification.
            if (response.data.error) {
                toast.error(response.data.message);
            }

            // If the login is successful:
            if (response.data.success) {
                toast.success(response.data.message); // Show success notification.

                // Save the access token and refresh token in local storage.
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                // Fetch the logged-in user's details.
                const userDetails = await fetchUserDetails();

                // Dispatch the user details to the Redux store.
                dispatch(setUserDetails(userDetails.data));

                // Clear the form fields.
                setData({
                    email: "",
                    password: "",
                });

                // Navigate to the home page.
                navigate("/");
            }
        } catch (error) {
            // Handle API errors using a utility function and display a notification.
            AxiosToastError(error);
        }
    };

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                {/* Login form */}
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    {/* Email input field */}
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>

                    {/* Password input field with visibility toggle */}
                    <div className='grid gap-1'>
                        <label htmlFor='password'>Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"} // Toggle input type based on visibility.
                                id='password'
                                className='w-full outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            {/* Password visibility toggle icon */}
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                        {/* Forgot password link */}
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit button */}
                    <button
                        disabled={!valideValue} // Disable button if fields are empty.
                        className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Login
                    </button>
                </form>

                {/* Link to register page */}
                <p>
                    Don't have an account?{" "}
                    <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
// Export the Login component for use in the application.
