import jwt from 'jsonwebtoken'
import userSchema from '../models/userSchema.js'

// Protecting the routes with the token based
export const requireSignin = (req, res, next)=>{
    try {
        const decode = jwt.verify(req.headers.authorization, process.env.JWT_SCREATE)
        req.user = decode
        next()
    } catch (error) {
        console.log(error);
    }
}

export const isAdmin = async (req, res, next)=>{
    try {
        const user = await userSchema.findById(req.user._id)
        if(user.role !== 1){
            return res.status(401).send({
                success: false,
                message: 'unauthorized access'
            })
        }else{
            next()
        }
    } catch (error) {
        console.log(error);
    }
}