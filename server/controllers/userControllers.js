import uploadToCloudinary from "../middlewares/cloudinaryMiddlewares.js"
import fs from "node:fs"

import ReferenceImage from "../models/referenceImageModel.js"
import { get } from "mongoose"

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


const userController = {uploadReferenceImage , getMyReferenceImages}

export default userController