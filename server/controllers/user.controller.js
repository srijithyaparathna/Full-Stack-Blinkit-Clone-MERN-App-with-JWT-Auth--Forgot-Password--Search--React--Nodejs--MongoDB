import sendEmail from "../config/sendEmail.js"; // Utility to send emails
import UserModel from "../models/user.model.js"; // User model for database operations
import bcryptjs from "bcryptjs"; // Library for hashing passwords
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"; // Email template for verifying email
//import generatedAccessToken from '../utils/generatedAccessToken.js'; // Utility to generate JWT access token
import genertedRefreshToken from '../utils/generatedRefreshToken.js'; // Utility to generate JWT refresh token
import uploadImageClodinary from '../utils/uploadImageClodinary.js'; // Utility to upload images to Cloudinary
import generatedOtp from '../utils/generatedOtp.js'; // Utility to generate OTP
//import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'; // Email template for forgot password
import jwt from "jsonwebtoken"; // Library for working with JSON Web Tokens
//import { error, message } from "laravel-mix/src/Log.js";
// Import the dotenv library to manage environment variable
import dotenv from "dotenv";

import generatedAccessToken from "../utils/generatedAccessToken.js";

import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

dotenv.config({ path: "../../.env" }); // Initialize dotenv
/*

1. Key value paire
  cookies stored as a key-value pairs
2.Lifetime
  session cookies : Stored temporaily and deleted when the browse is closed
  persistent cookies: Remain on the users device for a specified duration or until deleted manualy
3. Storeage location
  Cookies are stored in the users browser and sent to the server  with each HTTP request to the domain that set
  Cookie
4. Security Attributes:
  HttpOnly :  Makes the cookies inaccessible to client side java script
  Secure:     Ensure the cookie is sent only over HTTPS
  SameSite:   Controls cross-site cookie behavior to prevent Cross-Site Request Forgery (CSRF) attacks.

    Strict: Cookies are sent only when navigating to the same site.
    Lax: Cookies are sent for most same-site and some cross-site requests (e.g., top-level navigation).
    None: Cookies are sent for all cross-origin requests (requires Secure).

    Uses of Cookies
Session Management:

Track logged-in users (e.g., session tokens).
Example: Online stores use cookies to keep items in a shopping cart.
Personalization:

Store user preferences like language or theme.
Example: theme=dark, language=en.
Tracking:

Track user behavior across sessions for analytics or advertising.
Example: Third-party cookies used by ad networks.

    
*/


// Register new  User
export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body; // extract name email and password for the request

    // check if all required fields are provided
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide email,name and password",
        error: true,
        success: false,
      });
    }
    // check if the email is already registered
    const user = await UserModel.findOne({ email });
    if (user) {
      return response.json({
        message: "Email already registered",
        error: true,
        success: false,
      });
    }

    // Hash the password for security
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // create  a user object to save
    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload); // Create a new user instance
    const save = await newUser.save(); // save user to database

    // Generate a verification email URL
    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    // Send a verification email
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from binkeyit",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    return response.json({
      message: "User registerd successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    // Handel unexpected errors
    return (
      response.status(500),
      json({
        message: error.message || error,
        error: true,
        success: false,
      })
    );
  }
}
// Verify the user`s email
export async function verifyEmailController(request,response) {
  try{
    const {code} = request.body // get the verification code form the request

    // Check if the code corresponds to a valid user
    const user = await UserModel.findOne({_id:code})
    if(!user){
      return response.status(400).json({
        message:"Invalid code",
        error:true,
        success:false,
      });
    }

    //Update user s email verification status 
    await UserModel.updateOne({_id:code},{verify_email:true});

    return response.json({
      message:"Email verified successfully",
      success:true,
      error:false,
    });

    
  }
  catch(error){
    //Handel unexpected errors
    return response.status(500).json({
      message:error.message|| error,
      error:true,
      success:false,
    });
  }
}

