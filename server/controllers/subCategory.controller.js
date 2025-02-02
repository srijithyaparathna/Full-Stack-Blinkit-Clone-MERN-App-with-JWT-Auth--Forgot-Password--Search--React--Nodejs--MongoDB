
import SubCategoryModel from "../models/subCategory.model.js"; // Import the SubCategory model for database operations

// Controller to add a new subcategory
export const AddSubCategoryController = async (request, response) => {
  try {
    // Extract required fields from the request body
    const { name, image, category } = request.body;

    // Check if all required fields are provided
    if (!name && !image && !category) {
      return response.status(400).json({
        message: "Provide name,image category",
        error: true,
        success: false,
      });
    }

    // Prepare the payload for creating a new subcategory
    const payload = {
      name,
      image,
      category,
    };

    // Create a new instance of subcategory with the provided payload
    const createSubCategory = new SubCategoryModel(payload);

    // Save the subcategory to the database
    const save = await createSubCategory.save();

    // Return a success response with the saved data
    return response.json({
      message: "Sub Category Created",
      data: save,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle any errors and return an error response
    return response.status(500).json({
      message: error.message || error, // Provide the error message
      error: true,
      success: false,
    });
  }
};

// Controlelr to retrive all subcategory
export const getSubCategoryController = async (request, response) => {
  try {
    // fetch all subcategory, sorted by created data (newest first)
    // populate teh category field include referenced category details
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");

    // Return a success response with the fetched data
    return response.json({
      message: "Sub Category data",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handel any errors and return an error response
    return response.status(500).json({
      message: error.message || error, // provided the error message
      error: true,
      success: false,
    });
  }
};

// controller to update an exsitng subcategoy
export const updateSubCategoryController = async (request, response) => {
  try {
    // Extract required fields form the request body
    const { _id, name, image, category } = request.body;

    // check if the subcategory with the given _id exists
    const checkSub = await SubCategoryModel.findById(_id);

    // If not found return an error response
    if (!checkSub) {
      return response.status(400).json({
        message: "Check your _id",
        error: true,
        success: false,
      });
    }
    // Update the subcategory with the provided data
    const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    });
    // Return a success response with the updated data
    return response.json({
      message: "Updated Successfully",
      data: updateSubCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle any errors and return an error response
    return response.status(500).json({
      message: error.message || error, // Provide the error message
      error: true,
      success: false,
    });
  }
};

// Controller to delete a subcategory
export const deleteSubCategoryController = async (request, response) => {
  try {
    // Extract the _id of the subcategory to be delete from the request body
    const { _id } = request.body;

    // Log the _id (useful for debugging)
    console.log("ID", _id);

    // Detelte the subcategory from the database
    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id);

    // Return a success response with the deleted subcategory data
    return response.json({
      message: "Delete Successfully",
      data: deleteSub,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle any errors and return an error response
    return response.status(500).json({
      message: error.message || error, // Provide the error message
      error: true,
      success: false,
    });
  }
};
