import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide name"],
    },
    email: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
    },
    password: {
      type: String, // Fixed typo (was 'tyep')
      required: [true, "Provide password"],
    },
    avatar: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      default: null,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: null, // Use `null` instead of an empty string for a date field
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    address_details: [
      {
        type: mongoose.Schema.ObjectId, // Reference the _id of an address document
        ref: "address", // Specifies the collection being referenced
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId, // Reference the _id of a cart product document
        ref: "cartProduct", // Specifies the collection being referenced
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.ObjectId, // Reference the _id of an order document
        ref: "order", // Specifies the collection being referenced
      },
    ],
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry : {
      type : Date,
      default : ""
  },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