// Login a user
export async function loginController(request, response) {
  try {
    const { email, password } = request.body; // extract email and password from the request

    // Check if all fields are provided
    if (!email || !password) {
      return response.status(400).json({
        message: "Provide email and password",
        error: true,
        success: false,
      });
    }

    // Check if the user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    // Ensure the user's account is active
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact Admin",
        error: true,
        success: false,
      });
    }

    // Validate password
    const checkpassword = await bcryptjs.compare(password, user.password);
    if (!checkpassword) {
      return response.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }

    // Generate access and refresh tokens
    const accesstoken = await generatedAccessToken(user._id);
    const refreshToken = await genertedRefreshToken(user._id);

    // Update user last login date
    await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    // Set cookies for access and refresh tokens
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", accesstoken, cookiesOption);
    response.cookie("refreshToken", refreshToken, cookiesOption);

    return response.json({
      message: "Login successful",
      error: false,
      success: true,
      data: {
        accesstoken,
        refreshToken,
      },
    });
  } catch (error) { // Explicitly define the error variable
    // Handle unexpected errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


// Logout controller 
export const logoutController = async (request, response) => {
  try {
    // Get the user ID from the middleware (e.g., after token validation middleware).
    const userId = request.userId;

    // Define cookie options to ensure secure clearing of cookies.
    const cookiesOption = {
      httpOnly: true, // Cookie cannot be accessed via JavaScript (prevents XSS attacks).
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production.
      sameSite: "None", // Allows cross-site cookies (useful for APIs accessed from different domains).
    };

    // Clear the 'accessToken' and 'refreshToken' cookies
    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    // Remove the refresh token from the database for the specific user
    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "", // Emptying the refresh token field for this user
    });

    if (!removeRefreshToken) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Respond with a success message to confirm the logout process
    return response.json({
      message: "Logout successfully", // User is successfully logged out
      error: false, // No error occurred
      success: true, // Operation was successful
    });
  } catch (error) {
    // Handle any unexpected errors during the logout process
    return response.status(500).json({
      message: error.message || "Server error", // Provide the error message
      error: true, // An error occurred
      success: false, // Operation was unsuccessful
    });
  }
};

// upload user avatar 
export async function uploadAvatar(request,response) {
  try{
    // Step 1 : Extract the user ID  from the authentication request
    // userID is being passed through middleware to identify the user making the user making the request 
    const userId = request.userId; // auth middleware
    
    
    // Step 2 : Extract the image file uploaded by the user
    // request.file contains the file data handel by the multer middleware
    const image = request.file; // multer middleware
    console.log("image",image);
    // Step 3: Upload the image to Cloudinary using the custom uploadImageClodinary function
    // The function uploads the image to Cloudinary and returns the uploaded image URL
    const upload = await uploadImageClodinary(image);


    // Step 4 : update the user s profile in the database withe the uploaded avartar URL
    // Find the user by userId and update their avatar field with the URL returned by Cloudinary
    const updateUser = await UserModel.findByIdAndUpdate(userId,{
      avatar:upload.url, // store the cloudinary URL in the avatar field
    })
     

    // Step: 5 Respond to the client with a success message 
    // send back a response confirming the upload with the User ID and avatar URL

    return response.json({
      message : "upload profile", // Message indicating the avatar was uploaded success
      success: true,
      error:false, // Error status 
      // Data with user ID and URL of the uploaded avatar
      data: {
        _id:userId,
        avatar:upload.url,
      },
    });
  }
  catch(error){
    // Step 6:Handel any errors that occur during the process
    // If any error occurs send a response with an error status and message 
    return response.status(500).json({
      message:error.message|| error, // Include the error message in the responce 
      error : true,
      success:false,
    });
  }
  
}



export async function updateUserDetails(request, res) {
  try {
    // Step 1: Get the authenticated user's ID from the middleware
    const userId = request.userId;

    // Step 2: Destructure incoming user details from the request body
    const { name, email, mobile, password } = request.body;

    // Step 3: Initialize a variable for hashed password if the user provides a new password
    let hashPassword = "";

    // Step 4: If a new password is provided, hash it using bcrypt
    if (password) {
      const salt = await bcryptjs.genSalt(10); // Generate a random salt to strengthen the hash
      hashPassword = await bcryptjs.hash(password, salt); // Hash the password
    }

    // Step 5: Update the user's details in the database
    const updateUser = await UserModel.updateOne(
      { _id: userId }, // Identify the user by their unique ID
      {
        ...(name && { name }), // Update the name if provided
        ...(email && { email }), // Update the email if provided
        ...(mobile && { mobile }), // Update the mobile number if provided
        ...(password && { password: hashPassword }) // Update the password only if a new password is provided
      }
    );

    // Step 6: Respond with a success message and the updated details
    return res.json({
      message: "Updated successfully", // Inform the user of a successful update
      error: false, // Indicate no errors occurred
      success: true, // Mark the operation as successful
      data: updateUser // Return the update operation result
    });

  } catch (error) {
    // Step 7: Handle errors during the process and send a meaningful response
    return res.status(500).json({
      message: error.message || error, // Include the error message for debugging
      error: true, // Indicate that an error occurred
      success: false // Mark the operation as unsuccessful
    });
  }
}

