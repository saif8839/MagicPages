import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/dbconfig.js'
import authRoutes from "./routes/authRoutes.js"

dotenv.config()


const PORT = process.env.PORT || 5000

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded())
//auth routes
app.use("/api/auth" , authRoutes)


app.listen( PORT , ()=>
{
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`)
})