import React, { useEffect, useState } from "react";
// Importing necessary React hooks: `useEffect` for side effects and `useState` for state management.

const useMobile = (breakpoint = 768) => {
    // A custom hook named `useMobile` that accepts a `breakpoint` parameter.
    // By default, the breakpoint is set to `768px`, which is a common threshold for mobile devices.

    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    // State `isMobile` determines whether the current screen width is below the specified breakpoint.
    // It is initialized based on the current `window.innerWidth`.

    const handleResize = () => {
        // Function to check the current screen width and update `isMobile` accordingly.
        const checkpoint = window.innerWidth < breakpoint; // True if the screen width is less than the breakpoint.
        setIsMobile(checkpoint); // Update the state with the new value.
    };

    useEffect(() => {
        handleResize(); 
        // Ensure the hook runs the resize logic when it's first initialized.

        window.addEventListener('resize', handleResize);
        // Attach an event listener to the `resize` event on the window.
        // This ensures the `handleResize` function is triggered whenever the window size changes.

        return () => {
            window.removeEventListener('resize', handleResize);
            // Cleanup function to remove the event listener when the component using this hook is unmounted.
            // This avoids potential memory leaks.
        };
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts.

    return [isMobile];
    // The hook returns the `isMobile` state so components using this hook can use it.
};

export default useMobile;
// Exporting the custom hook to use in other parts of the application.


/* 

Responsive Design Logic:

useMobile helps determine if the current device is a mobile device based on screen width.
This allows developers to conditionally render UI elements or apply specific logic for mobile devices.
Reusable Logic:

Instead of duplicating the same resize logic in multiple components, the custom hook encapsulates it in a reusable format.
Real-Time Updates:

The hook listens for window resize events, ensuring the state updates whenever the screen width crosses the breakpoint.
Cleaner Components:

By using this hook, components remain focused on rendering and don't need to manage the resize logic directly.



*/