// forgotPasswordController: Handles the forgot password request
export async function forgotPasswordController(request, response) {
  try {
      // Step 1: Extract the email from the request body
      const { email } = request.body;

      // Step 2: Check if a user exists with the provided email
      const user = await UserModel.findOne({ email });

      if (!user) {
          // Step 3: If no user is found, return an error response
          return response.status(400).json({
              message: "Email not available", // Inform the user the email isn't registered
              error: true, // Indicate an error occurred
              success: false // Mark the operation as unsuccessful
          });
      }

      // Step 4: Generate an OTP (One-Time Password) for password recovery
      const otp = generatedOtp(); // Generate a random OTP
      const expireTime = new Date() + 60 * 60 * 1000; // Set OTP validity for 1 hour

      // Step 5: Update the user's database record with the OTP and expiry time
      await UserModel.findByIdAndUpdate(user._id, {
          forgot_password_otp: otp, // Store the generated OTP
          forgot_password_expiry: new Date(expireTime).toISOString() // Store the expiry timestamp
      });

      // Step 6: Send an email with the OTP and instructions to the user
      await sendEmail({
          sendTo: email, // Recipient's email address
          subject: "Forgot password from Binkeyit", // Email subject
          html: forgotPasswordTemplate({ // Email body using a pre-designed template
              name: user.name, // Include the user's name in the email
              otp: otp // Include the generated OTP in the email
          })
      });

      // Step 7: Respond with a success message to inform the user
      return response.json({
          message: "Check your email", // Tell the user to check their inbox
          error: false, // Indicate no errors occurred
          success: true // Mark the operation as successful
      });
  } catch (error) {
      // Step 8: Handle errors during the process and send an appropriate response
      return response.status(500).json({
          message: error.message || error, // Include the error message for debugging
          error: true, // Indicate that an error occurred
          success: false // Mark the operation as unsuccessful
      });
  }
}

// Controller function to verify the OTP sent for resetting the password
export async function verifyForgotPasswordOtp(request, response) {
  try {
      // Destructure the required fields from the request body
      const { email, otp } = request.body;

      // STEP 1: Validate input fields
      if (!email || !otp) {
          // If either email or OTP is not provided, respond with an error
          return response.status(400).json({
              message: "Provide required field email, otp.", // User-friendly error message
              error: true, // Indicates an error occurred
              success: false // The operation was unsuccessful
          });
      }

      // STEP 2: Check if the user exists in the database
      const user = await UserModel.findOne({ email }); // Find the user by their email
      if (!user) {
          // If no user is found with the provided email, return an error
          return response.status(400).json({
              message: "Email not available", // Email doesn't exist in the database
              error: true,
              success: false
          });
      }

      // STEP 3: Validate OTP expiration time
      const currentTime = new Date().toISOString(); // Get the current time in ISO format
      if (user.forgot_password_expiry < currentTime) {
          // If the stored OTP has expired, respond with an error
          return response.status(400).json({
              message: "Otp is expired", // Inform the user that the OTP has expired
              error: true,
              success: false
          });
      }

      // STEP 4: Check if the provided OTP matches the stored OTP
      if (otp !== user.forgot_password_otp) {
          // If the OTP does not match, respond with an error
          return response.status(400).json({
              message: "Invalid otp", // Inform the user the OTP is incorrect
              error: true,
              success: false
          });
      }

      // STEP 5: Clear the OTP and its expiry time once it's successfully verified
      const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
          forgot_password_otp: "", // Clear the OTP field in the database
          forgot_password_expiry: "" // Clear the expiry time field
      });

      // STEP 6: Respond with a success message
      return response.json({
          message: "Verify otp successfully", // Inform the user OTP verification is successful
          error: false, // No error occurred
          success: true // Operation was successful
      });

  } catch (error) {
      // Handle any unexpected errors during the OTP verification process
      return response.status(500).json({
          message: error.message || error, // Provide the error details
          error: true, // An error occurred
          success: false // The operation was unsuccessful
      });
  }
}


