import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : Number,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean,
        required : true,
        default : false
    },
    credits : {
        type : Number,
        required : true,
        default : 5
    }
}, {
    timestamps : true
})

const user = mongoose.model('User', userSchema)

export default user