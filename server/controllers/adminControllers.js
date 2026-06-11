import uploadToCloudinary from "../middlewares/cloudinaryMiddlewares.js"
import CreditRequest from "../models/creditRequestModel.js"
import ImageTemplate from "../models/templateModel.js"
import User from "../models/userModel.js"
import fs from "node:fs"

const getAllUsers = async  (req , res)=>
{
   const users = await User.find().select('-password')

   if(!users)
   {
    res.status(404)
    throw new Error("Users Not Found")
   }

   res.status(200).json(users)

}

const updateUser = async (req , res) =>
{
    const user = await User.findById(req.params.uid)

    if(!user)
    {
        res.status(404)
        throw new Error("User Not Found!")
    }


    // const updatedUser = await User.findByIdAndUpdate(user._id , req.body , { returnDocument: "after" })

    const updatedUser = await User.findByIdAndUpdate(user._id , req.body , { new : true})
    if(!updatedUser)
    {
        res.status(409)
        throw new Error("User not Updated")
    }

    res.status(200).json(updatedUser)

}


const getCreditRequests = async (req , res) =>
{
    const creditRequests = await CreditRequest.find().populate("user")

    if(!creditRequests)
    {
        res.status(409)
        throw new Error("NO crtedit Requests Found")
    }

    res.status(201).json(creditRequests)
}

const updateCreditRequest = async (req , res) =>
{
    const requestId = req.params.rid
    const {isApproved} = req.body

    const updatedRequest = await CreditRequest.findByIdAndUpdate(requestId , {isApproved : isApproved} , {new : true})

    const user = await User.findById(updatedRequest.user)

    if(updatedRequest.isApproved)
    {
        await User.findByIdAndUpdate(user._id , { credits : user.credits + updatedRequest.credits} , {new : true})
        res.status(201).json({
            msg : "Credits Approved",
            user : user
        })
    }
    else{
        res.status(200).json({
            msg : "Credits Not Approved",
            user : user
        })
    }
}

const createTemplate = async (req , res)=>
{
    const {title , prompt , creditsExpense} = req.body


    if(!title || !prompt || !creditsExpense)
    {
        res.status(409)
        throw new Error("Please Fill All Details!!!")
    }

    const imageURL = await uploadToCloudinary(req.file.path)
    fs.unlinkSync(req.file.path)

    if(!imageURL)
    {
        res.status(409)
        throw new Error("Image Template Not Created...")
    }

    const imageTemplate = await ImageTemplate.create({
        title : title,
        prompt : prompt,
        imageURL : imageURL.secure_url,
        creditsExpense : creditsExpense
    })


    res.status(200).json(imageTemplate)
}

const adminControllers = {getAllUsers , updateUser , getCreditRequests , updateCreditRequest , createTemplate}

export default adminControllers