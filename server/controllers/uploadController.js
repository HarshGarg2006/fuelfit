import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const images = [];

    for (const file of req.files) {
      const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadsDir, uniqueName);

      // Write buffer to file
      fs.writeFileSync(filePath, file.buffer);

      // Build the URL path that will be served statically
      const url = `/uploads/products/${uniqueName}`;
      images.push({ url, publicId: uniqueName });
    }

    res.status(200).json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'No publicId provided' });
    }

    const filePath = path.join(uploadsDir, publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};
