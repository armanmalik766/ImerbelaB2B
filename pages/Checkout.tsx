import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder, verifyPayment, ShippingAddress } from '../services/api';
import { 
  ArrowLeft, 
  ChevronRight, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  AlertCircle,
  Truck,
  CreditCard,
  Building2,
  Package
} from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, totalAmount, totalMrp, clearCart, validateCart } = useCart();
  const { seller, isAuthenticated, isApproved } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    name: seller?.name || '',
    email: seller?.email || '',
    phone: seller?.phone || '',
    businessName: seller?.businessName || '',
    gstNumber: seller?.gstNumber || '',
    address: seller?.addressLine1 || '',
    city: seller?.city || '',
    state: seller?.state || '',
    pincode: seller?.pincode || '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/seller-login');
    if (items.length === 0) navigate('/cart');
  }, [isAuthenticated, items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    const validation = validateCart();
    if (!validation.valid) {
      setError(validation.errors[0]);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderItems = items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      const response = await placeOrder(orderItems, shippingInfo);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to initialize order');
      }

      const { razorpayOrderId, amount, currency, keyId } = response.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'IMERBELA',
        description: 'B2B Wholesale Order',
        order_id: razorpayOrderId,
        handler: async (rzpResponse: any) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
            });

            if (verifyRes.success) {
              clearCart();
              navigate('/seller-dashboard', { state: { orderSuccess: true } });
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: '#6B8E23',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Simple Logo Only */}
      <header className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tighter">IMERBELA</Link>
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            <nav className="flex items-center gap-2 text-xs mb-8">
              <Link to="/cart" className="text-[#6B8E23] hover:underline">Cart</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="font-bold text-gray-900">Information</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">Shipping</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">Payment</span>
            </nav>

            <form onSubmit={handlePlaceOrder} className="space-y-10">
              {/* Contact Information */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Contact</h2>
                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500">
                      Already have an account? <Link to="/seller-login" className="text-[#6B8E23] hover:underline">Log in</Link>
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Full Name</label>
                    <input
                      required
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Phone Number</label>
                    <input
                      required
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                      placeholder="Mobile number"
                    />
                  </div>
                </div>
              </section>

              {/* Order Context */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-medium text-gray-900">Business Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Business Name</label>
                    <input
                      name="businessName"
                      value={shippingInfo.businessName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                      placeholder="Company/Store Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">GST Number (Optional)</label>
                    <input
                      name="gstNumber"
                      value={shippingInfo.gstNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                      placeholder="Enter GSTIN"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Complete Address</label>
                    <textarea
                      required
                      name="address"
                      rows={3}
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all resize-none"
                      placeholder="Street address, colony, Landmark..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">City</label>
                      <input
                        required
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">State</label>
                      <input
                        required
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Pincode</label>
                      <input
                        required
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg p-3.5 text-sm focus:ring-1 focus:ring-[#6B8E23] outline-none transition-all"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-100">
                <Link to="/cart" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Return to Cart
                </Link>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full md:w-auto bg-[#111111] text-white px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-lg flex items-center justify-center gap-3 disabled:opacity-40"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#F5F5F7] p-8 md:p-10 rounded-2xl border border-gray-100 sticky top-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#111111] mb-8 border-b border-gray-200 pb-4">Order Summary</h2>
              
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-white rounded-lg border border-gray-200 p-2 flex-shrink-0">
                      <img 
                        src={item.product.imageUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.product.imageUrl}` : item.product.imageUrl} 
                        alt={item.product.title}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.title}</h4>
                      <p className="text-[11px] text-gray-500 font-light italic">{item.product.subtitle}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center text-[11px] uppercase tracking-widest text-gray-500">
                  <span>Total MRP</span>
                  <span className="line-through">₹{(totalMrp || 0).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] uppercase tracking-widest text-[#6B8E23] font-bold">
                  <span>Wholesale Discount</span>
                  <span>- ₹{Math.max(0, (totalMrp || 0) - totalAmount).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs font-light">
                  <span>Shipping</span>
                  <span className="italic text-[10px] uppercase font-bold text-[#6B8E23]">Calculated Next Step</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-6 border-t border-gray-200">
                <span className="text-base font-bold text-gray-900 uppercase tracking-widest">Grand Total</span>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1 font-mono">INR</span>
                  <span className="text-2xl font-light text-[#111111]">₹{totalAmount.toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-10 p-4 bg-white/50 rounded-xl border border-white flex flex-col gap-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-[#6B8E23]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">B2B Verified Transaction</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Package className="w-4 h-4 text-[#6B8E23]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Insured Wholesale Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Copyright */}
      <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} IMERBELA • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};

export default Checkout;
