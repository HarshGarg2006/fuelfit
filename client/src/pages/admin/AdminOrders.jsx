import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../store/api/axiosInstance';

const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColor = { Processing: 'badge-orange', Shipped: 'badge-blue', Delivered: 'badge-green', Cancelled: 'badge-red' };

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchAllOrders({})); }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      toast.success(`Order ${status.toLowerCase()}`);
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handlePaymentStatusChange = async (id, paymentStatus) => {
    try {
      await API.put(`/orders/${id}/status`, { paymentStatus });
      dispatch(fetchAllOrders({}));
      toast.success('Payment marked as paid!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        <h1 className="font-heading text-3xl font-bold mb-8">Manage <span className="gradient-text">Orders</span></h1>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-200 text-xs uppercase border-b border-white/10 bg-dark-800/50">
                  <th className="text-left py-4 px-4">Order ID</th>
                  <th className="text-left py-4 px-4">Customer</th>
                  <th className="text-left py-4 px-4">Items</th>
                  <th className="text-left py-4 px-4">Total</th>
                  <th className="text-left py-4 px-4">Payment</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-left py-4 px-4">Date</th>
                  <th className="text-left py-4 px-4">Update</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={8} className="py-4 px-4"><div className="skeleton h-10 rounded-lg" /></td></tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-dark-200"><FiPackage size={32} className="mx-auto mb-2" />No orders yet</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono text-xs">#{o._id?.slice(-8).toUpperCase()}</td>
                      <td className="py-3 px-4">{o.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{o.orderItems?.length || 0}</td>
                      <td className="py-3 px-4 font-semibold">₹{o.totalPrice?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={o.paymentInfo?.status === 'paid' ? 'text-neon-green font-semibold' : 'text-neon-orange'}>
                          {o.paymentInfo?.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                        {o.paymentInfo?.upiTransactionId && (
                          <div className="text-[10px] text-dark-300 font-mono mt-1">
                            UTR: {o.paymentInfo.upiTransactionId}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4"><span className={`badge text-xs ${statusColor[o.orderStatus] || 'badge-blue'}`}>{o.orderStatus}</span></td>
                      <td className="py-3 px-4 text-dark-200 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="input-field !py-1.5 !px-2 text-xs !w-auto" disabled={o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled'}>
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {o.paymentInfo?.status !== 'paid' && (
                            <button onClick={() => handlePaymentStatusChange(o._id, 'paid')} className="btn-secondary !py-1 !px-2 text-[10px] w-fit text-neon-green border-neon-green/30 hover:bg-neon-green/10 mt-1 font-semibold transition-colors">
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
