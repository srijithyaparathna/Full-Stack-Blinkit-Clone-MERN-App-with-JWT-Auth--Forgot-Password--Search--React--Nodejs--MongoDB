import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux' // Hooks for accessing Redux state and dispatching actions.
import { FaRegUserCircle } from "react-icons/fa"; // Icon for user avatar fallback.
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit'; // Component for editing the user's avatar.
import Axios from '../utils/Axios'; // Axios instance with pre-configured settings.
import SummaryApi from '../common/SummaryApi'; // API endpoints, including the one for updating user details.
import AxiosToastError from '../utils/AxiosToastError'; // Utility function for handling and displaying Axios errors with toast notifications.
import toast from 'react-hot-toast'; // Library for showing notifications.
import { setUserDetails } from '../store/userSlice'; // Redux action to update user details in the store.
import fetchUserDetails from '../utils/fetchUserDetails'; // Utility function to fetch updated user details.

const Profile = () => {
    // Access user data from the Redux store.
    const user = useSelector(state => state.user)

    // State to manage profile editing (name, email, mobile).
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })

    // State to control the avatar editing modal.
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)

    // State to track the loading status of the update request.
    const [loading, setLoading] = useState(false)

    // Dispatch function for updating Redux state.
    const dispatch = useDispatch()

    // Sync userData state with changes in the Redux user state.
    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [user])

    // Update state when form inputs change.
    const handleOnChange = (e) => {
        const { name, value } = e.target // Extract field name and value from the event.

        // Update the corresponding field in `userData`.
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle form submission to update user details.
    const handleSubmit = async (e) => {
        e.preventDefault() // Prevent default form submission behavior.
        
        try {
            setLoading(true) // Show loading indicator.
            
            // Send API request to update user details.
            const response = await Axios({
                ...SummaryApi.updateUserDetails, // API endpoint and method.
                data: userData // Updated user data.
            })

            const { data: responseData } = response

            // If the update is successful, show a success notification and update Redux state.
            if (responseData.success) {
                toast.success(responseData.message) // Display success message.

                // Fetch updated user details and update Redux state.
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }
        } catch (error) {
            // Handle and display errors using the utility function.
            AxiosToastError(error)
        } finally {
            setLoading(false) // Hide loading indicator.
        }
    }

    return (
        <div className='p-4'>
            {/** Profile upload and display image */}
            <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                    user.avatar ? (
                        // Display user avatar if available.
                        <img 
                          alt={user.name}
                          src={user.avatar}
                          className='w-full h-full'
                        />
                    ) : (
                        // Fallback to a user icon if no avatar is set.
                        <FaRegUserCircle size={65} />
                    )
                }
            </div>
            <button 
                onClick={() => setProfileAvatarEdit(true)} // Open the avatar editing modal.
                className='text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3'>
                Edit
            </button>
            
            {
                openProfileAvatarEdit && (
                    // Render the `UserProfileAvatarEdit` component for avatar editing.
                    <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
                )
            }

            {/** Form to update name, mobile, and email */}
            <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
                <div className='grid'>
                    <label>Name</label>
                    <input
                        type='text'
                        placeholder='Enter your name' 
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                        value={userData.name} // Bind input value to `userData.name`.
                        name='name'
                        onChange={handleOnChange} // Update state on input change.
                        required
                    />
                </div>
                <div className='grid'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter your email' 
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                        value={userData.email} // Bind input value to `userData.email`.
                        name='email'
                        onChange={handleOnChange} // Update state on input change.
                        required
                    />
                </div>
                <div className='grid'>
                    <label htmlFor='mobile'>Mobile</label>
                    <input
                        type='text'
                        id='mobile'
                        placeholder='Enter your mobile' 
                        className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                        value={userData.mobile} // Bind input value to `userData.mobile`.
                        name='mobile'
                        onChange={handleOnChange} // Update state on input change.
                        required
                    />
                </div>

                <button 
                    className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded'>
                    {
                        loading ? "Loading..." : "Submit" // Show "Loading..." while the form is submitting.
                    }
                </button>
            </form>
        </div>
    )
}

export default Profile
