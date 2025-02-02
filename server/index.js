// Importing required models 
import express, { request, response } from 'express'; //  Framework to build the server
import cors from 'cors' // Enable Cross-Origin Resource sharing
import dotenv from 'dotenv' // Loads environment variables form .env file
dotenv.config({path:'../.env'}); // Initialize dotenv 
import cookieParser from 'cookie-parser'; // parses cookies for the application
import morgan from 'morgan'; // log HTTP requests 
import helmet from 'helmet' // Enhance security by setting up various HTTP headers
import connectDB from './config/connectDB.js';


 
 import userRouter from './route/user.route.js'; // User-related routes
 import categoryRouter from './route/category.route.js'; // Category-related routes
 import uploadRouter from './route/upload.router.js'; // File upload-related routes
 import subCategoryRouter from './route/subCategory.route.js'; // Subcategory-related routes
 import productRouter from './route/product.route.js'; // Product-related routes
 import cartRouter from './route/cart.route.js'; // Cart-related routes
 import addressRouter from './route/address.route.js'; // Address-related routes
 import orderRouter from './route/order.route.js'; // Order-related routes
 

// Initialize the Express application
const app = express();

// Middleware for enabling CORS
app.use(cors({
    credentials:true, // Allow cookies to be sent along with requests
    origin:process.env.FRONTEND_URL // restict to the frontend URL specified in the environment
}));



// Middleware to parse incoming JSON requests
app.use(express.json());

//Middleware to parse cookies in incoming requests 
app.use(cookieParser());

//Middleware for logging HTTP requests in development
app.use(morgan('dev'));

//Middleware to enhance application security
app.use(helmet({
    crossOriginOpenerPolicy:false //Disables cross-origin resource policy to allow images from different origins
}));

const PORT = process.env.PORT || 8080

app.get("/",(request,response)=>{
    // Server response for the root endpoint

    response.json({
        message:"server is runing on" + PORT
    })
})


connectDB();

app.listen(PORT,()=>{
    console.log("server is running on ",PORT);
})


// API route handlers
 app.use('/api/user', userRouter); // Routes for user-related operations (e.g., login, register)
 app.use("/api/category", categoryRouter); // Routes for category management
 app.use("/api/file", uploadRouter); // Routes for file uploads
 app.use("/api/subcategory", subCategoryRouter); // Routes for subcategory management
 app.use("/api/product", productRouter); // Routes for product management
 app.use("/api/cart", cartRouter); // Routes for cart operations
 app.use("/api/address", addressRouter); // Routes for address management
 app.use('/api/order', orderRouter); // Routes for order management



// for image upload part use the cloudinary