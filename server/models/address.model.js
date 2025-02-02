import mongoose from "mongoose";

const addressSchema = new mongoose.Schema ({

address_line:{
    type  : String,
    default: ""
},
city: {
    type:String,
    default : ""
},
state:{
    type:String,
    default:""
},
pincode: {
    type:String
},
country: {
    type:String
},
mobile: {
    type:Number,
    default:null
},
status:{
    type:Boolean,
    default:true
},
userID:{
    type:mongoose.Schema.ObjectId, // Reference the _id of a User Document
    ref:"User" // Specifies the collection 
}
}, {

timestamps:true
});

const AddressModel = mongoose.model('address', addressSchema);
export default AddressModel;