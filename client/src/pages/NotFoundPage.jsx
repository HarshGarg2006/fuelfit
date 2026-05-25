import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 fade-in">
      <div className="text-center">
        <h1 className="font-heading text-8xl md:text-9xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Page Not Found</h2>
        <p className="text-dark-200 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2"><FiHome size={16} /> Go Home</Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2"><FiArrowLeft size={16} /> Go Back</button>
        </div>
      </div>
    </div>
  );
}
