import ProductRequest from '../models/ProductRequest.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads', 'requests');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const submitRequest = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.user) data.user = req.user._id;

    // Handle image upload if present
    if (req.file) {
      const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1e6)}${path.extname(req.file.originalname)}`;
      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, req.file.buffer);
      data.image = `/uploads/requests/${uniqueName}`;
    }

    const request = await ProductRequest.create(data);
    res.status(201).json({ success: true, request, message: 'Request submitted! We will get back to you soon.' });
  } catch (error) { next(error); }
};

export const getRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const requests = await ProductRequest.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) { next(error); }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const request = await ProductRequest.findByIdAndUpdate(req.params.id, { status: req.body.status, adminNotes: req.body.adminNotes }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ success: true, request });
  } catch (error) { next(error); }
};

export const deleteRequest = async (req, res, next) => {
  try {
    await ProductRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Request deleted' });
  } catch (error) { next(error); }
};
