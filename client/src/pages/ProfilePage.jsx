import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, addAddress, deleteAddress } from '../store/slices/authSlice';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [addrForm, setAddrForm] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '' });
  const [showAddrForm, setShowAddrForm] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile(form));
    toast.success('Profile updated!');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    dispatch(addAddress(addrForm));
    setAddrForm({ label: 'Home', street: '', city: '', state: '', pincode: '' });
    setShowAddrForm(false);
    toast.success('Address added!');
  };

  return (
    <div className="py-8 fade-in">
      <div className="page-container max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-8">My <span className="gradient-text">Profile</span></h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {['profile', 'addresses'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pb-3 text-sm font-medium border-b-2 capitalize transition-colors ${tab === t ? 'border-neon-red text-white' : 'border-transparent text-dark-200 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center text-2xl font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-heading text-xl font-bold">{user?.name}</p>
                <p className="text-dark-200 text-sm">{user?.email}</p>
                <span className="badge badge-blue text-xs mt-1">{user?.role}</span>
              </div>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', icon: FiUser, type: 'text' },
                { key: 'email', label: 'Email', icon: FiMail, type: 'email' },
                { key: 'phone', label: 'Phone', icon: FiPhone, type: 'tel' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-sm text-dark-100 mb-1.5 block">{f.label}</label>
                  <div className="relative">
                    <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
                    <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="input-field !pl-11" />
                  </div>
                </div>
              ))}
              <button type="submit" className="btn-primary flex items-center gap-2">
                <FiSave size={16} /> Save Changes
              </button>
            </form>
          </div>
        )}

        {tab === 'addresses' && (
          <div className="space-y-4">
            {user?.addresses?.map((a) => (
              <div key={a._id} className="glass-card p-5 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FiMapPin size={18} className="text-neon-red mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="badge badge-blue text-xs mb-1">{a.label}</span>
                    <p className="text-sm">{a.street}</p>
                    <p className="text-dark-200 text-sm">{a.city}, {a.state} - {a.pincode}</p>
                  </div>
                </div>
                <button onClick={() => { dispatch(deleteAddress(a._id)); toast.success('Address removed'); }} className="text-dark-300 hover:text-neon-red transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            {showAddrForm ? (
              <form onSubmit={handleAddAddress} className="glass-card p-6 space-y-4">
                <h3 className="font-semibold">Add New Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} className="input-field">
                    <option>Home</option><option>Work</option><option>Other</option>
                  </select>
                  <input required value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} className="input-field" placeholder="Pincode" />
                </div>
                <input required value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} className="input-field" placeholder="Street address" />
                <div className="grid grid-cols-2 gap-4">
                  <input required value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="input-field" placeholder="City" />
                  <input required value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="input-field" placeholder="State" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAddrForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Save Address</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowAddrForm(true)} className="btn-secondary w-full flex items-center justify-center gap-2 !py-3">
                <FiPlus size={16} /> Add New Address
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
