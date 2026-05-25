import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (new Date(coupon.expiryDate) < new Date()) return res.status(400).json({ success: false, message: 'Coupon has expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    if (coupon.singleUse && coupon.usedBy.includes(req.user._id)) return res.status(400).json({ success: false, message: 'You have already used this coupon' });
    if (orderTotal < coupon.minOrderValue) return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minOrderValue} required` });

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }
    discount = Math.min(discount, orderTotal);

    res.status(200).json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount } });
  } catch (error) { next(error); }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) { next(error); }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) { next(error); }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, coupon });
  } catch (error) { next(error); }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) { next(error); }
};

export const couponAnalytics = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    const analytics = { total: coupons.length, active: coupons.filter(c => c.isActive).length, expired: coupons.filter(c => new Date(c.expiryDate) < new Date()).length, totalUsage: coupons.reduce((acc, c) => acc + c.usedCount, 0) };
    res.status(200).json({ success: true, analytics, coupons });
  } catch (error) { next(error); }
};
