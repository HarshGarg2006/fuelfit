import express from 'express';
import { createRazorpayOrder, verifyPayment, webhookHandler } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;
