import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,45,45,0.06),transparent_70%)]" />
      <div className="glass-card w-full max-w-md p-8 md:p-10 relative z-10 fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center mx-auto mb-4">
            <FiZap size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Welcome Back</h1>
          <p className="text-dark-200 text-sm mt-1">Sign in to your FuelFit account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          <div>
            <label className="text-sm text-dark-100 mb-1.5 block">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field !pl-11" placeholder="you@example.com" id="login-email" />
            </div>
          </div>
          <div>
            <label className="text-sm text-dark-100 mb-1.5 block">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
              <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field !pl-11 !pr-11" placeholder="••••••••" id="login-password" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-200 hover:text-white transition-colors">
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-neon-red hover:text-neon-orange transition-colors">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base" id="login-submit">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</span> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-dark-200 mt-6">
          Don't have an account? <Link to="/signup" className="text-neon-red hover:text-neon-orange transition-colors font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
