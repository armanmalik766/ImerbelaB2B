import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, Product } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import {
  Lock,
  ShieldAlert,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

const BulkOrder: React.FC = () => {
  const { isAuthenticated, isApproved, isPending } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && isApproved) {
      const fetch = async () => {
        try {
          const res = await getProducts();
          if (res.success && res.data) {
            const grouped: Record<string, Product> = {};
            res.data.forEach(p => {
              const baseHandle = p.handle.split('-').slice(0, -1).join('-');
              // Prefer '3nos' if available so we show the base variant
              if (!grouped[baseHandle] || p.handle.includes('3nos')) {
                grouped[baseHandle] = p;
              }
            });
            setProducts(Object.values(grouped));
          }
        } catch (error) {
          console.error('Failed to fetch products', error);
        } finally {
          setProductsLoading(false);
        }
      };
      fetch();
    }
  }, [isAuthenticated, isApproved]);

  if (!isAuthenticated) {
    return (
      <section className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAF9]">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
            <Lock className="w-9 h-9 text-gray-300" />
          </div>
          <h2 className="text-3xl font-light mb-4 text-[#111111]">Seller <span className="font-serif italic text-gray-400">Access Only</span></h2>
          <p className="text-gray-500 font-light mb-8">Access exclusively for approved B2B partners.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/seller-login" className="bg-[#111111] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm">Sign In</Link>
            <Link to="/become-seller" className="border border-[#111111] text-[#111111] px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm">Apply Now</Link>
          </div>
        </div>
      </section>
    );
  }

  if (!isApproved) {
    return (
      <section className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAF9]">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-amber-50 rounded-full mx-auto mb-8 flex items-center justify-center">
            <ShieldAlert className="w-9 h-9 text-amber-400" />
          </div>
          <h2 className="text-3xl font-light mb-4">Account {isPending ? 'Under Review' : 'Not Approved'}</h2>
          <p className="text-gray-500 font-light mb-8">{isPending ? 'Your application is being reviewed.' : 'Access denied.'}</p>
          <Link to="/seller-dashboard" className="bg-[#111111] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm">Dashboard</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-[#111111] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/seller" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Seller Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Full <span className="font-serif italic text-gray-400">catalogue</span></h1>
          <p className="text-gray-400 font-light max-w-xl">Browse all B2B seller variants and bundle sizes.</p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-[#FAFAF9] min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          {productsLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mb-4" />
              <p className="text-gray-400 text-sm">Loading inventory...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product.handle}`)}
                  className="cursor-pointer h-full"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BulkOrder;
