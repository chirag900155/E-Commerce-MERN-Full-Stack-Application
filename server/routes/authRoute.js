import express from 'express'
import { forgotPasswordController, getAllOrderController, getOrderController, loginController, orderStatusController, registerController, testRoute, updateProfileController } from '../controller/authController.js'
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js';

// Router object
const router = express.Router()

// Routing
// Register || Method post
router.post('/register', registerController);

// Login || Method post
router.post('/login', loginController)

// Forgot || Method post
router.post('/forgot-password', forgotPasswordController)

// This is the test route for middleware
router.get('/test', requireSignin, isAdmin ,testRoute)

// Protected route Auth
router.get('/user-auth', requireSignin, (req, res)=>{
    res.status(200).send({ ok: true })
})

// Protected route Admin
router.get('/admin-auth', requireSignin, isAdmin, (req, res)=>{
    res.status(200).send({ ok: true })
})

router.put('/profile', requireSignin, updateProfileController)

// Get the orders
router.get('/orders', requireSignin, getOrderController)

// All Orders
router.get('/all-orders', requireSignin, isAdmin, getAllOrderController)

// Order Status update
router.put('/order-status/:orderId', requireSignin, isAdmin, orderStatusController)

export default router