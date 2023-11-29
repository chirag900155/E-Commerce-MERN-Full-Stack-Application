import userSchema from "../models/userSchema.js";
import { comparePassword, hashPassword } from './../helper/authHelper.js';
import orderSchema from '../models/orderSchema.js'
import jwt from 'jsonwebtoken'

// Regiter Controller
export const registerController = async (req, res)=>{
    try{
        const { name, email, password, phone, address, answer } = req.body

        // Checking all the fileds are filed or not
        if(!name){
            res.send({message: 'Name is Required'})
        }
        if(!email){
            res.send({message: 'Email is Required'})
        }
        if(!password){
            res.send({message: 'Password is Required'})
        }
        if(!phone){
            res.send({message: 'Phone is Required'})
        }
        if(!address){
            res.send({message: 'Address is Required'})
        }
        if(!answer){
            res.send({message: 'Answer is Required'})
        }

        // Check User
        const existingUser = await userSchema.findOne({email})
        // existing user
        if(existingUser){
            return res.status(400).send({ message: 'User is already register please login',existingUser })
        }

        // Saving the details of the new user
        const hashedPassword = await hashPassword(password)
        const user =  await new userSchema({ name, email, phone, address, answer, password:hashedPassword }).save()
        res.status(201).send({
          success: true,
          message: 'User registered succesfully ',user  
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: 'Error in registration: ', error
        })
    }
}

// Forgot Password 

export const forgotPasswordController = async (req, res)=>{
    try {
        const {email, newPassword, answer} = req.body
        if(!email){
            res.send({message: 'Email is Required'})
        }
        if(!newPassword){
            res.send({message: 'New Password is Required'})
        }
        if(!answer){
            res.send({message: 'answer is Required'})
        }

        // Check
        const user = await userSchema.findOne({email, answer})

        // Validation
        if(!user){
            return res.status(404).send({
                message: 'wrong email or answer'
            })
        }

        const hashed = await hashPassword(newPassword);
        await userSchema.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Error in forgot password ${error.message}`
        })
    }
}


//Login Controller

export const loginController = async (req, res)=>{
    try{
        const { email, password } = req.body
        // Validations 
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Please fill all the fileds'
            })
        }

        // Check user
        const user = await userSchema.findOne({ email })
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not found please register first'
            })
        }

        // Comparing passwords
        const match = await comparePassword(password, user.password)

        if(!match){
            return res.status(404).send({
                success: false,
                message: 'Please enter right password'
            })
        }

        // Creating Token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SCREATE, 
        {expiresIn: '7d'})

        res.status(200).send({
            success: true,
            message: 'Login succesfully',
            user:{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in Login: ', 
            err
        })
    }
}

export const testRoute = (req, res)=>{
    res.send("This is protected route")
}

// Update profile
export const updateProfileController = async (req, res) =>{
    try {
        const {name, password, address, phone} = req.body
        const user = await userSchema.findById(req.user._id)
        // Password 
        if(password && password.length < 6){
            return res.json({ error: 'Password required 6 character long' })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updateUser = await userSchema.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, {new: true})

        res.status(200).send({
            success: true,
            message: 'Profile updated succesfully',
            updateUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong while calling update profile controller',
            error,
        })
    }
}

export const getOrderController = async (req, res) =>{
    try {
        const orders = await orderSchema.find({ buyer: req.user._id }).populate('products', '-photo').populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while get order api',
            error
        })
    }
}

export const getAllOrderController = async (req, res) =>{
    try {
        const orders = await orderSchema.find({}).populate('products', '-photo').populate("buyer", "name").sort({ createdAt: '-1' })
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while get all orders api',
            error
        })
    }
}

export const orderStatusController = async (req, res) =>{
    try {
        const {orderId} = req.params
        const {status} = req.body
        const orders = await orderSchema.findByIdAndUpdate(orderId, {status}, {new: true})
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating order status',
            error
        })
    }
}