import express from 'express'
import adminControllers from '../controllers/adminControllers.js'
import protect from  "../middlewares/authMiddlewares.js"
import upload from '../middlewares/imageUploadMiddlewares.js'

const router = express.Router()


router.get("/users" ,protect.forAdmin ,adminControllers.getAllUsers)
router.put("/users/:uid" ,protect.forAdmin ,adminControllers.updateUser)
router.get("/credit_requests" ,protect.forAdmin ,adminControllers.getCreditRequests)
router.put("/credit_requests/:rid" ,protect.forAdmin ,adminControllers.updateCreditRequest)
router.post("/template" , protect.forAdmin , upload.single('image') , adminControllers.createTemplate)

export default router 
