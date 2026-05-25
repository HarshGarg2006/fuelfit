import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories, getAdminProducts } from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();
router.get('/categories', getCategories);
router.get('/admin/all', protect, isAdmin, getAdminProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

export default router;
