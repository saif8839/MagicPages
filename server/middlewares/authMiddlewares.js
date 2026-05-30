import Users from  "../models/userModel.js"
import jwt from "jsonwebtoken"


const forUser = async (req,res,next) =>
{
    try
    {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const user = await Users.findById(decoded.id).select("-password") 
            req.user = user
            next()
        }
        else{
            res.status(401)
            throw new Error("Unauthorized Access!!!")
        }
    }
    catch(error)
    {
        res.status(401)
        throw new Error("Unauthorized Access!!!")
    }
}


const forAdmin = async (req,res,next) =>
{
    try
    {
        
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
           
            let token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await Users.findById(decoded.id).select("-password") 
            req.user = user
           if(user.isAdmin)
           {
             next()
           }
           else{
            res.status(401)
            throw new Error("Unauthorized Access!!!")
        }
        }
        else{
            res.status(401)
            throw new Error("Unauthorized Access!!!")
        }
    }
    catch(error)
    {
        res.status(401)
        throw new Error("Unauthorized Access!!!")
    }
}

const protect = {forUser , forAdmin}

export default protect