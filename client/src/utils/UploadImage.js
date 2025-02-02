import Axios from '../utils/Axios';
// Import the configured Axios instance for making HTTP requests.

import SummaryApi from '../common/SummaryApi';
// Import API endpoint configurations.

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        // Create a new FormData object to send file data.
        formData.append('image', image);
        // Append the image file to the FormData object with the key 'image'.

        const response = await Axios({
            ...SummaryApi.uploadImage, // Spread the API endpoint details for image upload (e.g., URL and method).
            data: formData // Include the FormData object as the request payload.
        });

        return response;
        // Return the response if the upload is successful.
    } catch (error) {
        return error;
        // Return the error if the upload fails.
    }
};

export default uploadImage;
// Export the function for use in other parts of the application.
