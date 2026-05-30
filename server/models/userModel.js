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
    isActive :{
        type : Boolean,
        required : true,
        deefault : false
    },
    credits : {
        type : Number,
        required : true,
        default : 5
    }
}, {
    timestamps : true
})

const User = mongoose.model('User', userSchema)

export default User