// Controller function to reset the user's password
export async function resetpassword(request, response) {
  try {
      // Destructure the required fields from the request body
      const { email, newPassword, confirmPassword } = request.body;

      // STEP 1: Validate input fields
      if (!email || !newPassword || !confirmPassword) {
          // If any field is missing, respond with an error
          return response.status(400).json({
              message: "Provide required fields email, newPassword, confirmPassword"
          });
      }

      // STEP 2: Check if the user exists in the database
      const user = await UserModel.findOne({ email });
      if (!user) {
          // If no user is found with the provided email, return an error
          return response.status(400).json({
              message: "Email is not available",
              error: true,
              success: false
          });
      }

      // STEP 3: Validate if the newPassword and confirmPassword match
      if (newPassword !== confirmPassword) {
          // If passwords do not match, respond with an error
          return response.status(400).json({
              message: "newPassword and confirmPassword must be the same.",
              error: true,
              success: false
          });
      }

      // STEP 4: Hash the new password before saving it
      const salt = await bcryptjs.genSalt(10); // Generate a salt for hashing
      const hashPassword = await bcryptjs.hash(newPassword, salt); // Hash the new password

      // STEP 5: Update the user's password in the database
      const update = await UserModel.findOneAndUpdate(user._id, {
          password: hashPassword
      });

      // STEP 6: Respond with a success message
      return response.json({
          message: "Password updated successfully.",
          error: false,
          success: true
      });
  } catch (error) {
      // Handle unexpected errors
      return response.status(500).json({
          message: error.message || error,
          error: true,
          success: false
      });
  }
}

// Controller function to generate a new access token using a refresh token
export async function refreshToken(request, response) {
  try {
      // STEP 1: Extract the refresh token from cookies or headers
      const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]; // [ Bearer token ]

      // Validate the presence of the refresh token
      if (!refreshToken) {
          return response.status(401).json({
              message: "Invalid token",
              error: true,
              success: false
          });
      }

      // STEP 2: Verify the refresh token
      const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

      if (!verifyToken) {
          // If the token is invalid or expired, respond with an error
          return response.status(401).json({
              message: "Token is expired",
              error: true,
              success: false
          });
      }

      // STEP 3: Extract the user ID from the verified token
      const userId = verifyToken?._id;

      // STEP 4: Generate a new access token
      const newAccessToken = await generatedAccessToken(userId);

      // Set options for the HTTP-only cookie
      const cookiesOption = {
          httpOnly: true, // Prevent access via JavaScript
          secure: true, // Ensure secure connections (HTTPS)
          sameSite: "None" // Allow cross-site requests
      };

      // STEP 5: Set the new access token as a cookie in the response
      response.cookie('accessToken', newAccessToken, cookiesOption);

      // STEP 6: Respond with the new access token
      return response.json({
          message: "New Access token generated",
          error: false,
          success: true,
          data: {
              accessToken: newAccessToken
          }
      });
  } catch (error) {
      // Handle unexpected errors
      return response.status(500).json({
          message: error.message || error,
          error: true,
          success: false
      });
  }
}

// Controller function to fetch details of the logged-in user
export async function userDetails(request, response) {
  try {
      // Retrieve the userId from the request object (populated via middleware)
      const userId = request.userId;

      if (!userId) {
          return response.status(400).json({
              message: "User ID is missing",
              error: true,
              success: false,
          });
      }

      // Fetch the user details from the database, excluding sensitive fields
      const user = await UserModel.findById(userId).select('-password -refresh_token');

      if (!user) {
          return response.status(404).json({
              message: "User not found",
              error: true,
              success: false,
          });
      }

      // Respond with the user details
      return response.json({
          message: "User details retrieved successfully",
          data: user,
          error: false,
          success: true,
      });
  } catch (error) {
      // Handle unexpected errors
      return response.status(500).json({
          message: "Something went wrong",
          error: true,
          success: false,
      });
  }
}