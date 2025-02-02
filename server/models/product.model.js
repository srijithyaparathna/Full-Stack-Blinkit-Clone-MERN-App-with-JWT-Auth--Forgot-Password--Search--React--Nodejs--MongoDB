import { Category } from "@mui/icons-material";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },

    Category: [
      {
        type: mongoose.Schema.ObjectId, //Reference the _id of a Category document
        ref: "category", // Specifies the collection being referenced (CategoryModel)
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId, // Reference the _id of a SubCategory document
        ref: "subCategory", // Specifies the collection being referenced(Subcategory)
      },
    ],

    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: null,
    },

    price: {
      type: Number,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    more_details: {
      type: Object,
      default: "",
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

 // Create a text index for full text search
productSchema.index({
    name:'text',
    description:'text'
},
{
  name:10,
  description:5  
}
)

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
