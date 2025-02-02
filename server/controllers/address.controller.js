import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js"; 

// Controller to add a new address
export const addAddressController = async (request, response) => {
    try {
        const userId = request.userId; // Extract userId from middleware (assumes the middleware sets this value)
        const { address_line, city, state, pincode, country, mobile } = request.body;

        // Create a new address entry
        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            country,
            pincode,
            mobile,
            userId: userId, // Associate the address with the logged-in user
        });

        // Save the address to the database
        const saveAddress = await createAddress.save();

        // Update the user's record by adding the address ID to their address details
        const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id,
            },
        });

        // Return a success response
        return response.json({
            message: "Address Created Successfully",
            error: false,
            success: true,
            data: saveAddress, // Include the saved address in the response
        });
    } catch (error) {
        // Handle any errors that occur during the operation
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to get a list of addresses for the logged-in user
export const getAddressController = async (request, response) => {
    try {
        const userId = request.userId; // Extract userId from middleware

        // Fetch all addresses for the user, sorted by creation date (newest first)
        const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 });

        // Return a success response with the list of addresses
        return response.json({
            data: data,
            message: "List of address",
            error: false,
            success: true,
        });
    } catch (error) {
        // Handle any errors that occur during the operation
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to update an existing address
export const updateAddressController = async (request, response) => {
    try {
        const userId = request.userId; // Extract userId from middleware
        const { _id, address_line, city, state, country, pincode, mobile } = request.body;

        // Update the address by matching both the address ID and the user ID
        const updateAddress = await AddressModel.updateOne(
            { _id: _id, userId: userId },
            {
                address_line,
                city,
                state,
                country,
                mobile,
                pincode,
            }
        );

        // Return a success response with the updated data
        return response.json({
            message: "Address Updated",
            error: false,
            success: true,
            data: updateAddress,
        });
    } catch (error) {
        // Handle any errors that occur during the operation
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to soft delete (disable) an address
export const deleteAddresscontroller = async (request, response) => {
    try {
        const userId = request.userId; // Extract userId from middleware    
        const { _id } = request.body;

        // Mark the address as disabled by setting its `status` field to false
        const disableAddress = await AddressModel.updateOne(
            { _id: _id, userId },
            {
                status: false, // Soft delete (mark as inactive)
            }
        );

        // Return a success response indicating the address has been removed
        return response.json({
            message: "Address removed",
            error: false,
            success: true,
            data: disableAddress,
        });
    } catch (error) {
        // Handle any errors that occur during the operation
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};
