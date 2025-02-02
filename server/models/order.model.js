import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId, // References the id of a User Document
      ref: "User", // Specifies the collection being referenced(UserModel)
    },
    orderId: {
      type: String,
      required: [true, "provide orderId"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId, // Reference the _id of a product document
      ref: "product", //Specifies the collection being referenced {Product Model}
    },

    product_details: {
      name: String,
      image: Array,
    },
    paymentId: {
      type: String,
      default: "",
    },
    paymest_status: {
      type: String,
      default: "",
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId, //Reference the _id of a product document
      ref: "address", // Specifies the collection being referenced(productMolel/)
    },

    subTotalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model('order', orderSchema);
export default OrderModel;