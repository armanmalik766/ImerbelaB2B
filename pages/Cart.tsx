import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getBulkPrice } from '../constants';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  AlertCircle,
  ArrowLeft,
  Package,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { placeOrder, verifyPayment } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, itemCount, totalAmount, updateQuantity, removeFromCart, clearCart, validateCart } = useCart();
  const { isAuthenticated, isApproved, seller } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validation = validateCart();

  const handleCheckout = () => {
    if (!validation.valid || isProcessing) return;
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Lock className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-2xl font-light text-[#111111] mb-3">
            Login <span className="font-serif italic text-gray-400">Required</span>
          </h2>
          <p className="text-sm text-gray-500 font-light mb-6">
            Cart is available only for approved wholesale partners.
          </p>
          <Link
            to="/seller-login"
            className="inline-block bg-[#111111] text-white px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-sm"
          >
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-gray-300" />
          </div>
          <h2 className="text-2xl font-light text-[#111111] mb-3">
            Your Cart is <span className="font-serif italic text-gray-400">Empty</span>
          </h2>
          <p className="text-sm text-gray-500 font-light mb-6">
            Browse our products and add items to your wholesale cart.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#111111] text-white px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-sm"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#111111]">
              Wholesale <span className="font-serif italic text-gray-400">Cart</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">{itemCount} units across {items.length} products</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-600 uppercase tracking-wider transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const currentPrice = getBulkPrice(item.product, item.quantity);
              const isDiscounted = currentPrice < item.product.price;
              const moqError = item.quantity < item.product.moq;

              return (
                <div
                  key={item.product._id}
                  className={`bg-white rounded-2xl border ${
                    moqError ? 'border-red-200' : 'border-gray-100'
                  } shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.product.handle}`}
                      className="w-full sm:w-28 h-48 sm:h-auto flex-shrink-0 bg-gray-50 flex items-center justify-center p-4"
                    >
                      <img
                        src={item.product.imageUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.product.imageUrl}` : item.product.imageUrl}
                        alt={item.product.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 p-5 lg:p-6 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <Link
                            to={`/product/${item.product.handle}`}
                            className="text-base font-medium text-[#111111] hover:text-[#6B8E23] transition-colors line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          <div className="flex items-center gap-2">
                             <span className="text-xs text-gray-400 font-light">{item.product.subtitle}</span>
                             <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">
                                MOQ: {item.product.moq}
                             </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-2 -mr-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price + Quantity Control Area */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#111111]">
                              ₹{currentPrice.toFixed(2)}
                            </span>
                            {isDiscounted && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{item.product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {isDiscounted ? (
                            <span className="text-[9px] text-[#6B8E23] font-bold uppercase tracking-wider mt-1">
                              Bulk Discount Applied
                            </span>
                          ) : (
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                              Standard Seller Price
                            </span>
                          )}
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center bg-gray-50/50 rounded-full border border-gray-100 h-11 px-1">
                            <button
                              onClick={() => {
                                updateQuantity(item.product._id, item.quantity - 1);
                              }}
                              disabled={item.quantity <= item.product.moq}
                              className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-[#111111]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-full transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </div>

                      {/* Subtotal Row */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                          Total for this item
                        </span>
                        <span className="text-base font-bold text-[#6B8E23]">
                          ₹{(currentPrice * item.quantity).toFixed(0)}
                        </span>
                      </div>

                      {/* Errors */}
                      {moqError && (
                        <div className="flex items-center gap-2 text-red-500 text-[10px] mt-3 font-bold uppercase tracking-wider bg-red-50 p-2 rounded-lg">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          Minimum Order: {item.product.moq} Units
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111] mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate mr-2">
                      {item.product.title} × {item.quantity}
                    </span>
                    <span className="text-[#111111] font-medium flex-shrink-0">
                      ₹{item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-xl font-light text-[#111111]">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Messages */}
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              {/* Validation errors */}
              {!validation.valid && (
                <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3 space-y-1">
                  {validation.errors.map((err, idx) => (
                    <p key={idx} className="text-xs text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {err}
                    </p>
                  ))}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={!validation.valid || !isApproved || isProcessing}
                className="w-full bg-[#111111] text-white h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Place Wholesale Order
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider">Secure B2B Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
