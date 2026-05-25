import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/product/ProductCard';
import { FiHeart } from 'react-icons/fi';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((s) => s.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 fade-in">
        <div className="text-center">
          <FiHeart size={64} className="text-dark-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">Wishlist is Empty</h2>
          <p className="text-dark-200 mb-6">Save your favorite supplements for later.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        <h1 className="font-heading text-3xl font-bold mb-8">My <span className="gradient-text">Wishlist</span></h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
