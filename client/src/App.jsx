import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProductRequestPage from './pages/ProductRequestPage';
import NutritionPage from './pages/NutritionPage';
import AIAssistantWidget from './components/common/AIAssistantWidget';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminRequests from './pages/admin/AdminRequests';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDelivery from './pages/admin/AdminDelivery';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/request" element={<ProductRequestPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
          <Route path="/admin/requests" element={<AdminRoute><AdminRequests /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/delivery" element={<AdminRoute><AdminDelivery /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  );
}
