import mongoose from 'mongoose';

const productRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  productName: {
    type: String,
    required: [true, 'Please enter the product name'],
    trim: true,
  },
  brandName: {
    type: String,
    required: [true, 'Please enter the brand name'],
    trim: true,
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
  },
  status: {
    type: String,
    enum: ['pending', 'available-soon', 'out-of-stock', 'not-available'],
    default: 'pending',
  },
  image: {
    type: String,
    default: null,
  },
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ProductRequest', productRequestSchema);
