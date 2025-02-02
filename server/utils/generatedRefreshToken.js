// Import the UserModel to interact with the database
import UserModel from "../models/user.model.js";

// Import the `jsonwebtoken` library to create JSON Web Tokens (JWT)
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); // Initialize dotenv
// Define an asynchronous function to generate a refresh token for a user
const genertedRefreshToken = async(userId) => {
    // Step 1: Generate a refresh token using the `jsonwebtoken` library
    // The `sign` method creates a token with the payload (user ID), secret key, and expiry time
    const token = await jwt.sign(
        { id: userId }, // Payload: an object containing the user's ID
        process.env.SECRET_KEY_REFRESH_TOKEN, // Secret key for signing the token (from environment variables)
        { expiresIn: '7d' } // Expiry time: the token will expire in 7 days
    );

    // Step 2: Save the generated refresh token to the user's database record
    const updateRefreshTokenUser = await UserModel.updateOne(
        { _id: userId }, // Find the user by their unique `_id`
        {
            refresh_token: token, // Update the `refresh_token` field with the newly generated token
        }
    );

    // Step 3: Return the generated refresh token
    return token;
};

// Export the function so it can be imported and used in other files
export default genertedRefreshToken;
