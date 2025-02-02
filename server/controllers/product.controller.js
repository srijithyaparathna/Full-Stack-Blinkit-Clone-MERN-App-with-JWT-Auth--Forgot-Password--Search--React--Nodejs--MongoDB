import ProductModel from "../models/product.model.js";

// Controller to create a new product
export const createProductController = async (request, response) => {
    try {
        const { 
            name, image, category, subCategory, unit, stock, price, discount, description, more_details 
        } = request.body;

        // Validate required fields
        if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description) {
            return response.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false,
            });
        }

        // Create a new product instance
        const product = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        });

        // Save the product to the database
        const saveProduct = await product.save();

        // Return success response with product data
        return response.json({
            message: "Product Created Successfully",
            data: saveProduct,
            error: false,
            success: true,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to get paginated list of products
export const getProductController = async (request, response) => {
    try {
        let { page, limit, search } = request.body;

        // Default pagination values
        if (!page) page = 1;
        if (!limit) limit = 10;

        // Build the search query if a search term is provided
        const query = search ? { $text: { $search: search } } : {};

        const skip = (page - 1) * limit; // Calculate the number of records to skip

        // Fetch product data and total count concurrently
        const [data, totalCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 }) // Sort by newest first
                .skip(skip)
                .limit(limit)
                .populate('category subCategory'), // Populate category and subCategory references
            ProductModel.countDocuments(query), // Count total matching documents
        ]);

        // Return paginated product data
        return response.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount,
            totalNoPage: Math.ceil(totalCount / limit), // Total pages
            data,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to get products by category
export const getProductByCategory = async (request, response) => {
    try {
        const { id } = request.body;

        // Check if category ID is provided
        if (!id) {
            return response.status(400).json({
                message: "Provide category ID",
                error: true,
                success: false,
            });
        }

        // Fetch products belonging to the specified category
        const product = await ProductModel.find({ category: { $in: id } }).limit(15);

        // Return category products
        return response.json({
            message: "Category product list",
            data: product,
            error: false,
            success: true,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to get products by category and subcategory
export const getProductByCategoryAndSubCategory = async (request, response) => {
    try {
        let { categoryId, subCategoryId, page, limit } = request.body;

        // Validate category and subcategory IDs
        if (!categoryId || !subCategoryId) {
            return response.status(400).json({
                message: "Provide categoryId and subCategoryId",
                error: true,
                success: false,
            });
        }

        // Default pagination values
        if (!page) page = 1;
        if (!limit) limit = 10;

        const query = {
            category: { $in: categoryId },
            subCategory: { $in: subCategoryId },
        };

        const skip = (page - 1) * limit; // Calculate records to skip

        // Fetch products and their count concurrently
        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query),
        ]);

        // Return products and pagination details
        return response.json({
            message: "Product list",
            data,
            totalCount: dataCount,
            page,
            limit,
            success: true,
            error: false,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to get product details by ID
export const getProductDetails = async (request, response) => {
    try {
        const { productId } = request.body;

        // Fetch product details by ID
        const product = await ProductModel.findOne({ _id: productId });

        // Return product details
        return response.json({
            message: "Product details",
            data: product,
            error: false,
            success: true,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to update product details
export const updateProductDetails = async (request, response) => {
    try {
        const { _id } = request.body;

        // Validate product ID
        if (!_id) {
            return response.status(400).json({
                message: "Provide product _id",
                error: true,
                success: false,
            });
        }

        // Update product with new data
        const updateProduct = await ProductModel.updateOne({ _id: _id }, { ...request.body });

        // Return success message
        return response.json({
            message: "Updated successfully",
            data: updateProduct,
            error: false,
            success: true,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to delete a product
export const deleteProductDetails = async (request, response) => {
    try {
        const { _id } = request.body;

        // Validate product ID
        if (!_id) {
            return response.status(400).json({
                message: "Provide _id",
                error: true,
                success: false,
            });
        }

        // Delete product by ID
        const deleteProduct = await ProductModel.deleteOne({ _id: _id });

        // Return success message
        return response.json({
            message: "Deleted successfully",
            error: false,
            success: true,
            data: deleteProduct,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// Controller to search for products
export const searchProduct = async (request, response) => {
    try {
        let { search, page, limit } = request.body;

        // Default pagination values
        if (!page) page = 1;
        if (!limit) limit = 10;

        // Build search query
        const query = search ? { $text: { $search: search } } : {};

        const skip = (page - 1) * limit; // Calculate records to skip

        // Fetch products and count concurrently
        const [data, dataCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category subCategory'),
            ProductModel.countDocuments(query),
        ]);

        // Return search results and pagination details
        return response.json({
            message: "Product data",
            error: false,
            success: true,
            data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            page,
            limit,
        });
    } catch (error) {
        // Handle errors
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};
