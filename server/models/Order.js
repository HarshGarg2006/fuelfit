import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  brand: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: String,
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: Number,
    lng: Number,
  },
  paymentInfo: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    upiTransactionId: String,
    method: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  itemsPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  deliveryPrice: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: String,
  totalPrice: { type: Number, required: true, default: 0 },
  orderStatus: {
    type: String,
    enum: ['confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed',
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

export default mongoose.model('Order', orderSchema);
