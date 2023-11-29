import slugify from "slugify";
import categorySchema from '../models/categorySchema.js'


// Creating category 
export const createCategoryController = async (req, res)=>{
    try {
        const {name} = req.body
        if(!name){
            return res.status(400).send({
                success: false,
                message: 'Please enter the name of the category'
            })
        }

        const existingCategory = await categorySchema.findOne({name})
        if(existingCategory){
            return res.status(400).send({
                success: false,
                message: 'Category is already present'
            })
        }

        const category = await new categorySchema({name: name, slug: slugify(name)}).save()
        res.status(200).send({
            success: true,
            message: 'Category created succesfully',
            category  
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error,
            message: 'Error from the create category controller'
        })
    }
}

// Updating Category
export const updateCategoryController = async (req, res)=>{
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categorySchema.findByIdAndUpdate(id,{name, slug:slugify(name)}, {new: true})
        res.status(200).send({
            success: true,
            category,
            message: 'Category updated succesfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error,
            message: 'Something went wrong in the updating category'
        })
    }
}

// Get all the category
export const getAllCategory = async (req, res)=>{
    try {
        const category = await categorySchema.find({})
        res.status(200).send({
            success: true,
            message: 'All the categorys',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Something went wrong in the get all category'
        })
    }
}

export const getSingleCategory = async (req, res)=>{
    try {
        const category = await categorySchema.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: 'Category finded succesfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while calling in single category',
            error
        })
    }
}

export const deleteCategory = async (req, res)=>{
    try {
        const {id} = req.params
        await categorySchema.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'Category is deleted succesfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while calling in delete category',
            error
        })
    }
}