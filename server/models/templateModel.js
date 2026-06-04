import mongoose from "mongoose";

  const templateSchema = mongoose.Schema({

    title : {
        type : String,
        required : true
    },
    imageURL : {
        type : String,
        required : true 
    },
    prompt : {
        type : String,
        required : true 
    },
    isActive : {
        type : Boolean,
        default : true,
        required : true
    },
    creditExpense : {
        type : number,
        default : 0,
        required : true
    }

  },
{
    timestamps : true
}
)


const ImageTemplate = mongoose.model("Template" , templateSchema)

export default ImageTemplate