import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import DeliveryConfig from '../models/DeliveryConfig.js';
import { haversineDistance } from '../utils/distanceCalculator.js';

export const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentInfo, couponCode, deliveryPrice = 0 } = req.body;

    // COD Distance restriction check (Max 20km)
    if (paymentInfo && paymentInfo.method === 'cod') {
      if (!shippingAddress || !shippingAddress.lat || !shippingAddress.lng) {
        return res.status(400).json({
          success: false,
          message: 'Live location coordinates are required for Cash on Delivery (COD) orders.'
        });
      }
      
      const config = await DeliveryConfig.getConfig();
      const distance = haversineDistance(
        config.storeLocation.lat,
        config.storeLocation.lng,
        shippingAddress.lat,
        shippingAddress.lng
      );
      
      if (distance > 20) {
        return res.status(400).json({
          success: false,
          message: `Cash on Delivery (COD) is only available within 20 km of our store. Your location is ${Math.round(distance * 10) / 10} km away.`
        });
      }
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ success: false, message: 'Cart is empty' });

    const items = cart.items.map(item => ({
      product: item.product._id, name: item.product.name, brand: item.product.brand,
      price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
      quantity: item.quantity, image: item.product.images[0]?.url || '',
    }));

    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = 0; // Tax is 0 (removed extra 18% GST added on top)
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((itemsPrice * coupon.discountValue) / 100);
          if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        } else { discountAmount = coupon.discountValue; }
        discountAmount = Math.min(discountAmount, itemsPrice);
        coupon.usedCount += 1;
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }

    const totalPrice = itemsPrice + taxPrice + deliveryPrice - discountAmount;

    const order = await Order.create({
      user: req.user._id, items, shippingAddress, paymentInfo,
      itemsPrice, taxPrice, deliveryPrice, discountAmount, couponCode, totalPrice,
    });

    // Update stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, order });
  } catch (error) { next(error); }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    if (req.body.status) {
      order.orderStatus = req.body.status;
      if (req.body.status === 'delivered') order.deliveredAt = Date.now();
    }
    
    if (req.body.paymentStatus) {
      order.paymentInfo.status = req.body.paymentStatus;
    }
    
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) { next(error); }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const totalRevenue = await Order.aggregate([{ $match: { 'paymentInfo.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
    res.status(200).json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)), revenue: totalRevenue[0]?.total || 0 });
  } catch (error) { next(error); }
};
