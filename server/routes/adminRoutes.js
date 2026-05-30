import express from 'express'
import adminControllers from '../controllers/adminControllers.js'
import protect from  "../middlewares/authMiddlewares.js"

const router = express.Router()


router.get("/users" ,protect.forAdmin ,adminControllers.getAllUsers)
router.put("/users/:uid" ,protect.forAdmin ,adminControllers.updateUser)


export default router 
