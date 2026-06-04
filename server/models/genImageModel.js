import mongoose from "mongoose";



const genImage = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'User'
        },
        imageURL : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)  


const GenImage = mongoose.model("GenImage" , genImage)


export default GenImage