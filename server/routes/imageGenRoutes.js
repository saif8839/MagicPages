import express from 'express'
import protect from '../middlewares/authMiddlewares.js'
import imageController from '../controllers/imageGenController.js'
import checkAndUpdateCredits from '../middlewares/creditUpdateMiddlewares.js'

const router = express.Router()

router.post("/generate" , protect.forUser ,checkAndUpdateCredits, imageController.transformImage)

export default router 