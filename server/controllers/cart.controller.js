
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

// Add item to the cart
export const addToCartItemController = async (request, response) => {
  try {
    // step 1: Extract userId from middleware and productId from the request body
    const userId = request.userId;
    const { productId } = request.body;

    // step 2: Validate that productId is provided
    if (!productId) {
      return response.status(402).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }

    // step 3: check if the item is already in the users cart
    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    // step 4: if the item exists in the cart return a messaage
    if (checkItemCart) {
      message: "Item already in cart";
    }

    // step 5: Add the item to the cart with an initial quantity of 1
    const cartItem = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const save = await cartItem.save();

    // Step 6: update the user s shoppping_cart in the user model
    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: { shopping_cart: productId },
      }
    );

    // step 7 : Respond with success message and saved cart data
    return response.json({
      dataa: save,
      message: "Item add successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    // Step 8 : Handle server errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get all items in the cart
export const getCartItemController = async (request, response) => {
  try {
    // Step 1 : Get the userId from the request(via meddleware)
    const userId = request.userId;

    // Step 2 : Fetch all cart items for the user and populate the productId details
    const cartItem = await CartProductModel.find({
      userId: userId,
    }).populate("productId");

    // Step 3 : Respond with the cart items
    return response.json({
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    // Step 4 : Handel server errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 3 Update the quantity of a cart item
export const updateCartItemQtyController = async (request, response) => {
  try {
    // Step 1 : Extract user ID form the middleware and _id qty from the request body
    const userId = response.body;
    const { _id, qty } = response.body;

    // Step 2 : Validate that _id and qty are provided
    if (!_id || !qty) {
      return response.status(400)({
        message: "provide _id qty",
      });
    }
    // Step 3 : Update teh quantity of the cart item the given userId and _id
    const updateCartitem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      }
    );
    // Step 4 : Respond with success message and update data
    return response.json({
      message: "Update cart",
      success: true,
      error: false,
    });
  } catch (error) {
    // Step 5: Handle server errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Remove an item from the cart
export const deleteCartItemQtyController = async (request, response) => {
  try {
    // Step 1: Extract userId from middleware and _id from the request body
    const userId = request.userId;
    const { _id } = request.body;

    // Step 2: Validate that _id is provided
    if (!_id) {
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    // Step 3: Delete the cart item for the given userId and _id
    const deleteCartItem = await CartProductModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    // Step 4: Respond with success message and deleted data
    return response.json({
      message: "Item removed",
      error: false,
      success: true,
      data: deleteCartItem,
    });
  } catch (error) {
    // Step 5: Handle server errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
