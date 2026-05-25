import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../store/slices/cartSlice';
import { getImageUrl } from '../utils/imageUrl';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.cart);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const subtotal = items.reduce((sum, item) => {
    const p = item.product;
    const price = p?.discountPrice > 0 ? p.discountPrice : p?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 fade-in">
        <div className="text-center">
          <FiShoppingBag size={64} className="text-dark-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-dark-200 mb-6">Looks like you haven't added any supplements yet.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">Shop Now <FiArrowRight /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        <h1 className="font-heading text-3xl font-bold mb-8">Shopping <span className="gradient-text">Cart</span></h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const p = item.product;
              if (!p) return null;
              const price = p.discountPrice > 0 ? p.discountPrice : p.price;
              return (
                <div key={item._id} className="glass-card p-4 flex gap-4">
                  <Link to={`/products/${p._id}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-dark-700">
                    {getImageUrl(p.images?.[0]?.url) ? (
                      <img src={getImageUrl(p.images[0].url)} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><FiImage size={24} className="text-dark-400" /></div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${p._id}`} className="font-semibold text-sm hover:text-neon-red transition-colors line-clamp-2">{p.name}</Link>
                    <p className="text-dark-200 text-xs mt-0.5">{p.brand}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center glass-card !rounded-lg overflow-hidden">
                        <button onClick={() => { if (item.quantity <= 1) { dispatch(removeCartItem(item._id)); toast.success('Removed'); } else dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 })); }} className="px-2.5 py-1.5 hover:bg-white/5"><FiMinus size={14} /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))} className="px-2.5 py-1.5 hover:bg-white/5"><FiPlus size={14} /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold gradient-text">₹{(price * item.quantity).toLocaleString()}</span>
                        <button onClick={() => { dispatch(removeCartItem(item._id)); toast.success('Removed'); }} className="text-dark-300 hover:text-neon-red transition-colors"><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }} className="text-sm text-dark-200 hover:text-neon-red transition-colors">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="glass-card p-6 h-fit sticky top-24">
            <h3 className="font-heading text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-dark-200">Subtotal ({items.length} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-dark-200">Delivery</span><span className="text-neon-green text-xs">Calculated at checkout</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span className="gradient-text">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 text-base">
              Proceed to Checkout <FiArrowRight />
            </Link>
            <Link to="/products" className="block text-center text-sm text-dark-200 hover:text-white mt-4 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
