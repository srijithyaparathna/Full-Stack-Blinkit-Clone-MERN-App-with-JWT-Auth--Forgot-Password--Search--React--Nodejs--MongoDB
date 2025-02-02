import React, { useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'; // Import icons for showing/hiding passwords
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import hooks for routing and navigation
import SummaryApi from '../common/SummaryApi'; // Import API endpoints configuration
import toast from 'react-hot-toast'; // Import toast for displaying notifications
import AxiosToastError from '../utils/AxiosToastError'; // Custom utility to handle Axios errors with toast
import Axios from '../utils/Axios'; // Axios instance for making HTTP requests

const ResetPassword = () => {
  const location = useLocation(); // React Router hook to access location state
  const navigate = useNavigate(); // React Router hook for navigation
  const [data, setData] = useState({
    email: "",            // Stores user's email
    newPassword: "",      // Stores the new password
    confirmPassword: "",  // Stores the confirmation password
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility of the new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle visibility of the confirm password

  // Validate if all input fields are filled
  const valideValue = Object.values(data).every(el => el);

  useEffect(() => {
    // Redirect to homepage if the "success" flag is missing in location state
    if (!(location?.state?.data?.success)) {
      navigate("/");
    }

    // Pre-fill email if it exists in location state
    if (location?.state?.email) {
      setData(prev => ({
        ...prev,
        email: location?.state?.email,
      }));
    }
  }, []); // Runs only once on component mount

  // Handles input changes and updates state dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Debugging/logging current data state
  console.log("data reset password", data);

  // Handles form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must be the same.");
      return;
    }

    try {
      // Make an API request using Axios
      const response = await Axios({
        ...SummaryApi.resetPassword, // Use resetPassword API endpoint
        data: data,                 // Send form data
      });

      // Handle API errors and success
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message); // Notify success
        navigate("/login"); // Redirect to login page
        // Reset form data after successful submission
        setData({
          email: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      AxiosToastError(error); // Display Axios error using toast
    }
  };

  // Render reset password form
  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p className='font-semibold text-lg'>Enter Your Password </p>
        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div className='grid gap-1'>
            <label htmlFor='newPassword'>New Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                id='password'
                className='w-full outline-none'
                name='newPassword'
                value={data.newPassword}
                onChange={handleChange}
                placeholder='Enter your new password'
              />
              <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />} {/* Show/Hide Password Icon */}
              </div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className='grid gap-1'>
            <label htmlFor='confirmPassword'>Confirm Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                id='password'
                className='w-full outline-none'
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder='Enter your confirm password'
              />
              <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer'>
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />} {/* Show/Hide Password Icon */}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={!valideValue} 
            className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Change Password
          </button>
        </form>

        {/* Link to Login Page */}
        <p>
          Already have an account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
