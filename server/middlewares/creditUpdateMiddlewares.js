import ImageTemplate from "../models/templateModel.js";
import User from "../models/userModel.js"


const checkAndUpdateCredits = async (req , res , next) =>
{

  const {templateId} = req.body

  
        if (!templateId) {
            return res.status(400).json({
                message:
                    "Please provide template ID",
            });
        }

  const userId = req.user._id

   const template = await ImageTemplate.findById(templateId)

        if(!template)
        {
            res.status(409)
            throw new Error("Template Does Not Exist!!")
        }

  const user = await User.findById(userId)

  if(user.credits < 1)
  {
    res.status(429)
    throw new Error("Not Enough Credits.....")

  }

  await User.findByIdAndUpdate(userId , {credits : user.credits-template.creditExpense} , {new : true} )

  next()
}


export default checkAndUpdateCredits