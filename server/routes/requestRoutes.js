import express from 'express';
import { submitRequest, getRequests, updateRequestStatus, deleteRequest } from '../controllers/requestController.js';
import { protect, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.post('/', upload.single('image'), submitRequest);
router.get('/', protect, isAdmin, getRequests);
router.put('/:id', protect, isAdmin, updateRequestStatus);
router.delete('/:id', protect, isAdmin, deleteRequest);

export default router;
