import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../store/api/axiosInstance';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiBox, FiTag, FiMessageSquare, FiTruck, FiArrowRight } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data.stats || res.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'from-green-500 to-emerald-600', link: '/admin/orders' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiPackage, color: 'from-blue-500 to-cyan-600', link: '/admin/orders' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: FiShoppingBag, color: 'from-purple-500 to-pink-600', link: '/admin/products' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'from-orange-500 to-red-600', link: '/admin/users' },
  ];

  const quickLinks = [
    { label: 'Products', icon: FiBox, link: '/admin/products', desc: 'Add, edit, delete products' },
    { label: 'Orders', icon: FiPackage, link: '/admin/orders', desc: 'Manage order statuses' },
    { label: 'Coupons', icon: FiTag, link: '/admin/coupons', desc: 'Create discount codes' },
    { label: 'Requests', icon: FiMessageSquare, link: '/admin/requests', desc: 'Customer product requests' },
    { label: 'Users', icon: FiUsers, link: '/admin/users', desc: 'View all users' },
    { label: 'Delivery', icon: FiTruck, link: '/admin/delivery', desc: 'Configure delivery charges' },
  ];

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Admin <span className="gradient-text">Dashboard</span></h1>
            <p className="text-dark-200 text-sm mt-1">Welcome back, here's your store overview</p>
          </div>
          <div className="badge badge-red"><FiTrendingUp size={14} className="mr-1" /> Live</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)
          ) : (
            cards.map((c) => (
              <Link key={c.label} to={c.link} className="glass-card-hover p-5 group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                  <c.icon size={20} className="text-white" />
                </div>
                <p className="text-dark-200 text-xs uppercase tracking-wider">{c.label}</p>
                <p className="font-heading text-2xl font-bold mt-1">{c.value}</p>
              </Link>
            ))
          )}
        </div>

        {/* Recent orders preview */}
        {stats?.recentOrders?.length > 0 && (
          <div className="glass-card p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm text-dark-200 hover:text-neon-red flex items-center gap-1">View All <FiArrowRight size={14} /></Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-dark-200 text-xs uppercase border-b border-white/10">
                    <th className="text-left py-3 px-2">Order ID</th>
                    <th className="text-left py-3 px-2">Customer</th>
                    <th className="text-left py-3 px-2">Total</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.slice(0, 5).map((o) => (
                    <tr key={o._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2 font-mono text-xs">#{o._id?.slice(-8).toUpperCase()}</td>
                      <td className="py-3 px-2">{o.user?.name || 'N/A'}</td>
                      <td className="py-3 px-2 font-semibold">₹{o.totalPrice?.toLocaleString()}</td>
                      <td className="py-3 px-2"><span className={`badge text-xs ${o.orderStatus === 'Delivered' ? 'badge-green' : o.orderStatus === 'Shipped' ? 'badge-blue' : 'badge-orange'}`}>{o.orderStatus}</span></td>
                      <td className="py-3 px-2 text-dark-200">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick links */}
        <h3 className="font-heading text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickLinks.map((q) => (
            <Link key={q.label} to={q.link} className="glass-card-hover p-5 group">
              <q.icon size={24} className="text-neon-red mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-sm">{q.label}</p>
              <p className="text-dark-200 text-xs mt-1">{q.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
