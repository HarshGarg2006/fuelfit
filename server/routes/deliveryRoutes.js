import express from 'express';
import { calculateDelivery, getDeliveryConfig, updateDeliveryConfig } from '../controllers/deliveryController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();
router.post('/calculate', calculateDelivery);
router.get('/config', protect, isAdmin, getDeliveryConfig);
router.put('/config', protect, isAdmin, updateDeliveryConfig);

export default router;
