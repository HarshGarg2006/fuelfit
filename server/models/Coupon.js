import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please enter coupon code'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: [true, 'Please select discount type'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Please enter discount value'],
    min: [0, 'Discount value cannot be negative'],
  },
  minOrderValue: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    default: null,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please enter expiry date'],
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  singleUse: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

couponSchema.index({ code: 1 });

export default mongoose.model('Coupon', couponSchema);
