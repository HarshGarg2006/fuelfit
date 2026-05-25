import express from 'express';
import { validateCoupon, createCoupon, getCoupons, updateCoupon, deleteCoupon, couponAnalytics } from '../controllers/couponController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();
router.post('/validate', protect, validateCoupon);
router.get('/analytics', protect, isAdmin, couponAnalytics);
router.post('/', protect, isAdmin, createCoupon);
router.get('/', protect, isAdmin, getCoupons);
router.put('/:id', protect, isAdmin, updateCoupon);
router.delete('/:id', protect, isAdmin, deleteCoupon);

export default router;
