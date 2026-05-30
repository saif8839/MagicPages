import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


const registerUser = async (req , res)=>
{
    // console.log(req.body)
   const {name , email , phone , password } = req.body
 
   
   if(!name || !email || !phone || !password)
   {
    res.status(409);
    throw new Error("Please Fill All Details!")
   }
   
   const emailExist = await User.findOne({email : email})
   const phoneExist = await User.findOne({phone : phone})
   
   if(emailExist || phoneExist)
   {
    res.status(409)
    throw new Error("uesr Already Exist")
   }

   const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password ,salt)

   const user = await User.create({name , email , phone , password : hashedPassword})

   if(!user){
    res.status(404)
    throw new Error("User Not Found!")
   }

   res.status(201).json({
            _id : user.id,
            name : user.name,
            email : user.email,
            phone : user.phone,
            credits : user.credits,
            admin : user.isAdmin,
            createdAt : user.createdAt,
            token : generateToken(user._id)
        })
}

const loginUser = async (req ,res) =>
{
    const {email , password} = req.body

    if(!email || !password)
    {
        res.status(409)
        throw new Error("Please Fill All Details!!")
    }

    const user = await User.findOne({email})

    if(user && await bcrypt.compare(password , user.password))
    {
        res.status(201).json({
           _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            credits: user.credits,
            admin: user.isAdmin,
            createdAt: user.createdAt,
            token: generateToken(user._id)
        })
    } else 
    {
        res.status(401)
        throw new Error("Invalid credentials")
    }

}

const privateController = ( req , res ) =>
{
    // console.log(req)
    console.log(req)
    // console.log(req.user.name)
 res.send("Request made by : " + req.user.name)
}

const generateToken = (id)=>
{
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : '30d'})
}

const authController = {registerUser ,loginUser , privateController}

export default authController