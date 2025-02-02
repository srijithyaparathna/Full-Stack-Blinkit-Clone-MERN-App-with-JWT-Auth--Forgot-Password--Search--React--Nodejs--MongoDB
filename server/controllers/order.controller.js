// Import necessary modules and models
import Stripe from "../config/stripe.js"; // Configured Stripe instance
import CartProductModel from "../models/cartproduct.model.js"; // Model for user's cart products
import OrderModel from "../models/order.model.js"; // Model for storing orders
import UserModel from "../models/user.model.js"; // Model for user details
import mongoose from "mongoose"; // MongoDB ORM for generating IDs and queries

// Controller to handle Cash On Delivery (COD) orders
export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId; // Extract user ID from auth middleware
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body; // Destructure required fields from request body

        // Map through items in the cart to create an order payload
        const payload = list_items.map(el => ({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`, // Unique order ID
            productId: el.productId._id, // Product ID from cart
            product_details: { 
                name: el.productId.name, // Product name
                image: el.productId.image // Product image URL
            },
            paymentId: "", // Empty for COD
            payment_status: "CASH ON DELIVERY", // COD payment status
            delivery_address: addressId, // Delivery address
            subTotalAmt: subTotalAmt, // Subtotal amount
            totalAmt: totalAmt, // Total amount
        }));

        // Insert the new orders into the database
        const generatedOrder = await OrderModel.insertMany(payload);

        // Remove the cart items for the user after successful order
        const removeCartItems = await CartProductModel.deleteMany({ userId: userId });
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        // Return response to indicate success
        return response.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        // Handle errors and return a failure response
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Utility function to calculate price after discount
export const pricewithDiscount = (price, dis = 1) => {
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100); // Calculate discount amount
    const actualPrice = Number(price) - Number(discountAmout); // Calculate discounted price
    return actualPrice;
};

// Controller to handle payment process using Stripe
export async function paymentController(request, response) {
    try {
        const userId = request.userId; // Extract user ID from auth middleware
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body; // Destructure required fields

        const user = await UserModel.findById(userId); // Retrieve user details for email

        // Prepare line items for Stripe checkout
        const line_items = list_items.map(item => ({
            price_data: {
                currency: 'inr', // Payment currency
                product_data: { 
                    name: item.productId.name, // Product name
                    images: item.productId.image, // Product image
                    metadata: { productId: item.productId._id } // Product metadata
                },
                unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100 // Calculate unit price after discount
            },
            adjustable_quantity: { 
                enabled: true, // Allow quantity adjustment
                minimum: 1 // Minimum quantity is 1
            },
            quantity: item.quantity // Product quantity
        }));

        // Prepare Stripe session parameters
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'], // Allow card payments
            customer_email: user.email, // User's email for receipt
            metadata: { 
                userId: userId, 
                addressId: addressId 
            },
            line_items: line_items, // Line items prepared earlier
            success_url: `${process.env.FRONTEND_URL}/success`, // Success redirect URL
            cancel_url: `${process.env.FRONTEND_URL}/cancel` // Cancel redirect URL
        };

        // Create a Stripe checkout session
        const session = await Stripe.checkout.sessions.create(params);

        // Return session details
        return response.status(200).json(session);

    } catch (error) {
        // Handle errors and return a failure response
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Utility function to prepare order payloads from line items
const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = [];

    if (lineItems?.data?.length) {
        // Loop through line items and retrieve product details from Stripe
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product);

            // Prepare payload for each product
            const payload = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`, // Generate unique order ID
                productId: product.metadata.productId, // Product ID from metadata
                product_details: { 
                    name: product.name, 
                    image: product.images 
                },
                paymentId: paymentId, // Payment ID from Stripe
                payment_status: payment_status, // Payment status
                delivery_address: addressId, // Delivery address
                subTotalAmt: Number(item.amount_total / 100), // Subtotal amount
                totalAmt: Number(item.amount_total / 100) // Total amount
            };

            productList.push(payload); // Add payload to the list
        }
    }

    return productList; // Return the prepared list
};

