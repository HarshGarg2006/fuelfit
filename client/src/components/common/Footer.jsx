import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const categories = [
  { label: 'Whey Protein', slug: 'whey-protein' },
  { label: 'Creatine', slug: 'creatine' },
  { label: 'Mass Gainer', slug: 'mass-gainer' },
  { label: 'Pre Workout', slug: 'pre-workout' },
  { label: 'Vitamins', slug: 'vitamins' },
  { label: 'Fat Burner', slug: 'fat-burner' },
  { label: 'Accessories', slug: 'accessories' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center font-bold text-white text-lg">F</div>
              <span className="text-xl font-bold font-heading">Fuel<span className="gradient-text">Fit</span></span>
            </Link>
            <p className="text-dark-200 text-sm leading-relaxed mb-5">Your new destination for authentic fitness supplements. Quality products, fast delivery, and honest prices.</p>
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-neon-red/20 hover:text-neon-red flex items-center justify-center transition-all"><Icon size={18} /></a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}><Link to={`/products?category=${cat.slug}`} className="text-dark-200 hover:text-white text-sm transition-colors">{cat.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-dark-200 hover:text-white text-sm transition-colors">All Products</Link></li>
              <li><Link to="/request" className="text-dark-200 hover:text-white text-sm transition-colors">Request a Product</Link></li>
              <li><Link to="/orders" className="text-dark-200 hover:text-white text-sm transition-colors">Track Order</Link></li>
              <li><Link to="/profile" className="text-dark-200 hover:text-white text-sm transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-dark-200 text-sm"><FiMapPin size={16} className="shrink-0 mt-0.5" /> Sikandrabad, Bulandshahr, UP</li>
              <li className="flex items-center gap-3 text-dark-200 text-sm"><FiPhone size={16} className="shrink-0" /> +91 7248782252</li>
              <li className="flex items-center gap-3 text-dark-200 text-sm"><FiMail size={16} className="shrink-0" /> fuelfitsupport@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-300 text-sm">&copy; {new Date().getFullYear()} FuelFit. All rights reserved.</p>
          <div className="flex gap-6 text-dark-300 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
