// Import the `jsonwebtoken` library, which is used to create and verify JSON Web Tokens (JWTs)
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); // Initialize dotenv
// Define an asynchronous function `generatedAccessToken` that generates a JWT
// The function accepts a `userId` as a parameter, which will be included in the payload of the token
const generatedAccessToken = async (userId) => {
    // Create a JWT token using the `jwt.sign()` method
    // The payload of the token contains the user's ID (`{ id: userId }`)
    // The secret key (`process.env.SECRET_KEY_ACCESS_TOKEN`) is used to sign the token for security
    // An `expiresIn` option is provided to set the token's expiration time to 5 hours
    const token = await jwt.sign(
        { id: userId }, // Payload: an object containing the user's ID
        process.env.SECRET_KEY_ACCESS_TOKEN, // Secret key for signing the token
        { expiresIn: '5h' } // Token expiration time (5 hours in this case)
    );

    // Return the generated token as the result of the function
    return token;
};

// Export the `generatedAccessToken` function as the default export from this module
// This allows the function to be imported and used in other parts of the application
export default generatedAccessToken;
