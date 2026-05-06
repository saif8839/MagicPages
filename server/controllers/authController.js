import user from "../models/userModel.js";
import bcrypt from "bcryptjs";

const registerUser = async (req , res)=>
{
   const {name , email , phone , password } = req.body
   
   if(!name || !email || !phone || !password)
   {
    res.status(409);
    throw new Error("Please Fill All Details!")
   }
   const emailExist = await user.findOne({email : email})
   const phoneExist = await user.findOne({phone : phone})
   
   if(emailExist || phoneExist)
   {
    res.status(409)
    throw new Error("uesr Already Exist")
   }

   const salt = await bcrypt.gensalt(10)
    const hashedPassword = await bcrypt.hash(password ,salt)

   const user = await User.create({name , email , phone , hashedPassword})

   if(!user){
    res.status(404)
    throw new Error("User Not Found!")
   }

   res.status(201).json(user)
}

const loginUser = async (req ,res) =>
{
    res.send("user login")
}



const authController = {registerUser ,loginUser}

export default authController