import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { FiArrowRight, FiShield, FiTruck, FiHeadphones, FiStar, FiZap, FiTarget, FiAward } from 'react-icons/fi';

const heroSlides = [
  { title: 'FUEL YOUR\nFITNESS JOURNEY', subtitle: 'Premium, authentic supplements — now available at your fingertips', cta: 'Shop Now', link: '/products', gradient: 'from-neon-red/20 via-transparent to-transparent' },
  { title: 'WHEY PROTEIN\nCOLLECTION', subtitle: 'Top brands, best prices, delivered to your door', cta: 'Explore', link: '/products?category=whey-protein', gradient: 'from-neon-orange/20 via-transparent to-transparent' },
  { title: 'JUST\nLAUNCHED', subtitle: 'Your new go-to destination for fitness supplements', cta: 'Explore', link: '/products', gradient: 'from-neon-blue/20 via-transparent to-transparent' },
];

const categoryItems = [
  { name: 'Whey Protein', slug: 'whey-protein', icon: '💪', color: 'from-red-500/20 to-orange-500/20' },
  { name: 'Creatine', slug: 'creatine', icon: '⚡', color: 'from-blue-500/20 to-cyan-500/20' },
  { name: 'Mass Gainer', slug: 'mass-gainer', icon: '🏋️', color: 'from-purple-500/20 to-pink-500/20' },
  { name: 'Pre Workout', slug: 'pre-workout', icon: '🔥', color: 'from-orange-500/20 to-yellow-500/20' },
  { name: 'Vitamins', slug: 'vitamins', icon: '💊', color: 'from-green-500/20 to-emerald-500/20' },
  { name: 'Fat Burner', slug: 'fat-burner', icon: '🎯', color: 'from-pink-500/20 to-red-500/20' },
  { name: 'Accessories', slug: 'accessories', icon: '🎒', color: 'from-indigo-500/20 to-violet-500/20' },
];

const features = [
  { icon: FiShield, title: '100% Authentic', desc: 'Verified genuine products' },
  { icon: FiTruck, title: 'Fast Delivery', desc: 'Across India in 2-5 days' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here to help' },
];

const goals = [
  { icon: FiZap, name: 'Muscle Gain', color: 'text-neon-red' },
  { icon: FiTarget, name: 'Fat Loss', color: 'text-neon-green' },
  { icon: FiAward, name: 'Strength', color: 'text-neon-orange' },
  { icon: FiStar, name: 'Endurance', color: 'text-neon-blue' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateHero, setAnimateHero] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sort: '-ratings.average' }));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimateHero(false);
      setTimeout(() => {
        setCurrentSlide((p) => (p + 1) % heroSlides.length);
        setAnimateHero(true);
      }, 200);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div className="fade-in">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,45,45,0.08),transparent_70%)]" />
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="page-container relative z-10 py-20">
          <div className="max-w-3xl">
            <div className={`transition-all duration-500 ${animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none mb-6 whitespace-pre-line">
                {slide.title.split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br />}<span className={i === 0 ? 'gradient-text' : 'text-white'}>{line}</span></span>
                ))}
              </h1>
              <p className="text-dark-200 text-lg md:text-xl mb-8 max-w-lg">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-4">
                <Link to={slide.link} className="btn-primary text-base flex items-center gap-2 !py-4 !px-8">
                  {slide.cta} <FiArrowRight />
                </Link>
                <Link to="/products" className="btn-secondary text-base flex items-center gap-2 !py-4 !px-8">
                  Browse All
                </Link>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex gap-2 mt-12">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => { setAnimateHero(false); setTimeout(() => { setCurrentSlide(i); setAnimateHero(true); }, 200); }} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-10 bg-neon-red' : 'w-6 bg-dark-400 hover:bg-dark-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="border-y border-white/5 bg-dark-800/50">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-neon-red/10 flex items-center justify-center text-neon-red">
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-dark-200 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 md:py-24">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title !mb-0">Shop by <span className="gradient-text">Category</span></h2>
            <Link to="/products" className="text-dark-200 hover:text-neon-red transition-colors flex items-center gap-1 text-sm">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categoryItems.map((cat) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="glass-card-hover text-center p-6 group">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <p className="font-semibold text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY GOAL ===== */}
      <section className="py-12 bg-dark-800/30">
        <div className="page-container">
          <h2 className="section-title text-center">Shop by <span className="gradient-text">Goal</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {goals.map((g) => (
              <Link key={g.name} to={`/products?goal=${g.name.toLowerCase().replace(' ', '-')}`} className="glass-card-hover p-6 text-center group">
                <g.icon size={32} className={`mx-auto mb-3 ${g.color} group-hover:scale-110 transition-transform`} />
                <p className="font-semibold text-sm">{g.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 md:py-24">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title !mb-0">Featured <span className="gradient-text">Products</span></h2>
            <Link to="/products" className="text-dark-200 hover:text-neon-red transition-colors flex items-center gap-1 text-sm">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => <ProductCard key={product._id} product={product} />)
            }
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16">
        <div className="page-container">
          <div className="glass-card relative overflow-hidden p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-red/10 via-neon-orange/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-extrabold mb-4">
                Can't Find Your <span className="gradient-text">Supplement?</span>
              </h2>
              <p className="text-dark-200 mb-8 max-w-lg mx-auto">Tell us what you're looking for and we'll source it for you. We deliver every supplement brand in India.</p>
              <Link to="/request" className="btn-primary text-base !py-4 !px-8 inline-flex items-center gap-2">
                Request a Product <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16 border-t border-white/5">
        <div className="page-container text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Stay in the <span className="gradient-text">Loop</span></h2>
          <p className="text-dark-200 mb-8 max-w-md mx-auto">Get exclusive deals, new arrivals, and fitness tips delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="input-field flex-1" />
            <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
