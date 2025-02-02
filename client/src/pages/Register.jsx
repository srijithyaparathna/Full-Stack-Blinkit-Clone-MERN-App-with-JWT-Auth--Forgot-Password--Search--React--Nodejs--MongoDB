import React, { useState } from 'react';
// Import React and useState for managing component state.

import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
// Import icons for toggling password visibility.

import toast from 'react-hot-toast';
// Import toast notifications for success/error messages.

import Axios from '../utils/Axios';
// Axios instance for API requests.

import SummaryApi from '../common/SummaryApi';
// Import API endpoint configurations.

import AxiosToastError from '../utils/AxiosToastError';
// Import utility function for handling Axios errors and displaying toasts.

import { Link, useNavigate } from 'react-router-dom';
// Import utilities from React Router for navigation and linking.

const Register = () => {

//state to manage form input values
const[data,setData] = useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
})

// State to manage visibility of password and confirm password fields
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// Use navigation hook to redirect to another page
const navigate = useNavigate();

    // Update form field values on user input
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the state with new values while preserving existing ones
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //Check if all input fields have values (validation)
    const valideValue = Object.values(data).every(el => el)


  // Handle form submission 
  const handleSubmit = async (e) => { 
    e.preventDefault(); // prevent default form subbmission behavior 

    // check if all password and confirm password match
    if(data.password !== data.confirmPassword){
        toast.error('Password and confirm password do not match');
        return;
    }


    try {

        // sent API request to register user
        const response = await Axios({
            ...SummaryApi.register,
            data:data
        })

        //Handel the response
        if(response.data.error){
            toast.error(response.data.message);
        }

        //
        if(response.data.success){
           // Reset form data after successfull registration
           setData({
            name:'',
            email:'',
            password:'',
            confirmPassword:''
            
           })
           console.log(response.data.message);
           // Redirect to login page
              navigate('/login');

    }
  

    }   

    catch (error) {
      
        AxiosToastError(error); // Handle and display Axios errors.
    }







  }

  return (
    <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p>Welcome to Binkeyit</p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name :</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                    </div>
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
                    <div className='grid gap-1'>
                        <label htmlFor='password'>Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword'>Confirm Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                            />
                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500" }    text-white py-2 rounded font-semibold my-3 tracking-wide`}>Register</button>

                </form>

                <p>
                    Already have account ? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
                </p>
            </div>
        </section>
  )










}

export default Register