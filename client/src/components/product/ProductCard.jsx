import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlistItem } from '../../store/slices/wishlistSlice';
import { getProductImage } from '../../utils/imageUrl';
import { FiShoppingCart, FiHeart, FiStar, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products: wishlistProducts } = useSelector((state) => state.wishlist);
  const isWished = wishlistProducts?.some((p) => (p._id || p) === product._id);

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (product.stock <= 0) { toast.error('Product is out of stock'); return; }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success('Added to cart!');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    dispatch(toggleWishlistItem(product._id));
    toast.success(isWished ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <Link to={`/products/${product._id}`} className="glass-card-hover group overflow-hidden flex flex-col" id={`product-${product._id}`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-dark-700">
        {getProductImage(product) ? (
          <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><FiImage size={40} className="text-dark-400" /></div>
        )}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 badge badge-red text-xs">{discountPercent}% OFF</span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="badge badge-red text-sm">Out of Stock</span></div>
        )}
        <button onClick={handleWishlist} className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isWished ? 'bg-neon-red text-white' : 'bg-black/50 hover:bg-neon-red/80 text-white'}`}>
          <FiHeart size={16} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-dark-200 text-xs uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-neon-red transition-colors">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar key={star} size={13} className={star <= Math.round(product.ratings?.average || 0) ? 'star-filled fill-current' : 'star-empty'} />
          ))}
          <span className="text-dark-200 text-xs ml-1">({product.ratings?.count || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <span className="text-lg font-bold gradient-text">₹{effectivePrice.toLocaleString()}</span>
          {product.discountPrice > 0 && (
            <span className="text-dark-300 text-sm line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        {/* Stock + Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs ${product.stock > 0 ? (product.stock <= 5 ? 'text-neon-orange' : 'text-neon-green') : 'text-neon-red'}`}>
            {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock') : 'Out of Stock'}
          </span>
          <button onClick={handleAddToCart} disabled={product.stock <= 0} className="btn-primary !py-2 !px-3 text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
            <FiShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </Link>
  );
}
