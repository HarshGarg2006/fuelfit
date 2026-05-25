import express from 'express';
import { uploadImages, deleteImage } from '../controllers/uploadController.js';
import { protect, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.post('/', protect, isAdmin, upload.array('images', 5), uploadImages);
router.delete('/', protect, isAdmin, deleteImage);

export default router;
