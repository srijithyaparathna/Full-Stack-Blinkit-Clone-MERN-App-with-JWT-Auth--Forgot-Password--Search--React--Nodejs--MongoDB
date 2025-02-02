import { Category } from "@mui/icons-material"
import mongoose from "mongoose"


const subCategorySchema = new mongoose.Schema(
    {
        name:{
            type:String
        },
        image:{
            type:String,
            default:""
        },

        category:[
            {
                type:mongoose.Schema.ObjectId,// Reference the _id of a Category document
                ref:"category" // specifies the collection being referenced (Category Model)
            }
        ]



        
    },{
        timestamps:true
    }
    
    );

    const SubCategoryModel = mongoose.model('subCategory',subCategorySchema);
    export default SubCategoryModel;        