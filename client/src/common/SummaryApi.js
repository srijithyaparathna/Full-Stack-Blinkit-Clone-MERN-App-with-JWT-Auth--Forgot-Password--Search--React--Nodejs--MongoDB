// Import the base API URL from environment variables.
// This allows the API base URL to be dynamically set depending on the environment (development, production, etc.).
export const baseURL = "http://localhost:8080";

// `SummaryApi` is an object that holds the definitions of all API endpoints and their associated HTTP methods.
const SummaryApi = {
    // User Authentication and Management APIs
    register: {
        url: '/api/user/register', // Endpoint for user registration
        method: 'post' // HTTP method: POST (used for sending data to the server)
    },
    login: {
        url: '/api/user/login', // Endpoint for user login
        method: 'post' // HTTP method: POST
    },
    forgot_password: {
        url: "/api/user/forgot-password", // Endpoint for initiating password reset
        method: 'put' // HTTP method: PUT (typically used for updates)
    },
    forgot_password_otp_verification: {
        url: 'api/user/verify-forgot-password-otp', // Endpoint to verify OTP for password reset
        method: 'put' // HTTP method: PUT
    },
    resetPassword: {
        url: "/api/user/reset-password", // Endpoint to reset the user's password
        method: 'put' // HTTP method: PUT
    },
    refreshToken: {
        url: 'api/user/refresh-token', // Endpoint for refreshing authentication tokens
        method: 'post' // HTTP method: POST
    },
    userDetails: {
        url: '/api/user/user-details', // Endpoint to fetch user details
        method: "get" // HTTP method: GET (used to retrieve data)
    },
    logout: {
        url: "/api/user/logout", // Endpoint for user logout
        method: 'get' // HTTP method: GET
    },
    uploadAvatar: {
        url: "/api/user/upload-avatar", // Endpoint to upload user profile pictures
        method: 'put' // HTTP method: PUT
    },
    updateUserDetails: {
        url: '/api/user/update-user', // Endpoint to update user details
        method: 'put' // HTTP method: PUT
    },

    // Category Management APIs
    addCategory: {
        url: '/api/category/add-category', // Endpoint to add a new category
        method: 'post' // HTTP method: POST
    },
    uploadImage: {
        url: '/api/file/upload', // Endpoint to upload files (e.g., images)
        method: 'post' // HTTP method: POST
    },
    getCategory: {
        url: '/api/category/get', // Endpoint to retrieve categories
        method: 'get' // HTTP method: GET
    },
    updateCategory: {
        url: '/api/category/update', // Endpoint to update an existing category
        method: 'put' // HTTP method: PUT
    },
    deleteCategory: {
        url: '/api/category/delete', // Endpoint to delete a category
        method: 'delete' // HTTP method: DELETE
    },

    // Subcategory Management APIs
    createSubCategory: {
        url: '/api/subcategory/create', // Endpoint to create a subcategory
        method: 'post' // HTTP method: POST
    },
    getSubCategory: {
        url: '/api/subcategory/get', // Endpoint to retrieve subcategories
        method: 'post' // HTTP method: POST
    },
    updateSubCategory: {
        url: '/api/subcategory/update', // Endpoint to update a subcategory
        method: 'put' // HTTP method: PUT
    },
    deleteSubCategory: {
        url: '/api/subcategory/delete', // Endpoint to delete a subcategory
        method: 'delete' // HTTP method: DELETE
    },

    // Product Management APIs
    createProduct: {
        url: '/api/product/create', // Endpoint to create a product
        method: 'post' // HTTP method: POST
    },
    getProduct: {
        url: '/api/product/get', // Endpoint to retrieve products
        method: 'post' // HTTP method: POST
    },
    getProductByCategory: {
        url: '/api/product/get-product-by-category', // Endpoint to retrieve products by category
        method: 'post' // HTTP method: POST
    },
    getProductByCategoryAndSubCategory: {
        url: '/api/product/get-pruduct-by-category-and-subcategory', // Endpoint to retrieve products by category and subcategory
        method: 'post' // HTTP method: POST
    },
    getProductDetails: {
        url: '/api/product/get-product-details', // Endpoint to retrieve details of a specific product
        method: 'post' // HTTP method: POST
    },
    updateProductDetails: {
        url: "/api/product/update-product-details", // Endpoint to update product details
        method: 'put' // HTTP method: PUT
    },
    deleteProduct: {
        url: "/api/product/delete-product", // Endpoint to delete a product
        method: 'delete' // HTTP method: DELETE
    },
    searchProduct: {
        url: '/api/product/search-product', // Endpoint to search for products
        method: 'post' // HTTP method: POST
    },

    // Cart Management APIs
    addTocart: {
        url: "/api/cart/create", // Endpoint to add items to the cart
        method: 'post' // HTTP method: POST
    },
    getCartItem: {
        url: '/api/cart/get', // Endpoint to retrieve items in the cart
        method: 'get' // HTTP method: GET
    },
    updateCartItemQty: {
        url: '/api/cart/update-qty', // Endpoint to update cart item quantities
        method: 'put' // HTTP method: PUT
    },
    deleteCartItem: {
        url: '/api/cart/delete-cart-item', // Endpoint to delete a cart item
        method: 'delete' // HTTP method: DELETE
    },

    // Address Management APIs
    createAddress: {
        url: '/api/address/create', // Endpoint to add a new address
        method: 'post' // HTTP method: POST
    },
    getAddress: {
        url: '/api/address/get', // Endpoint to retrieve saved addresses
        method: 'get' // HTTP method: GET
    },
    updateAddress: {
        url: '/api/address/update', // Endpoint to update an address
        method: 'put' // HTTP method: PUT
    },
    disableAddress: {
        url: '/api/address/disable', // Endpoint to disable an address
        method: 'delete' // HTTP method: DELETE
    },

    // Order Management APIs
    CashOnDeliveryOrder: {
        url: "/api/order/cash-on-delivery", // Endpoint for cash-on-delivery orders
        method: 'post' // HTTP method: POST
    },
    payment_url: {
        url: "/api/order/checkout", // Endpoint for online payment checkout
        method: 'post' // HTTP method: POST
    },
    getOrderItems: {
        url: '/api/order/order-list', // Endpoint to retrieve order items
        method: 'get' // HTTP method: GET
    }
};

export default SummaryApi;
// Exporting the `SummaryApi` object so it can be used throughout the application to make API calls.
