import productSchema from '../models/productSchema.js'
import categorySchema from '../models/categorySchema.js';
import fs from 'fs'
import slugify from 'slugify';
import braintree from 'braintree'
import orderSchema from '../models/orderSchema.js';
import dotenv from 'dotenv'

dotenv.config();

// Payment Gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHENT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createProduct = async (req, res)=>{
    try {
        const {name, slug, description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
    
        // Validation
        switch(true){
            case !name:
                return res.status(500).send({ error: 'Name is required' })
            
            case !description:
                return res.status(500).send({ error: 'Description is required' })
            
            case !price:
                return res.status(500).send({ error: 'Price is required' })
    
            case !category:
                return res.status(500).send({ error: 'Category is required' })
    
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' })
    
            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Phot is required and not greater than 1mb' })
        }
    
        const product = new productSchema({ ...req.fields, slug: slugify(name) })
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
    
        await product.save()
    
        res.status(200).send({
            success: true,
            message: "Product added succesfully",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went wrong while calling create product api',
            err: error.message
        })
    }
}

export const getProdcut = async (req, res)=>{
    try {
        const product = await productSchema.find({}).select("-photo").limit(12).sort({createdAt: -1}).populate('category')
        res.status(200).send({
            success: true,
            countTotal: product.length,
            message: 'product fetched succesfully',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong while calling get product api',
            err: error.message
        })
    }
}

export const getSingleProduct = async (req, res)=>{
    try {
        const product = await productSchema.findOne({slug: req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: 'Product finded succesfully',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong in get single product api calling',
            error
        })
    }
}

export const productPhotoController = async (req, res)=>{
    try {
        const product = await productSchema.findById(req.params.pid)
        if(product.photo.data){
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'something went wrong while calling product photo api',
            err: error.message
        })
    }
}

export const deleteProduct = async (req, res)=>{
    try {
        await productSchema.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: 'Product deleted succesfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message : 'something went wrong while calling product delete api',
            err: error.message
        })
    }
}

export const updateProduct = async (req, res)=>{
    try {
        const {name, slug, description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
    
        // Validation
        switch(true){
            case !name:
                return res.status(500).send({ error: 'Name is required' })
            
            case !description:
                return res.status(500).send({ error: 'Description is required' })
            
            case !price:
                return res.status(500).send({ error: 'Price is required' })
    
            case !category:
                return res.status(500).send({ error: 'Category is required' })
    
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' })
        }
    
        const product = await productSchema.findByIdAndUpdate(req.params.pid, 
        { ...req.fields, slug: slugify(name) }, {new: true})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
    
        await product.save()
    
        res.status(200).send({
            success: true,
            message: "Product Updated succesfully",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went wrong while calling Update product api',
            err: error.message
        })
    }
}

export const productFiltersController = async (req, res) =>{
    try {
        const {checked, radio} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const product = await productSchema.find(args)
        res.status(200).send({
            success: true,
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

export const productCountController = async (req, res)=>{
    try {
        const total = await productSchema.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong while calling the product count controller',
            error,
        })
    }
}

export const productListController = async (req, res) =>{
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const product = await productSchema.find({}).select("-photo").skip((page -1) * perPage).limit(perPage).sort({createdAt: -1})
        res.status(200).send({
            success: true,
            product
        })   
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong calling product list api',
            error
        })
    }
}

export const searchProductController = async (req, res)=>{

    try {
        const {keyword} = req.params
        const results = await productSchema.find({
            $or: [
                { name: {$regex: keyword, $options: "i"} },
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in search product api',
            error
        })
    }
}

export const relatedProductController = async (req, res) =>{
    try {
        const {pid, cid} = req.params
        const products = await productSchema.find({
            category: cid,
            _id: {$ne: pid}
        }).select('-photo').limit(3).populate('category')
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'While calling the related product api',
            error
        })
    }
}

// get product by category
export const productCategoryController = async (req, res) =>{
    try {
        const category = await categorySchema.findOne({slug: req.params.slug})
        const products = await productSchema.find({category}).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while calling product category controller api'
        })
    }
}

export const braintreeTokenController = async (req, res) =>{
    try {
        gateway.clientToken.generate({}, function(err, response) {
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// Payment
export const braintreePaymentController = async (req, res) =>{
    try {
        const { cart, nonce } = req.body
        let total = 0
        cart.map((i) => {
            total += i.price
        })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options:{
                submitForSettlement: true
            }
        },
        function(err, result){
            if(result){
                const order = new orderSchema({
                    products: cart,
                    payment: result,
                    buyer: req.user._id,
                }).save()
                res.json({ ok: true })
            }else{
                res.status(500).send(err)
            }
        }
        )
    } catch (error) {
        console.log(error);
    }
}