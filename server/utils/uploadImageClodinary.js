import { v2 as cloudinary } from 'cloudinary'; 
// Import the Cloudinary SDK (version 2) for Node.js.
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); // Initialize dotenv
// Configure Cloudinary with credentials from environment variables.
cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME, // Cloudinary account name
    api_key: process.env.CLODINARY_API_KEY,       // API key for authentication
    api_secret: process.env.CLODINARY_API_SECRET_KEY // Secret key for secure access
});

// Define an asynchronous function to upload an image to Cloudinary.
const uploadImageClodinary = async (image) => {
    // Convert the input `image` to a buffer.
    // If `image.buffer` exists (e.g., from a file upload), use it.
    // Otherwise, create a buffer from the image data.
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    // Upload the image to Cloudinary using a stream.
    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "binkeyit" }, // Specify the folder where the image will be stored.
            (error, uploadResult) => {
                // Callback function to handle the result of the upload.
                // If successful, resolve the promise with the upload result.
                return resolve(uploadResult);
            }
        ).end(buffer); // End the stream and send the image data (buffer) to Cloudinary.
    });

    // Return the upload result, which contains information about the uploaded image.
    return uploadImage;
};

// Export the function so it can be used in other parts of the application.
export default uploadImageClodinary;
