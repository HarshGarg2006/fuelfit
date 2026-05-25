import express from 'express';
import { getDashboardStats, getAllUsers } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, isAdmin);
router.get('/dashboard', getDashboardStats);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);

export default router;
