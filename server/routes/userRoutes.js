import express, { Router } from 'express'
import userController from '../controllers/userControllers.js'
import protect from '../middlewares/authMiddlewares.js'
import upload from '../middlewares/imageUploadMiddlewares.js'

const router = express.Router()


router.post("/upload" , protect.forUser , upload.single('image')  , userController.uploadReferenceImage )


export default router