import express from 'express';
import { isAdmin, requireSignin } from './../middleware/authMiddleware.js';
import { createCategoryController, deleteCategory, getAllCategory, getSingleCategory, updateCategoryController } from '../controller/CategoryController.js';

const router = express.Router();

// Routes

// Create Category
router.post('/create-category', requireSignin, isAdmin, createCategoryController);

// Update Category
router.put('/update-category/:id', requireSignin, isAdmin, updateCategoryController);

// Get all category
router.get('/get-category', getAllCategory)

// Get a Single Category
router.get('/single-category/:slug', getSingleCategory)

// Delete a category
router.delete('/deleteing-category/:id', requireSignin, isAdmin, deleteCategory)

export default router;