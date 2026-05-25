import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const statusColor = {
  Processing: 'badge-orange',
  Shipped: 'badge-blue',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
};

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (!loading && orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 fade-in">
        <div className="text-center">
          <FiShoppingBag size={64} className="text-dark-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-dark-200 mb-6">Start shopping to see your orders here.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 fade-in">
      <div className="page-container max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-8">My <span className="gradient-text">Orders</span></h1>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
          ) : (
            orders.map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`} className="glass-card-hover p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0">
                  <FiPackage size={20} className="text-neon-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-sm">Order #{order._id?.slice(-8).toUpperCase()}</p>
                    <span className={`badge ${statusColor[order.orderStatus] || 'badge-blue'} text-xs`}>{order.orderStatus}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-dark-200">
                    <span>{order.orderItems?.length || 0} items</span>
                    <span>₹{order.totalPrice?.toLocaleString()}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <FiChevronRight size={18} className="text-dark-300 group-hover:text-neon-red transition-colors" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
