// all the pacages that I imported 
import express from 'express'
import connectDB from './config/db.js'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import authRoute from './routes/authRoute.js'
import cors from 'cors'
import categoryRoute from './routes/categoryRoutes.js'
import producRoute from './routes/productRoute.js'


const app = express()

// Configring dotenv file
dotenv.config();

const PORT = process.env.PORT;

// rest API
app.get("/", (req, res)=>{
    res.send(" <h1> Welcome to E-Commerce Application </h1> ")
})

// using middlewares 
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// All the Routes Will be here
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/products', producRoute)

// Connecting to the Database 
connectDB()

// Running our Server
app.listen(PORT, ()=>{
    console.log(`Server is running on this ${PORT}`);
})