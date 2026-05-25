import express from 'express';
import { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/admin/all', isAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', isAdmin, updateOrderStatus);

export default router;
