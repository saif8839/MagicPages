import uploadToCloudinary from "../middlewares/cloudinaryMiddlewares.js"
import fs from "node:fs"

import ReferenceImage from "../models/referenceImageModel.js"

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


const getMyReferenceImage =  async (req , res ) =>
{

}


const userController = {uploadReferenceImage}

export default userController