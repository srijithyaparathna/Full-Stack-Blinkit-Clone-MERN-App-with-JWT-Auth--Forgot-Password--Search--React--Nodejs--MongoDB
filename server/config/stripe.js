import stripe from 'stripe'
import dotenv from "dotenv";
// Load environment variables from the .env file into process file
dotenv.config("../../.env");

const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

export default Stripe