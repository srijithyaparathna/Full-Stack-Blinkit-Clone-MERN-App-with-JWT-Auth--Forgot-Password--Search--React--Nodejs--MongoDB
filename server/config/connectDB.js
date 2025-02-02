// Import the Mongoose library for MongoDB interactions
import mongoose from "mongoose";

// Import the dotenv library to manage environment variable
import dotenv  from "dotenv"

// Load environment variables from the .env file into process.env
dotenv.config({path:'../.env'}); // Initialize dotenv 


// check if the MONGODB_URI environment variable is define
if(!process.env.MONGODB_URI){
    // if not defined throw an error to prevent the application from running without a database URI 
    throw new Error(
        "Please Provide MONGODB_URI in the .env file"
    );
}

/* 
* Asynchronous function to connect the mongodb database using mongoose.
* It attempts to establish a connection and logs the status.
* If the connection fails, it logs the error and exist the process. 

*/


async function connectDB() {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGODB_URI, {
            // Optional Mongoose connection options can be added here
            useNewUrlParser: true,            // Use the new URL parser (deprecated in newer versions)
            useUnifiedTopology: true,         // Use the new Server Discover and Monitoring engine
            // useCreateIndex: true,          // Deprecated in Mongoose 6
            // useFindAndModify: false        // Deprecated in Mongoose 6
        });

        // Log a success message upon successful connection
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        // If an error occurs during connection, log the error details
        console.error("MongoDB connection error:", error);

        // Exit the process with a failure code (1) to indicate an error
        process.exit(1);
    }
}

// Export the connectDB function as the default export of this module
export default connectDB;