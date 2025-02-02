import React, { useEffect, useRef, useState } from 'react'; // Import React, useState, useEffect, and useRef hooks
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"; // Import icons from FontAwesome (currently unused in the code)
import toast from 'react-hot-toast'; // Import toast for user notifications
import Axios from '../utils/Axios'; // Custom Axios instance for API calls
import SummaryApi from '../common/SummaryApi'; // API endpoint configuration
import AxiosToastError from '../utils/AxiosToastError'; // Utility for handling Axios errors with toasts
import { Link, useLocation, useNavigate } from 'react-router-dom'; // React Router utilities for navigation and links

const OtpVerification = () => {
    // State to hold the 6-digit OTP entered by the user
    const [data, setData] = useState(["", "", "", "", "", ""]);

    // Ref array to hold references to each OTP input field
    const inputRef = useRef([]);

    // React Router's navigate function for programmatic navigation
    const navigate = useNavigate();

    // React Router's location object to access route state (e.g., email passed from previous page)
    const location = useLocation();

    console.log("location", location); // Log the location object for debugging

    // Ensure the user has navigated here with a valid email; if not, redirect them to the Forgot Password page
    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password");
        }
    }, []);

    // Check if all OTP input fields have values (form validation)
    const valideValue = data.every(el => el);

    // Handle OTP form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            // Make an API call to verify the OTP
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification, // Spread API endpoint configuration
                data: {
                    otp: data.join(""), // Combine OTP array into a single string
                    email: location?.state?.email // Use the email from route state
                }
            });

            // Handle the API response
            if (response.data.error) {
                toast.error(response.data.message); // Show an error toast if there's an error
            }

            if (response.data.success) {
                toast.success(response.data.message); // Show a success toast if verification is successful
                setData(["", "", "", "", "", ""]); // Reset OTP input fields
                navigate("/reset-password", { // Navigate to Reset Password page
                    state: {
                        data: response.data, // Pass server response data
                        email: location?.state?.email // Pass email from route state
                    }
                });
            }
        } catch (error) {
            console.log('error', error); // Log the error for debugging
            AxiosToastError(error); // Display error using toast
        }
    };

    // Render the component
    return (
        <section className='w-full container mx-auto px-2'> {/* Centered section container */}
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'> {/* Form container */}
                <p className='font-semibold text-lg'>Enter OTP</p> {/* Page title */}
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}> {/* Form element */}
                    <div className='grid gap-1'> {/* OTP input container */}
                        <label htmlFor='otp'>Enter Your OTP :</label> {/* Label for OTP input */}
                        <div className='flex items-center gap-2 justify-between mt-3'> {/* Flex container for OTP inputs */}
                            {
                                // Map through the OTP state array to render input fields
                                data.map((element, index) => {
                                    return (
                                        <input
                                            key={"otp" + index} // Unique key for each input
                                            type='text' // Input type
                                            id='otp' // Input id
                                            ref={(ref) => {
                                                inputRef.current[index] = ref; // Assign each input to the ref array
                                                return ref;
                                            }}
                                            value={data[index]} // Bind value to state
                                            onChange={(e) => {
                                                const value = e.target.value; // Get the value entered in the input
                                                console.log("value", value);

                                                const newData = [...data]; // Create a copy of the data array
                                                newData[index] = value; // Update the specific OTP digit
                                                setData(newData); // Update the state

                                                if (value && index < 5) { // Automatically focus the next input if not the last
                                                    inputRef.current[index + 1].focus();
                                                }
                                            }}
                                            maxLength={1} // Limit each input to 1 character
                                            className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold' // Styling classes
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>

                    {/* Submit button with conditional styling and disable behavior */}
                    <button
                        disabled={!valideValue} // Disable button if form validation fails
                        className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Verify OTP
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

export default OtpVerification; // Export the component as default
