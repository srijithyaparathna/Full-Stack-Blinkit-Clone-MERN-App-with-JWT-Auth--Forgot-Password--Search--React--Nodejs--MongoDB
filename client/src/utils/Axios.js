import axios from "axios";
// Import Axios for making HTTP requests.

import SummaryApi, { baseURL } from "../common/SummaryApi";
// Import API endpoint configurations and the base URL.

const Axios = axios.create({
    baseURL: baseURL, // Set the base URL for all Axios requests.
    withCredentials: true // Allow cookies to be sent with cross-origin requests.
});

// Add an interceptor to include the access token in the headers of every request.
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accesstoken'); // Retrieve access token from local storage.

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Add the token to the Authorization header.
        }

        return config; // Return the modified config.
    },
    (error) => {
        return Promise.reject(error); // Handle errors in the request interceptor.
    }
);

// Add another interceptor to handle token refresh when access token expires.
Axios.interceptors.response.use(
    (response) => {
        return response; // Return the response if it's successful.
    },
    async (error) => {
        let originRequest = error.config; // Store the original request configuration.

        // Check if the error is due to an expired access token and the request hasn't already been retried.
        if (error.response.status === 401 && !originRequest.retry) {
            originRequest.retry = true; // Mark the request as retried to prevent infinite loops.

            const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the refresh token from local storage.

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken); // Attempt to refresh the access token.

                if (newAccessToken) {
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Attach the new access token to the request.
                    return Axios(originRequest); // Retry the original request with the new token.
                }
            }
        }

        return Promise.reject(error); // Reject the promise if the error can't be resolved.
    }
);

// Function to refresh the access token using the refresh token.
const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken, // Use the API endpoint for refreshing tokens.
            headers: {
                Authorization: `Bearer ${refreshToken}` // Include the refresh token in the request headers.
            }
        });

        const accessToken = response.data.data.accessToken; // Extract the new access token from the response.
        localStorage.setItem('accesstoken', accessToken); // Save the new access token to local storage.
        return accessToken; // Return the new access token.
    } catch (error) {
        console.log(error); // Log any errors that occur during the token refresh process.
    }
};

export default Axios;
// Export the configured Axios instance for use throughout the application.


/* 

Step 1 : configure Axios instance
    create a custom Axios instance 
        A Custom Axios instance (Axios) is create with a baseURL and credentials
        withcredentials:true

        This ensures all API request made with this instance will use the same configuration

Step 2 : Request interceptor(Axios.interceptors.request.use)
    What it Does
        Before every API request this interceptor run automatically
        it retrives the access token from the browser localstorage.
        the access token is added to the requests Authorization header as a Bearer token
    purpose
        Ensures that every request catrries the access token require for authentication 
    Steps in Code:
        Get the access token from localStorage
                const accessToken = localStorage.getItem('accesstoken');
    If the token exists, add it to the request header:

                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
    Return the updated request configuration (config).

Step 3 : Make an API Call
    when an API request is sent using the Axios instance it include the Authentication header
    with the access token 

Step 4 : Server Responce 
    if the request is Valid
        The server validates the access token
        if the token is valid the server processes the request and sends back a responce 
    if the Access Token is Expired
        The server responds with a 401 Unauthorized error

Step 5 : Response interceptor
    What it Does
        intercepts  every server responce
        Checks if the responce contains a 401 unautherized stauts indicating an expire access 
        token
    Steps in Code:
        Check if the response status is 401 and if the request has not been retried:

            if (error.response.status === 401 && !originRequest.retry) {
            Mark the request as retried to avoid infinite loops:
            originRequest.retry = true;


Step 6 : Refresh the Access Token 
    what happens
        The refreshAcessToken function is called to request a new token token using the refresh
        token
    Step is Code:
        retrive the refresh token from localStoreage:
        const refreshToken = localStorage.getItem('refreshToken');
    Send a request to the token refresh endpoint:
                        const response = await Axios({
                    ...SummaryApi.refreshToken,
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    },
                });
    Extract and store the new access token:
            const accessToken = response.data.data.accessToken;
        localStorage.setItem('accesstoken', accessToken);
Step 7: Retry the Original Request
    What Happens:

            After receiving the new access token:
            The Authorization header of the original request is updated with the new token:

    Ensures the user doesn’t experience disruptions due to an expired token.



End-to-End Flow
A user makes an API request.
The request interceptor adds the access token to the header.
If the token is valid:
The request succeeds, and the response is returned.
If the token is expired:
The response interceptor catches the 401 error.
The refreshAccessToken function gets a new access token using the refresh token.
The original request is retried with the new access token.
If the token refresh fails:
The user is logged out or shown an error message.
This process ensures secure, uninterrupted interactions between the client and server.









    
*/


