import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlistItem } from '../store/slices/wishlistSlice';
import { getImageUrl } from '../utils/imageUrl';
import ProductCard from '../components/product/ProductCard';
import { FiShoppingCart, FiHeart, FiStar, FiMinus, FiPlus, FiChevronRight, FiUser, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, reviews, related, loading } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const { products: wishlistProducts } = useSelector((s) => s.wishlist);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const isWished = wishlistProducts?.some((p) => (p._id || p) === id);

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  if (loading || !product) {
    return (
      <div className="py-12 page-container">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-32" /><div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-6 w-48" /><div className="skeleton h-12 w-56" />
            <div className="skeleton h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const images = product.images?.length ? product.images : [];

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-dark-200 mb-8">
          <Link to="/" className="hover:text-white">Home</Link><FiChevronRight size={12} />
          <Link to="/products" className="hover:text-white">Products</Link><FiChevronRight size={12} />
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="glass-card overflow-hidden rounded-2xl mb-4">
              {images.length > 0 && getImageUrl(images[selectedImg]?.url) ? (
                <img src={getImageUrl(images[selectedImg]?.url)} alt={product.name} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-dark-700"><FiImage size={64} className="text-dark-400" /></div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImg ? 'border-neon-red' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-dark-200 text-sm uppercase tracking-wider mb-1">{product.brand}</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} size={16} className={s <= Math.round(product.ratings?.average || 0) ? 'star-filled fill-current' : 'star-empty'} />
                ))}
              </div>
              <span className="text-dark-200 text-sm">{product.ratings?.average?.toFixed(1) || '0.0'} ({product.ratings?.count || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold gradient-text">₹{price.toLocaleString()}</span>
              {discount > 0 && (
                <>
                  <span className="text-dark-300 text-lg line-through">₹{product.price.toLocaleString()}</span>
                  <span className="badge badge-green">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm mb-6 ${product.stock > 0 ? (product.stock <= 5 ? 'text-neon-orange' : 'text-neon-green') : 'text-neon-red'}`}>
              {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left!` : '✓ In Stock') : '✗ Out of Stock'}
            </p>

            {/* Category & Goal badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.category && <span className="badge badge-blue">{product.category.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</span>}
              {product.goal && <span className="badge badge-orange">{product.goal.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</span>}
            </div>

            {/* Quantity + Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center glass-card !rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 hover:bg-white/5"><FiMinus size={16} /></button>
                  <span className="w-12 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-3 hover:bg-white/5"><FiPlus size={16} /></button>
                </div>
                <button onClick={() => { if (!user) return toast.error('Please login'); dispatch(addToCart({ productId: product._id, quantity: qty })); toast.success('Added to cart!'); }} className="btn-primary flex-1 flex items-center justify-center gap-2 !py-3.5">
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
                <button onClick={() => { if (!user) return toast.error('Please login'); dispatch(toggleWishlistItem(product._id)); }} className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isWished ? 'bg-neon-red/10 border-neon-red text-neon-red' : 'border-white/10 text-dark-200 hover:text-neon-red hover:border-neon-red/30'}`}>
                  <FiHeart size={18} fill={isWished ? 'currentColor' : 'none'} />
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-white/10 mb-4">
              <div className="flex gap-6">
                {['description','nutrition','reviews'].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === t ? 'border-neon-red text-white' : 'border-transparent text-dark-200 hover:text-white'}`}>
                    {t} {t === 'reviews' && `(${reviews?.length || 0})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[120px]">
              {activeTab === 'description' && (
                <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-line">{product.description || 'No description available.'}</p>
              )}
              {activeTab === 'nutrition' && (
                product.nutritionDetails ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.nutritionDetails).map(([k, v]) => (
                      <div key={k} className="glass-card !rounded-xl p-3">
                        <p className="text-dark-200 text-xs capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="font-semibold">{v}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-dark-200 text-sm">No nutrition details available.</p>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews?.length ? reviews.map((r) => (
                    <div key={r._id} className="glass-card !rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center"><FiUser size={14} /></div>
                        <div>
                          <p className="text-sm font-semibold">{r.user?.name || 'User'}</p>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map((s) => <FiStar key={s} size={12} className={s <= r.rating ? 'star-filled fill-current' : 'star-empty'} />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-dark-200 text-sm">{r.comment}</p>
                    </div>
                  )) : <p className="text-dark-200 text-sm">No reviews yet.</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related?.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title">Related <span className="gradient-text">Products</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
