import React from 'react'
import UserMenu from '../components/UserMenu' // Importing the UserMenu component for rendering user-specific menu options.
import { Outlet } from 'react-router-dom' // Outlet is used to render nested routes in the current route structure.
import { useSelector } from 'react-redux' // useSelector is a hook from Redux to access the state stored in the Redux store.

const Dashboard = () => {
  // Accessing the `user` data from the Redux store using the `useSelector` hook.
  const user = useSelector(state => state.user)

  // Logging the `user` data for debugging or verification purposes.
  console.log("user dashboard", user)

  return (
    <section className='bg-white'>
        {/** The outermost section of the dashboard, styled with a white background */}
        <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr]'>
            {/** A container that uses a CSS grid layout with two columns:
                 - The first column (250px wide) is for the user menu.
                 - The second column (flexible width) is for the main content.
            */}
                
            {/** Left side for the user menu */}
            <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
                {/** Styling:
                     - `py-4`: Adds vertical padding.
                     - `sticky`: Keeps the menu fixed at the top of the viewport when scrolling.
                     - `top-24`: Keeps the menu 24px below the top edge of the viewport.
                     - `max-h-[calc(100vh-96px)]`: Ensures the menu height adjusts dynamically to the available space (subtracting 96px).
                     - `overflow-y-auto`: Adds vertical scrolling if the menu content exceeds the available height.
                     - `hidden lg:block`: Hides the menu on smaller screens (`lg:block` shows it on large screens and above).
                     - `border-r`: Adds a right border to visually separate the menu from the content.
                */}
                <UserMenu/>
                {/** Rendering the `UserMenu` component to display navigation options for the user */}
            </div>

            {/** Right side for the main content */}
            <div className='bg-white min-h-[75vh]'>
                {/** Styling:
                     - `bg-white`: Ensures the background color is white.
                     - `min-h-[75vh]`: Sets a minimum height of 75% of the viewport height to maintain a consistent layout.
                */}
                <Outlet/>
                {/** The `Outlet` component is used here to render nested routes dynamically.
                     - Any child route defined under this route in `react-router-dom` will render its content here.
                */}
            </div>
        </div>
    </section>
  )
}

export default Dashboard
/*

Logic and functionality:
    purpose 
        the Dashboard component acts as a layout for a user dashboard page.
        it divides the page into two sections: a user menu on the left and dynamic 

    Dynamic content Rendering:
        the outlet component allows nested routes to inject their content into this layout For
        example, if you define a child route under the dashboard route its component will appear
        inside this section

    User Menu:
        the UserMenu component is rendered on the left side of the dashboard layout it contains
        navigation links and options for the user to interact with the application

    Redux State Access:
        the user data is accessed from the Redux store using the useSelector hook from react-redux
        this allows the component to access the user state and display user-specific information













*/
