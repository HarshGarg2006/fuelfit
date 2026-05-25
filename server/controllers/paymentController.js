import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import Order from '../models/Order.js';

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const options = { amount: Math.round(amount * 100), currency: 'INR', receipt: `order_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) { next(error); }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(sign).digest('hex');
    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    res.status(200).json({ success: true, message: 'Payment verified', paymentId: razorpay_payment_id });
  } catch (error) { next(error); }
};

export const webhookHandler = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expectedSignature === signature) {
      const event = req.body.event;
      if (event === 'payment.captured') {
        const paymentId = req.body.payload.payment.entity.id;
        const orderId = req.body.payload.payment.entity.order_id;
        await Order.findOneAndUpdate({ 'paymentInfo.razorpayOrderId': orderId }, { 'paymentInfo.status': 'paid', 'paymentInfo.razorpayPaymentId': paymentId });
      }
    }
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(200).json({ status: 'ok' });
  }
};
