import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, Product } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getBulkPrice } from '../constants';
import {
  Lock,
  ShieldAlert,
  Package,
  Minus,
  Plus,
  ShoppingBag,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Loader2,
} from 'lucide-react';

const BulkOrder: React.FC = () => {
  const { isAuthenticated, isApproved, isPending } = useAuth();
  const { addToCart, items: cartItems, totalAmount, totalMrp, itemCount, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({});

  useEffect(() => {
    if (isAuthenticated && isApproved) {
      const fetch = async () => {
        try {
          const res = await getProducts();
          if (res.success && res.data) {
            setProducts(res.data);
            const initial: Record<string, number> = {};
            res.data.forEach((p) => {
              initial[p._id] = 0;
            });
            setQuantities(initial);
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

  const getAllowedQuantities = (product: Product): number[] => {
    if (!product.bulkPricing || product.bulkPricing.length === 0) {
      return [product.moq || 1];
    }
    return [...new Set(product.bulkPricing.map((tier) => tier.minQty))].sort((a, b) => a - b);
  };

  const handleQuantityChange = (product: Product, newQty: number) => {
    setQuantities((prev) => ({ ...prev, [product._id]: newQty }));
    setMessages((prev) => {
      const n = { ...prev };
      delete n[product._id];
      return n;
    });
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product._id] || 0;
    const allowedQuantities = getAllowedQuantities(product);

    if (qty <= 0 || !allowedQuantities.includes(qty)) {
      setMessages((prev) => ({
        ...prev,
        [product._id]: { type: 'error', text: `Please select an allowed quantity tier.` },
      }));
      setTimeout(() => setMessages((prev) => {
        const n = { ...prev };
        delete n[product._id];
        return n;
      }), 3000);
      return;
    }

    const result = addToCart(product, qty);
    setMessages((prev) => ({
      ...prev,
      [product._id]: { type: result.success ? 'success' : 'error', text: result.message },
    }));
    setTimeout(() => setMessages((prev) => {
      const n = { ...prev };
      delete n[product._id];
      return n;
    }), 3000);
  };

  const isInCart = (productId: string) => cartItems.some(item => item.product._id === productId);

  if (!isAuthenticated) {
    return (
      <section className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FAFAF9]">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
            <Lock className="w-9 h-9 text-gray-300" />
          </div>
          <h2 className="text-3xl font-light mb-4 text-[#111111]">Wholesale <span className="font-serif italic text-gray-400">Access Only</span></h2>
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
          <Link to="/wholesale" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Bulk <span className="font-serif italic text-gray-400">Order</span></h1>
          <p className="text-gray-400 font-light max-w-xl">Wholesale volume pricing is applied automatically.</p>
        </div>
      </section>

      <section className="py-12 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {productsLoading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100">
                  <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mb-4" />
                  <p className="text-gray-400 text-sm">Loading inventory...</p>
                </div>
              ) : (
                products.map((product) => {
                  const qty = quantities[product._id] || 0;
                  const allowedQuantities = getAllowedQuantities(product);
                  const isAllowed = allowedQuantities.includes(qty);
                  const msg = messages[product._id];

                  return (
                    <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-4">
                          <img src={product.imageUrl} alt={product.title} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-lg font-medium text-[#111111]">{product.title}</h3>
                            <p className="text-xs text-gray-400">{product.subtitle}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {allowedQuantities.map((q) => (
                              <button
                                key={q}
                                onClick={() => handleQuantityChange(product, q)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                  qty === q ? 'bg-[#6B8E23] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                {q} Units
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm font-bold text-[#111111] flex flex-col">
                              {isAllowed ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span>₹{(getBulkPrice(product, qty) * qty).toFixed(0)}</span>
                                    <span className="text-[10px] text-gray-400 line-through font-normal">₹{((product.mrpPerUnit || 0) * qty).toFixed(0)}</span>
                                  </div>
                                  <span className="text-[10px] text-[#6B8E23] font-medium animate-in fade-in slide-in-from-left-1">You Save ₹{(((product.mrpPerUnit || 0) - getBulkPrice(product, qty)) * qty).toFixed(0)}</span>
                                </>
                              ) : `MOQ: ${product.moq}`}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!isAllowed}
                              className={`h-10 px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                isAllowed ? 'bg-[#111111] text-white hover:bg-[#6B8E23]' : 'bg-gray-100 text-gray-300'
                              }`}
                            >
                              {isInCart(product._id) ? 'Update Cart' : 'Add to Cart'}
                            </button>
                          </div>
                          
                          {msg && (
                            <div className={`text-[10px] ${msg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                              {msg.text}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Order Summary</h3>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-8 h-8 text-gray-100 mx-auto mb-3" />
                    <p className="text-xs text-gray-400">Your wholesale cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product._id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.product._id)} className="text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          <span className="text-gray-600 truncate max-w-[120px]">{item.product.title}</span>
                        </div>
                        <span className="font-medium text-[#111111]">₹{item.totalPrice.toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
                        <span>Total MRP</span>
                        <span className="line-through">₹{(totalMrp || 0).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#6B8E23] font-bold">
                        <span>Wholesale Discount</span>
                        <span>- ₹{Math.max(0, (totalMrp || 0) - totalAmount).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-gray-50">
                        <span className="text-[#111111] text-xs font-bold uppercase tracking-widest">Grand Total</span>
                        <span className="text-2xl font-light text-[#6B8E23]">₹{totalAmount.toFixed(0)}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate('/cart')} className="w-full bg-[#111111] text-white h-12 text-[10px] font-bold uppercase tracking-widest hover:bg-[#6B8E23] transition-all rounded-lg">Proceed to Checkout</button>
                    <button onClick={clearCart} className="w-full py-2 text-[10px] text-gray-400 hover:text-red-400 uppercase tracking-widest">Clear Everything</button>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                   <p className="text-[9px] text-gray-400 uppercase tracking-widest">Questions about bulk availability?</p>
                   <Link to="/contact" className="text-[#6B8E23] text-[9px] font-bold uppercase tracking-widest hover:underline mt-1 block">Contact Support</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkOrder;
