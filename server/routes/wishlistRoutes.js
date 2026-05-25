import express from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', getWishlist);
router.post('/:productId', toggleWishlist);

export default router;
