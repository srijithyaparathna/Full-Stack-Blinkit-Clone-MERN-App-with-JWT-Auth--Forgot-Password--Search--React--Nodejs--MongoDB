/*
Purpose
The auth middleware is responsible for user authentication in a Node.js application. It ensures that:

The user provides a valid access token (from cookies or headers).
The token is verified using the server’s secret key.
If the token is valid, the user's ID is extracted from it and added to the request object for use in subsequent routes.
If the token is missing or invalid, the middleware responds with an error.


*/

// Key steps to login 
/*
1.Retrive the Token
    * The middleware attempts to retrive access token
        form cookies request.cookies.accessToken
        from Authorization header request.headers.authorization
            Token in the header tipicaly sent as bear <token> the split("") extracts 
            the token after the word "Bearer"

    * Check if Token Exists
        if no token is provided it returs a 401 unauthorized response with the message like 
        "Provided token" this ensures that only autherized users can proceed 

    * Verify the Token
        the token is verify using the jwt.verify() methode
        decode contains the payload data(e.g userID) embedded in the token if verification is sucessfull


    * Attach User ID to Request
        once the token is verified the id (UserID) from the decoded token is added to request.userID
        This allows subsequent middleware or route handlers to access the user’s ID and perform actions 
        specific to that user

    * Call next()
        If everything is successful, the next() function is called to pass
        control to the next middleware or the actual route handler.

    * Error Handling
        Any unexpected errors (e.g., invalid token structure, issues with jwt.verify) are caught in the catch block.
        A 500 Internal Server Error response is sent with a generic message like "You have not logged in".
    

*/

import { json, request, response } from 'express';
import jwt from 'jsonwebtoken'; // Import the JSON web token (JWT) library for token operater
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); // Initialize dotenv
import NextAuth from 'next-auth';

const auth = async (request,response,next) => { 
try{
    // setup retrive the token from cookies or headers get accessTOken to the compare 
    const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

    // If the token is not provided, return a 401 unauthorized response
    if(!token){
        return response.status(401).json({
            message:"Provide token"
        })
    }

    // step 2 : verify the token using the servers secret key
    // jwt.verify decodes the token and ensures it is valid

    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

    console.log('decode',decode);
    // if the token cannot be verified respond with an error
    if(!decode){
        return response.status(401).json({
            message:"Unauthorized acess", // token is invalid
            error:true,
            success:false
        });
    }

    // Step 3  : Extract the user ID from the decoded token
    // This allows subsequent routes to know which user is making the request 
    request.userId = decode.id;
    // step 4 call next to pass control to the next middleware  or route handler

    next();

}
catch{
    // handel unexpected errors

    return response.status(500).json({
        message:"You have not logged in", // Error message for failed authentication
        error:true,
        success:false
    });


}




}
export default auth; // Export the middleware for use in other parts the application