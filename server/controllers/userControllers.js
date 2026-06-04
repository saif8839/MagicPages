import uploadToCloudinary from "../middlewares/cloudinaryMiddlewares.js"
import fs from "node:fs"

import ReferenceImage from "../models/referenceImageModel.js"
import { get } from "mongoose"
import CreditRequest from "../models/creditRequestModel.js"

const uploadReferenceImage = async(req , res) =>
{
    let userId = req.user._id
    console.log(userId)
    console.log(req.file)

    const imageURL = await uploadToCloudinary(req.file.path)

    fs.unlinkSync(req.file.path)


    let referenceImage = await ReferenceImage.create(
        {
            user : userId,
            imageURL : imageURL.secure_url
        }
    )

    if(!referenceImage)
    {
        res.status(409)
        throw new Error("Image nor uploaded niether created")
    }


    res.status(201).json(referenceImage)
}


const getMyReferenceImages =  async (req , res ) =>
{

    const userId = req.user._id

    const image  = await ReferenceImage.find({user : userId})

    if(!image)
    {
        res.status(404)
        throw new Error("Image Not Found")
    }

    res.status(201).json(image)

}


const requestCredits = async (req,res) =>
{
    
    const {credits} = req.body

    if(!credits)
    {
        res.status(404)
        throw new Error("Please Enter Requested Credits......")
    }

    const userId = req.user._id

    const creditRequest = await new CreditRequest(
        {
            user : userId,
            credits : credits 
        }
    )

    await creditRequest.save()
    await creditRequest.populate("user")

    if(!creditRequest)
    {
        res.status(409)
        throw new Error("No Credit Request Created......!")
    }

    res.status(201).json(creditRequest)

}



const userController = {uploadReferenceImage , getMyReferenceImages , requestCredits}

export default userController