// Webhook to handle Stripe events (e.g., payment success)
export async function webhookStripe(request, response) {
    const event = request.body; // Retrieve the event object from the webhook request
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY; // Secret key for webhook validation

    console.log("event", event); // Log the event for debugging

    // Handle specific Stripe events
    switch (event.type) {
        case 'checkout.session.completed': // Handle completed checkout session
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id); // Retrieve line items for the session
            const userId = session.metadata.userId;

            const orderProduct = await getOrderProductItems({
                lineItems: lineItems,
                userId: userId,
                addressId: session.metadata.addressId,
                paymentId: session.payment_intent,
                payment_status: session.payment_status,
            });

            const order = await OrderModel.insertMany(orderProduct); // Save order in database

            if (Boolean(order[0])) {
                // Clear the user's cart upon successful order creation
                await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                await CartProductModel.deleteMany({ userId: userId });
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`); // Log unhandled events
    }

    // Respond to Stripe to acknowledge receipt of the event
    response.json({ received: true });
}

// Controller to fetch order details for a user
export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId; // Extract user ID from auth middleware

        // Retrieve and sort the user's orders by creation date
        const orderlist = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate('delivery_address'); // Populate address details

        return response.json({
            message: "Order list",
            data: orderlist, // Return the order list
            error: false,
            success: true
        });
    } catch (error) {
        // Handle errors and return a failure response
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
/* 

CashOnDeliveryOrderController

handles creating an order with "Cash on Delivery" as the payment method

CashOnDeliveryOrderController
handles creating an order with "Cash on Delivary" as the payment method
Logic
1 Extract User ID and Order Details
    get userId from the auth middleware
    get list_item, totalAmt, addressId, and subTotalAmt from the request body

2 Prepare Payload:
    Map through the list_items to create an array of orders, where each order includes
        User ID
        A unique Order ID using mongoose.Types.ObjectId
        Product details(Id,name and image)
        Payment status as "CASH ON DELIVERY"
        Delivery address ans total/subtotal amounts
3 Insert Orders into Database
    use OrderModel.insertMany to add the orders to the database

4 Remove Items from the Cart
        delete the users cart items from CartProductModel
        Update the users shopping_cart field in UserModel to an empty array

5 Send Response:
        return success message along with the created order details

-----------------------------------------------------------------------------------------------------
2. pricewithDiscount
Calculates the discounted price of a product.

Logic:
    Calculate the discount amount as (price * discount / 100).
    Subtract the discount amount from the original price.
    Return the discounted price.

----------------------------------------------------------------------------------------------------
3. paymentController
Handles online payment using Stripe.

Logic:
    Extract User ID and Order Details:

Get userId from the auth middleware.
    Extract list_items, totalAmt, addressId, and subTotalAmt from the request body.
    Fetch User Email:

    Retrieve the user's email using their userId.
Prepare Stripe Line Items:

Map through list_items to create line_items for Stripe:
    Include product details (name, image, ID) and price.
    Apply discounts using the pricewithDiscount function.
    Specify quantity and adjustable quantity options.
Create Stripe Session:

Set up Stripe session parameters such as:
Payment type, customer email, and metadata (user ID, address ID).
Success and cancel URLs for the frontend.
Create Stripe Checkout Session:

Call Stripe.checkout.sessions.create to create a checkout session.
Return the session data in the response.

------------------------------------------------------------------------------------------------------------

4. getOrderProductItems
Helper function to structure order items after Stripe payment.

Logic:
Initialize an empty array productList.
Iterate through lineItems to:
Retrieve product details from Stripe.
Create an order payload for each product with details like user ID, order ID, product details, payment ID, and amounts.
Return the structured list of order items.

-----------------------------------------------------------------------------------------------------------------
5. webhookStripe
Handles Stripe webhook events for payment success.

Logic:
Read Webhook Event:

Parse the event from the Stripe webhook.
Handle checkout.session.completed Event:

When a checkout session is completed:
Retrieve line items for the session using Stripe.checkout.sessions.listLineItems.
Use the getOrderProductItems function to prepare order details.
Insert the order data into the database using OrderModel.insertMany.
If orders are successfully saved:
Clear the user's shopping cart in UserModel.
Remove cart items from CartProductModel.
Handle Other Events:

Log unhandled event types for debugging.
Acknowledge Event:

Send a JSON response to acknowledge receipt of the event.
6. getOrderDetailsController
Fetches a list of orders for the authenticated user.

Logic:
Fetch User Orders:

Retrieve orders for the logged-in user (userId) from the OrderModel.
Sort orders by creation date in descending order.
Populate the delivery address details.
Send Response:

Return a success message with the list of orders.
Key Concepts:
Order Flow for Cash on Delivery:

Collect user data and order details.
Save orders in the database.
Remove items from the cart.
Stripe Payment Flow:

Create a checkout session.
Handle payment success via Stripe webhook.
Store the orders after payment completion.
Error Handling:

Each controller has try-catch blocks to handle errors and return proper responses.
Reusability:

Helper functions (getOrderProductItems, pricewithDiscount) simplify logic reuse.
This setup efficiently handles both cash-on-delivery and online payment workflows, ensuring order data integrity and seamless user experience.










*/