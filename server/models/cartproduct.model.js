import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
productId: {
    type:mongoose.Schema.ObjectId, // References the _id of a product document
    ref:'product' // Specifies the collection being referenced (product model)
},
quantity:{
    type:Number,
    default:1
},
userId:{
    type:mongoose.Schema.ObjectId, // References the _id of a User document
    ref: "User" // Specifires the collection being referenced (userModel)
}}, 
{
    timestamps:true
});

const CartProductModel = mongoose.model('cartProduct', cartProductSchema);
export default CartProductModel;
