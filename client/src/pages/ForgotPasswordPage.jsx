import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearMessage } from '../store/slices/authSlice';
import { FiMail, FiZap, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);
  useEffect(() => () => dispatch(clearMessage()), [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="glass-card w-full max-w-md p-8 md:p-10 fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center mx-auto mb-4">
            <FiZap size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Forgot Password</h1>
          <p className="text-dark-200 text-sm mt-1">Enter your email to receive a reset link</p>
        </div>
        {message ? (
          <div className="text-center py-8">
            <FiCheckCircle size={48} className="text-neon-green mx-auto mb-4" />
            <p className="text-neon-green font-semibold mb-2">Email Sent!</p>
            <p className="text-dark-200 text-sm mb-6">{message}</p>
            <Link to="/login" className="btn-secondary inline-flex items-center gap-2"><FiArrowLeft /> Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field !pl-11" placeholder="you@example.com" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-dark-200 hover:text-white transition-colors">
              <FiArrowLeft size={14} /> Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
