import React from 'react'
import { useSelector } from 'react-redux' // Importing the `useSelector` hook from Redux to access the state stored in the Redux store.
import isAdmin from '../utils/isAdmin' // Importing a utility function `isAdmin` to check if the user has admin privileges.

const AdminPermision = ({ children }) => {
    // Accessing the `user` data from the Redux store. The `user` object likely contains information about the logged-in user, such as their role.
    const user = useSelector(state => state.user)

    return (
        <>
            {/** 
             * Conditional rendering based on the user's role:
             * - If the `isAdmin` function returns `true` for the user's role, render the `children` prop.
             * - If not, display a message indicating the lack of permission.
             */}
            {
                isAdmin(user.role) 
                    ? children // Render the children components if the user is an admin.
                    : <p className='text-red-600 bg-red-100 p-4'>
                        Do not have permission
                      </p> // Display an error message if the user is not an admin.
            }
        </>
    )
}

export default AdminPermision
