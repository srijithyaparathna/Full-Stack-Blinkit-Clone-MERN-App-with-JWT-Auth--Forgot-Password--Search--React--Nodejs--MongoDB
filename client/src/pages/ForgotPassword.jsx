import React, { useState } from 'react'; // Import React and useState hook
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"; // Import icons from FontAwesome (currently unused in the code)
import toast from 'react-hot-toast'; // Import toast for notifications
import Axios from '../utils/Axios'; // Custom Axios instance for API calls
import SummaryApi from '../common/SummaryApi'; // API endpoint configuration
import AxiosToastError from '../utils/AxiosToastError'; // Utility for handling Axios errors with toasts
import { Link, useNavigate } from 'react-router-dom'; // React Router utilities for navigation and links

const ForgotPassword = () => {
    // State to hold form data (currently only the email field)
    const [data, setData] = useState({
        email: "",
    });

    // React Router's navigate function to programmatically navigate between routes
    const navigate = useNavigate();

    // Handle changes in the input fields
    const handleChange = (e) => {
        const { name, value } = e.target; // Extract name and value from the event target (input field)

        // Update the state with the new input value
        setData((prev) => ({
            ...prev, // Spread previous state to retain other values
            [name]: value // Update the specific field being changed
        }));
    };

    // Check if all fields have values (used for form validation)
    const valideValue = Object.values(data).every(el => el);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            // Make an API call to the forgot password endpoint
            const response = await Axios({
                ...SummaryApi.forgot_password, // Spread API configuration
                data: data // Attach the form data (email)
            });

            // Handle the API response
            if (response.data.error) {
                toast.error(response.data.message); // Show an error toast if there's an error
            }

            if (response.data.success) {
                toast.success(response.data.message); // Show a success toast if the request is successful
                navigate("/verification-otp", {
                    state: data // Pass the email state to the next route (e.g., for OTP verification)
                });
                // Reset the form data after successful submission
                setData({
                    email: "",
                });
            }
        } catch (error) {
            // Handle errors by displaying a toast message
            AxiosToastError(error);
        }
    };

    // Component rendering
    return (
        <section className='w-full container mx-auto px-2'> {/* Centered section container */}
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'> {/* Form container */}
                <p className='font-semibold text-lg'>Forgot Password </p> {/* Form title */}
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}> {/* Form element */}
                    <div className='grid gap-1'> {/* Input field container */}
                        <label htmlFor='email'>Email :</label> {/* Label for email input */}
                        <input
                            type='email' // Email input type
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200' // Styling classes
                            name='email' // Name attribute to match the state key
                            value={data.email} // Bind value to state
                            onChange={handleChange} // Handle changes in input
                            placeholder='Enter your email' // Placeholder text
                        />
                    </div>
                    {/* Submit button with conditional styling and disable behavior */}
                    <button
                        disabled={!valideValue} // Disable button if form validation fails
                        className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Send Otp
                    </button>
                </form>

                {/* Link to the login page */}
                <p>
                    Already have account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
                </p>
            </div>
        </section>
    );
};

export default ForgotPassword; // Export the component as default
