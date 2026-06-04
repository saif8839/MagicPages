import User from "../models/userModel.js"


const checkAndUpdateCredits = async (req , res , next) =>
{
  const userId = req.user._id

  const user = await User.findById(userId)

  if(user.credits < 1)
  {
    res.status(429)
    throw new Error("Not Enough Credits.....")

  }

  await User.findByIdAndUpdate(userId , {credits : user.credits-1} , {new : true} )

  next()
}


export default checkAndUpdateCredits