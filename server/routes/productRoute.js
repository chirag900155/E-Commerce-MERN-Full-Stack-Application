import express from 'express'
import { isAdmin, requireSignin } from '../middleware/authMiddleware.js'
import { braintreePaymentController, braintreeTokenController, createProduct, deleteProduct, getProdcut, getSingleProduct, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProduct } from '../controller/productController.js'
import formidable from 'express-formidable'

const router = express.Router()

// Calling all the routes of the product router

// Creating product route
router.post('/create-product', requireSignin, isAdmin, formidable(), createProduct)

// Getting all product route
router.get('/get-product', getProdcut)

// Get single product
router.get('/get-product/:slug', getSingleProduct)

// Get product photo
router.get('/product-photo/:pid', productPhotoController)

// Delete product 
router.delete('/product/:pid', deleteProduct)

// Update product
router.put('/update-product/:pid', requireSignin, isAdmin, formidable(), updateProduct)

// filter products 
router.post('/product-filters', productFiltersController)

// Product count
router.get('/product-count', productCountController)

// Prodcut list
router.get('/product-list/:page', productListController)

// Search product
router.get('/search-product/:keyword', searchProductController)

//Similar product 
router.get('/related-product/:pid/:cid', relatedProductController)

// Find product by category
router.get('/product-category/:slug', productCategoryController)

//Payments route
//token
router.get('/braintree/token', braintreeTokenController)

//Payments
router.post('/braintree/payment', requireSignin, braintreePaymentController)


export default router