import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiX, FiTag, FiAlertTriangle } from 'react-icons/fi';
import API from '../../store/api/axiosInstance';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxDiscount: '', expiryDate: '', usageLimit: '' });

  const load = async () => {
    try { const res = await API.get('/coupons'); setCoupons(res.data.coupons || []); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/coupons', form);
      toast.success('Coupon created!');
      setShowForm(false);
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxDiscount: '', expiryDate: '', usageLimit: '' });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    try { await API.delete(`/coupons/${id}`); toast.success('Deleted'); setDeleteConfirm(null); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="py-8 fade-in">
      <div className="page-container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold">Manage <span className="gradient-text">Coupons</span></h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            {showForm ? <><FiX size={16} /> Cancel</> : <><FiPlus size={16} /> Add Coupon</>}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 mb-8 slide-up">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Code *</label>
                  <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field" placeholder="SAVE20" />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-field">
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Value *</label>
                  <input type="number" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="input-field" placeholder={form.discountType === 'percentage' ? '20' : '500'} />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Min Order (₹)</label>
                  <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className="input-field" placeholder="999" />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className="input-field" placeholder="500" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Expiry Date *</label>
                  <input type="date" required value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Max Uses</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="input-field" placeholder="100" />
                </div>
              </div>
              <button type="submit" className="btn-primary">Create Coupon</button>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)
          ) : coupons.length === 0 ? (
            <div className="text-center py-16 text-dark-200"><FiTag size={32} className="mx-auto mb-2" />No coupons yet</div>
          ) : (
            coupons.map((c) => (
              <div key={c._id} className="glass-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-red/20 to-neon-orange/20 flex items-center justify-center">
                    <FiTag size={20} className="text-neon-red" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-lg">{c.code}</p>
                    <p className="text-dark-200 text-xs">
                      {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                      {c.minOrderValue > 0 && ` · Min ₹${c.minOrderValue}`}
                      {c.expiryDate && ` · Expires ${new Date(c.expiryDate).toLocaleDateString('en-IN')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${c.isActive ? 'badge-green' : 'badge-red'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                  <span className="text-dark-200 text-xs">{c.usedCount || 0} used</span>
                  {deleteConfirm === c._id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-neon-orange text-xs flex items-center gap-1"><FiAlertTriangle size={12} /></span>
                      <button onClick={() => handleDelete(c._id)} className="text-xs bg-neon-red/20 text-neon-red hover:bg-neon-red/30 px-3 py-1.5 rounded-lg transition-colors font-semibold">Yes</button>
                      <button onClick={() => setDeleteConfirm(null)} className="text-xs bg-white/5 text-dark-100 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(c._id)} className="text-dark-300 hover:text-neon-red transition-colors"><FiTrash2 size={16} /></button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
