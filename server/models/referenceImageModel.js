import mongoose from "mongoose";

  

const referenceImageSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true 
        },
        imageURL : {
            type : String,
            required : true 
        }
    }
    ,
    {
        timestamps : true 
    }
)


const ReferenceImage = mongoose.model("ReferenceImage" , referenceImageSchema)

export default ReferenceImage
