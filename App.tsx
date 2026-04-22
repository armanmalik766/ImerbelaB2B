
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import BecomeSeller from './pages/BecomeSeller';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerLogin from './pages/SellerLogin';
import SellerDashboard from './pages/SellerDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminSellerProfile from './pages/AdminSellerProfile';
import OrderInvoice from './pages/OrderInvoice';
import Seller from './pages/Seller';
import BulkOrder from './pages/BulkOrder';
import DistributorProgram from './pages/DistributorProgram';
import ProtectedRoute from './components/ProtectedRoute';
import { Product } from './types';
import { getProductByHandle } from './services/api';
import { ShieldCheck, Leaf, Droplet, Microscope, Sprout, Feather, Mail, MapPin, Phone, Instagram, Facebook, Twitter, Loader2 } from 'lucide-react';

// Wrapper to handle product navigation via handle
const ProductDetailWrapper: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!handle) return;
    
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getProductByHandle(handle);
        if (res.success && res.data) {
          setProduct(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch product detail', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [handle]);

  if (loading) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mb-4" />
        <p className="text-gray-400 text-sm italic">Retrieving product formulation...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-[#111111] mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-xs uppercase tracking-widest text-[#6B8E23] hover:underline"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  const handleProductClick = (p: Product) => {
    navigate(`/product/${p.handle}`);
  };

  return <ProductDetail product={product} onProductClick={handleProductClick} />;
};

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Check if current route should hide the main navbar/footer (dashboard has its own)
const useIsDashboardRoute = () => {
  const { pathname } = useLocation();
  return pathname.startsWith('/seller-dashboard') || pathname.startsWith('/admin');
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const isDashboardRoute = useIsDashboardRoute();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-[#111111]">
      <ScrollToTop />

      {!isDashboardRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Existing Pages */}
          <Route path="/" element={<Seller />} />
          <Route path="/product/:handle" element={<ProductDetailWrapper />} />

          <Route
            path="/contact"
            element={
              <section className="min-h-screen bg-white text-[#111111] flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full py-24">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                    <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                      <span className="text-[#6B8E23] text-[10px] uppercase tracking-[0.3em] font-bold block mb-8">Concierge Service</span>
                      <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-12">
                        Let's Start a <br />
                        <span className="font-serif italic text-gray-400">Conversation.</span>
                      </h1>
                      <div className="space-y-12">
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4 group cursor-pointer">
                            <MapPin className="w-5 h-5 text-[#6B8E23] mt-1" />
                            <div>
                              <h4 className="text-xs uppercase tracking-widest font-bold mb-1 group-hover:text-[#6B8E23] transition-colors">Headquarters</h4>
                              <p className="text-gray-500 font-light text-sm">1200, Indiranagar, Bangalore, India</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4 group cursor-pointer">
                            <Mail className="w-5 h-5 text-[#6B8E23] mt-1" />
                            <div>
                              <h4 className="text-xs uppercase tracking-widest font-bold mb-1 group-hover:text-[#6B8E23] transition-colors">Inquiries</h4>
                              <p className="text-gray-500 font-light text-sm">care@imerbela.com</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4 group cursor-pointer">
                            <Phone className="w-5 h-5 text-[#6B8E23] mt-1" />
                            <div>
                              <h4 className="text-xs uppercase tracking-widest font-bold mb-1 group-hover:text-[#6B8E23] transition-colors">Support</h4>
                              <p className="text-gray-500 font-light text-sm">+91 98765 43210</p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-12 border-t border-gray-100">
                          <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-gray-400">Follow Us</h4>
                          <div className="flex space-x-6">
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
                            <Facebook className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#F5F5F7] p-8 md:p-12 rounded-sm border border-gray-100 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Full Name</label>
                          <input type="text" className="w-full bg-transparent border-b border-gray-300 py-4 px-1 text-lg outline-none focus:border-[#6B8E23] transition-colors placeholder-gray-400" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Email Address</label>
                          <input type="email" className="w-full bg-transparent border-b border-gray-300 py-4 px-1 text-lg outline-none focus:border-[#6B8E23] transition-colors placeholder-gray-400" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Message</label>
                          <textarea rows={4} className="w-full bg-transparent border-b border-gray-300 py-4 px-1 text-lg outline-none focus:border-[#6B8E23] transition-colors placeholder-gray-400 resize-none" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full bg-[#111111] text-white py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all mt-8">
                          Send Request
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            }
          />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* B2B Seller Pages */}
          <Route path="/seller" element={<Seller />} />
          <Route path="/bulk-order" element={<BulkOrder />} />
          <Route path="/distributor-program" element={<DistributorProgram />} />

          {/* B2B Seller Pages */}
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route
            path="/seller-dashboard"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/seller/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSellerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/order/:id/invoice"
            element={
              <ProtectedRoute requiredRole="admin">
                <OrderInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller-dashboard/order/:id/invoice"
            element={
              <ProtectedRoute>
                <OrderInvoice />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isDashboardRoute && <Footer />}
    </div>
  );
};

export default App;
