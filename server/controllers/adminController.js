import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import ProductRequest from '../models/ProductRequest.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['confirmed', 'packed'] } });
    const pendingRequests = await ProductRequest.countDocuments({ status: 'pending' });
    const lowStock = await Product.countDocuments({ stock: { $lte: 5 }, isActive: true });

    const revenueAgg = await Order.aggregate([{ $match: { 'paymentInfo.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Monthly sales for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, 'paymentInfo.status': 'paid' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

    res.status(200).json({ success: true, stats: { totalUsers, totalProducts, totalOrders, pendingOrders, pendingRequests, lowStock, totalRevenue, monthlySales, recentOrders } });
  } catch (error) { next(error); }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) { next(error); }
};
