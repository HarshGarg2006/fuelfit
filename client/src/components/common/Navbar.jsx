import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiGrid, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

const categories = [
  { label: 'Whey Protein', slug: 'whey-protein' },
  { label: 'Creatine', slug: 'creatine' },
  { label: 'Mass Gainer', slug: 'mass-gainer' },
  { label: 'Pre Workout', slug: 'pre-workout' },
  { label: 'Vitamins', slug: 'vitamins' },
  { label: 'Fat Burner', slug: 'fat-burner' },
  { label: 'Accessories', slug: 'accessories' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/products?search=${searchQuery}`); setSearchOpen(false); setSearchQuery(''); }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cartCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-900/95 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center font-bold text-white text-lg">F</div>
            <span className="text-xl font-bold font-heading tracking-tight">Fuel<span className="gradient-text">Fit</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="px-3 py-2 text-sm text-dark-100 hover:text-white hover:bg-white/5 rounded-lg transition-colors">{cat.label}</Link>
            ))}
            <Link to="/nutrition" className="px-3 py-2 text-sm text-neon-orange font-bold hover:text-white hover:bg-white/5 rounded-lg transition-colors">Nutrition Guide</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 hover:bg-white/5 rounded-lg transition-colors" id="search-toggle"><FiSearch size={20} /></button>

            {user && (
              <>
                <Link to="/wishlist" className="p-2.5 hover:bg-white/5 rounded-lg transition-colors hidden sm:block" id="wishlist-link"><FiHeart size={20} /></Link>
                <Link to="/cart" className="p-2.5 hover:bg-white/5 rounded-lg transition-colors relative" id="cart-link">
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-neon-red rounded-full text-[11px] font-bold flex items-center justify-center">{cartCount}</span>}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="p-2.5 hover:bg-white/5 rounded-lg transition-colors" id="user-menu-toggle">
                  <FiUser size={20} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-12 w-56 glass-card p-2 fade-in">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-dark-200 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg"><FiUser size={16} /> Profile</Link>
                    <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg"><FiPackage size={16} /> My Orders</Link>
                    <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg"><FiHeart size={16} /> Wishlist</Link>
                    {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg text-neon-orange"><FiSettings size={16} /> Admin Panel</Link>}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg text-neon-red w-full"><FiLogOut size={16} /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary !py-2 !px-5 text-sm" id="login-btn">Login</Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2.5 hover:bg-white/5 rounded-lg transition-colors lg:hidden" id="mobile-toggle">
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 fade-in">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200" size={18} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search supplements, brands..." className="input-field !pl-12 !pr-24" autoFocus id="search-input" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-1.5 !px-4 text-sm">Search</button>
            </div>
          </form>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 pt-3 fade-in">
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="block px-3 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-white/5 rounded-lg">{cat.label}</Link>
            ))}
            <Link to="/nutrition" className="block px-3 py-2.5 text-sm text-neon-orange font-bold hover:bg-white/5 rounded-lg mt-1">Nutrition Guide & Calculator</Link>
            <Link to="/request" className="block px-3 py-2.5 text-sm text-neon-orange hover:bg-white/5 rounded-lg mt-2">Can&apos;t Find Your Supplement?</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
