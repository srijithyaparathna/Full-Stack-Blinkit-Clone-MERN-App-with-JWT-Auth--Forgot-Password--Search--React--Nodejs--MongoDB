import CategoryModel from "../models/category.model.js"; // Import the Category model for database operations
import SubCategoryModel from "../models/subCategory.model.js"; // Import the SubCategory model
import ProductModel from "../models/product.model.js"; // Import the Product model
import { request, response } from "express";



// Controlle to add a new category 
export const AddCategoryController = async (request, response) => {
    try{

        const {name , image } = request.body  // Destructure the name and image fiels form the request body


        //  check if both name and image are provided
        if(!name || !image){
            return response.status(400).json({
                message:"Enter required fields",
                error:true,
                success:false
            });
        }

        // create  a new category object using the provided data 
        const addCategory = new CategoryModel({
            name,
            image
        });

          // Save the category to the database
          const saveCategory = await addCategory.save();

        // Check if the category was not save 
        if(!saveCategory){
            return response.status(400).json({
                message:"Not Created",
                error:true,
                success:false
            });
        }
        // Return a success responce with the saved category
        return response.json({
            message:"Add Category",
            data:saveCategory,
            success:true,
            error:false
        });


        
    }
    catch(error){
        // Handle any errors and return an error response
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        });
    }

    
};


// Controller to retrieve all categories
export const getCategoryController = async (request,response) => {
try{
    // Fetch all categories from the database , sorted by creatin data (newest first)
    const data= await CategoryModel.find().sort({createdAt:-1});


    // Return the fetched data as a succesfull response 
    return response.json({
        data:data,
        error:false,
        success:true
    });
}
catch(error){
    // Handel any error and return an error response
    return response.status(500).json({
        message:error.message || error,
        error:true,
        success:false
    });   
} 
};

// Controller to update an existing category
export const updateCategoryController = async (request,response) => {
try{
    // Destructure the required fields form request body
    const {_id , name ,image } = request.body;

    // Update the category with the specified _id using the provided name and image 
    const update = await CategoryModel.updateOne({
        _id : _id
    },{
        name,
        image
    });
    // Return a success response with the update result
    return response.json({
        message:"Update Category",
        success:true,
        error:false,
        data:update
    })
}
catch(error){
    // Handel any errors and return an error response
    return response.status(500).json({
        message:error.message || error,
        error:true,
        success:false
    });
}

};

// Controller to delete a category
export const deleteCategoryController = async (request, response) => { 
    try{
      const {_id} = request.body // Extract the _id the category to be deleted
      
      // check if there are any subcategories associated withe this category
      const checkSubcategory = await SubCategoryModel.find({
        category:{
            "$in":[_id]
        }
      }).countDocuments();
    
       // Check if there are any products associated with this category
       const checkProduct = await ProductModel.find({
        category: {
            "$in": [_id]
        }
    }).countDocuments();
    
    // if the category is associated with subcategory or product prevent deletion
    if(checkSubcategory > 0 || checkProduct > 0){
        return response.status(400).json({
            message:"Category is already is use can`t delete",
            error:true,
            success:false
        });

    }

    // Delete the category from the database
    const deleteCategory = await CategoryModel.deleteOne({_id:_id});

    // Return a success response 
    return response.json({
        message:"Delete category successfully ",
        data:deleteCategory,
        error:false,
        success:true
    });


    }
    catch(error){
        // Handle any errors return an error respose
        return response.status(500).json({
            message : error.message || error,
            success:false,
            error:true
        });

    }
};
















