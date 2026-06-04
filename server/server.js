import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/dbconfig.js'
import authRoutes from "./routes/authRoutes.js"
import errorHandler from './middlewares/errorHandler.js'
import adminControllers from './controllers/adminControllers.js'
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import imageGenRoutes from "./routes/imageGenRoutes.js"

dotenv.config()


const PORT = process.env.PORT || 5000

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//auth routes
app.use("/api/auth" , authRoutes)

app.use("/api/admin" , adminRoutes)

app.use("/api/user" , userRoutes)

app.use("/api/image", imageGenRoutes)

app.use(errorHandler)

app.listen( PORT , ()=>
{
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`)
})