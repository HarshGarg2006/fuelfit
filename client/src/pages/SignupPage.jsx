import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password }));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="glass-card w-full max-w-md p-8 md:p-10 fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center mx-auto mb-4">
            <FiZap size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Create Account</h1>
          <p className="text-dark-200 text-sm mt-1">Join FuelFit and start your fitness journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
          {[
            { key: 'name', label: 'Full Name', type: 'text', Icon: FiUser, ph: 'John Doe' },
            { key: 'email', label: 'Email', type: 'email', Icon: FiMail, ph: 'you@example.com' },
            { key: 'phone', label: 'Phone', type: 'tel', Icon: FiPhone, ph: '+91 9876543210' },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm text-dark-100 mb-1.5 block">{f.label}</label>
              <div className="relative">
                <f.Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
                <input type={f.type} required value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="input-field !pl-11" placeholder={f.ph} id={`signup-${f.key}`} />
              </div>
            </div>
          ))}
          <div>
            <label className="text-sm text-dark-100 mb-1.5 block">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
              <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field !pl-11 !pr-11" placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-200 hover:text-white">
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-dark-100 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
              <input type={showPass ? 'text' : 'password'} required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="input-field !pl-11" placeholder="Repeat password" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-dark-200 mt-6">
          Already have an account? <Link to="/login" className="text-neon-red font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
