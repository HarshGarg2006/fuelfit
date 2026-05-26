import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../store/slices/orderSlice';
import { getImageUrl } from '../utils/imageUrl';
import { FiPackage, FiMapPin, FiCreditCard, FiChevronRight, FiCheckCircle, FiTruck, FiClock, FiImage } from 'react-icons/fi';

const statusSteps = ['confirmed', 'packed', 'shipped', 'delivered'];
const statusLabels = {
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};
const statusIcons = { 
  confirmed: FiClock, 
  packed: FiPackage, 
  shipped: FiTruck, 
  delivered: FiCheckCircle 
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [dispatch, id]);

  if (!order) {
    return <div className="py-12 page-container"><div className="skeleton h-96 rounded-2xl" /></div>;
  }

  const isCancelled = order.orderStatus === 'cancelled';
  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="py-8 fade-in">
      <div className="page-container max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-dark-200 mb-8">
          <Link to="/orders" className="hover:text-white">Orders</Link><FiChevronRight size={12} />
          <span className="text-white">#{order._id?.slice(-8).toUpperCase()}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl font-bold">Order <span className="gradient-text">Details</span></h1>
          <span className="text-dark-200 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {/* Status tracker */}
        <div className="glass-card p-6 mb-6">
          {isCancelled ? (
            <div className="text-center py-2 text-neon-red font-semibold flex items-center justify-center gap-2">
              <FiCheckCircle size={20} className="rotate-45" /> This order has been cancelled.
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {statusSteps.map((s, i) => {
                const Icon = statusIcons[s];
                const active = i <= currentStep;
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-neon-green/20 text-neon-green' : 'bg-dark-600 text-dark-300'}`}>
                        <Icon size={18} />
                      </div>
                      <span className={`text-xs mt-2 ${active ? 'text-white' : 'text-dark-300'}`}>{statusLabels[s]}</span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-neon-green' : 'bg-dark-600'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold mb-4 flex items-center gap-2"><FiPackage size={18} className="text-neon-red" /> Items</h3>
          <div className="space-y-3">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0">
                  {getImageUrl(item.image) ? (
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FiImage size={20} className="text-dark-400" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-dark-200 text-xs">{item.brand} · Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-bold mb-3 flex items-center gap-2"><FiMapPin size={18} className="text-neon-red" /> Shipping</h3>
            <p className="text-sm text-dark-200">{order.shippingAddress?.street}</p>
            <p className="text-sm text-dark-200">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
            <p className="text-sm text-dark-200">{order.shippingAddress?.pincode}</p>
          </div>

          {/* Payment */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-bold mb-3 flex items-center gap-2"><FiCreditCard size={18} className="text-neon-red" /> Payment</h3>
            <p className="text-sm uppercase font-semibold">{order.paymentInfo?.method === 'upi' ? 'Online Payment (UPI)' : 'Cash on Delivery (COD)'}</p>
            <p className={`text-sm my-1 ${order.paymentInfo?.status === 'paid' ? 'text-neon-green font-bold' : 'text-neon-orange'}`}>
              {order.paymentInfo?.status === 'paid' ? '✓ Paid' : '⏳ Pending Verification'}
            </p>
            {order.paymentInfo?.upiTransactionId && (
              <p className="text-xs text-dark-200 mt-2 font-mono">
                UTR: {order.paymentInfo.upiTransactionId}
              </p>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="glass-card p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-dark-200">Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-dark-200">Delivery</span><span>₹{order.deliveryPrice?.toLocaleString() || '0'}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-neon-green">Discount</span><span className="text-neon-green">-₹{order.discount?.toLocaleString()}</span></div>}
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span className="gradient-text">₹{order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
