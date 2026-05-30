import User from "../models/userModel.js"

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



const adminControllers = {getAllUsers , updateUser}

export default adminControllers