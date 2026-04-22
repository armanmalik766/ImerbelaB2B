
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Star, CheckCircle2, Lock, ShieldAlert, Package, AlertCircle, CheckCircle, ShoppingBag, TrendingDown, Minus, Plus } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import VisibleResultsSection from '../components/VisibleResultsSection';
import { MOCK_PRODUCTS, getBulkPrice } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onProductClick }) => {
  const { isAuthenticated, isApproved, isPending } = useAuth();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const canViewPrice = isAuthenticated && isApproved;
  const canPurchase = isAuthenticated && isApproved;

  const [activeTab, setActiveTab] = useState<'description' | 'info' | 'benefits'>('description');

  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch all products to find siblings for variant switching
    import('../services/api').then(({ getProducts }) => {
      getProducts().then(res => {
        if (res.success && res.data) setAllProducts(res.data);
      });
    });
  }, []);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setCartMessage(null);
  }, [product._id]);

  // Find all variants (e.g. shampoo-300ml-3nos, 6nos and 12nos)
  const getAllVariants = () => {
    const baseHandle = product.handle.split('-').slice(0, -1).join('-');
    return allProducts.filter(p => p.handle.startsWith(baseHandle))
      .sort((a, b) => {
        const aNum = parseInt(a.handle.match(/(\d+)nos/)?.[1] || '0');
        const bNum = parseInt(b.handle.match(/(\d+)nos/)?.[1] || '0');
        return aNum - bNum;
      });
  };

  const totalPrice = product.price * quantity;
  const mrpTotal = (product.mrpPerUnit || product.price || 0) * quantity;
  const discountPercent = mrpTotal > 0
    ? Math.round(((mrpTotal - totalPrice) / mrpTotal) * 100)
    : 0;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    setCartMessage(null);
  };

  const handleAddToCart = () => {
    const result = addToCart(product, quantity);
    setCartMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  const allVariants = getAllVariants();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-start">
        {/* Gallery */}
        <div className="md:sticky md:top-24 relative space-y-4">
          <div className="relative aspect-[4/5] max-w-lg mx-auto bg-gray-50 overflow-hidden rounded-sm border border-gray-100">
            <img
              src={product.imageUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}` : product.imageUrl}
              className="w-full h-full object-contain mix-blend-multiply transition-all duration-1000 hover:scale-105"
              alt={product.title}
            />
            {/* B2B Badge */}
            {product.isB2BOnly && (
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-[#6B8E23] text-white text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold rounded-sm flex items-center gap-1.5 shadow-lg">
                  <Package className="w-3.5 h-3.5" />
                  Seller Pack
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <nav className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center space-x-2">
              <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
              <span>/</span>
              <span>Seller</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#111111]">{product.title}</h1>
            <p className="text-[#6B8E23] text-xs font-bold uppercase tracking-widest">{product.subtitle}</p>
          </div>

          {/* Price Section — Conditional */}
          {canViewPrice ? (
            <div className="space-y-6">
              {/* MRP vs Actual */}
              <div className="flex items-end gap-10 flex-wrap pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Retail Price</p>
                  <p className="text-2xl font-light text-gray-400 line-through">₹{mrpTotal.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#6B8E23] font-bold mb-1">Seller Price</p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-[#111111]">₹{totalPrice.toFixed(0)}</p>
                    {discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-white bg-[#6B8E23] px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pack Selection (Variants) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#6B8E23]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Select Pack Size</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {getAllVariants().map((v) => {
                    const isActive = v._id === product._id;
                    const nos = v.handle.match(/(\d+)nos/)?.[1] || '1';
                    
                    if (isActive) {
                      return (
                        <div key={v._id} className="px-5 py-4 rounded-xl border-2 border-[#6B8E23] bg-[#6B8E23]/5 shadow-sm min-w-[120px] relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-8 h-8 bg-[#6B8E23] translate-x-4 -translate-y-4 rotate-45" />
                          <span className="text-[10px] font-bold text-[#6B8E23] uppercase tracking-wider block mb-1">
                            {nos} Nos Pack
                          </span>
                          <span className="text-base font-bold text-[#111111]">₹{v.price.toFixed(0)}</span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={v._id}
                        to={`/product/${v.handle}`}
                        className="px-5 py-4 rounded-xl border-2 border-gray-100 bg-white hover:border-gray-300 transition-all duration-300 min-w-[120px] group"
                      >
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-gray-600">
                          {nos} Nos Pack
                        </span>
                        <span className="text-base font-bold text-gray-900 group-hover:text-[#111111]">₹{v.price.toFixed(0)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-[#111111] rounded-2xl p-4 md:p-6 text-white flex items-center justify-between shadow-xl shadow-black/10">
                <div className="space-y-1">
                  <span className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold block">Grand Total</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light">₹{totalPrice.toFixed(0)}</span>
                    <span className="text-[10px] text-white/40 uppercase">Inc. GST</span>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-white/10 mx-2" />
                <div className="text-right">
                  <span className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold block">Units</span>
                  <span className="text-xl font-medium">{product.subtitle.split('X')[1]?.trim() || 'Bundle'}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Not authorized to view price */
            <div className="border border-gray-100 rounded-lg p-6 bg-[#FAFAF9]">
              {!isAuthenticated ? (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111] mb-1">
                      Seller Price — Login Required
                    </h3>
                    <p className="text-xs text-gray-500 font-light">
                      This product is available exclusively for approved B2B partners.
                      Bulk pricing and volume discounts available.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/seller-login"
                      className="flex-1 bg-[#111111] text-white py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-sm text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/become-seller"
                      className="flex-1 border border-[#111111] text-[#111111] py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#111111] hover:text-white transition-all rounded-sm text-center"
                    >
                      Become a Seller
                    </Link>
                  </div>
                </div>
              ) : isPending ? (
                <div className="text-center space-y-3">
                  <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-amber-700">
                    Account Under Review
                  </h3>
                  <p className="text-xs text-gray-500 font-light max-w-sm mx-auto">
                    Your seller application is being reviewed. You'll be able to view seller pricing and place orders once approved.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <ShieldAlert className="w-8 h-8 text-red-400 mx-auto" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-red-600">
                    Account Not Approved
                  </h3>
                  <p className="text-xs text-gray-500 font-light max-w-sm mx-auto">
                    Your seller application was not approved. Please contact support for more information.
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base">
            {product.description}
          </p>

          {/* Quantity + Add to Cart — Only for approved sellers */}
          {canPurchase ? (
            <div className="flex flex-col space-y-4 pt-4">
              {/* Cart message */}
              {cartMessage && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm ${cartMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                    }`}
                >
                  {cartMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  {cartMessage.text}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    Select Quantity
                  </label>
                  <span className="text-[10px] text-[#6B8E23] uppercase tracking-wider font-bold">
                    Bundle MOQ: 1
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex border border-gray-200 h-14 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-14 hover:bg-gray-50 transition-colors text-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-16 text-center text-base font-bold border-x border-gray-200 outline-none select-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-14 hover:bg-gray-50 transition-colors text-lg flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#111111] text-white h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-xl shadow-lg shadow-black/5 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isInCart(product._id) ? 'Update Packs in Cart' : 'Add to Cart Bundle'}
                  </button>
                </div>
              </div>

              {/* Current cart quantity indicator */}
              {isInCart(product._id) && (
                <div className="flex items-center gap-2 text-xs text-[#6B8E23] bg-[#6B8E23]/5 p-4 rounded-xl border border-[#6B8E23]/10">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">{getItemQuantity(product._id)} seller packs in your cart</span>
                </div>
              )}
            </div>
          ) : (
            /* Disabled purchase area for non-approved users */
            <div className="pt-4">
              {!isAuthenticated ? (
                <div className="bg-[#F5F5F7] rounded-lg p-5 text-center space-y-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Only for seller buyers
                  </p>
                  <Link
                    to="/seller-login"
                    className="inline-block bg-[#111111] text-white px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-sm"
                  >
                    Login to Purchase
                  </Link>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-lg p-5 text-center">
                  <p className="text-xs text-amber-700 font-medium">
                    Purchasing will be enabled after your account is approved.
                  </p>
                </div>
              )}
            </div>
          )}


        </div>
      </div>


      {/* Tabs Section (Full Width) */}
      <section className="max-w-7xl mx-auto px-4 border-t border-gray-100">
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          {[
            { id: 'description', label: 'Description' },
            { id: 'info', label: 'Additional Information' },
            { id: 'benefits', label: 'Features & Benefits' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] relative transition-colors duration-300 min-w-fit ${activeTab === tab.id ? 'text-[#111111]' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6B8E23] animate-in fade-in duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="py-12 animate-in fade-in slide-in-from-top-2 duration-500">
          {activeTab === 'description' && (
            <div className="space-y-0">
              {product.title.toLowerCase().includes('shampoo') ? (
                <>
                  <img src="/shampooBanner1.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/shampooBanner2.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/shampooBanner3.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/shampooBanner4.jpeg" alt="" className="w-full h-auto object-cover" />
                </>
              ) : product.title.toLowerCase().includes('conditioner') ? (
                <>
                  <img src="/conditionerBanner1.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/conditionerBanner2.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/conditionerBanner3.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/conditionerBanner4.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/conditionerBanner5.jpeg" alt="" className="w-full h-auto object-cover" />
                </>
              ) : product.title.toLowerCase().includes('serum') ? (
                <>
                  <img src="/serumBanner1.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/serumBanner2.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/serumBanner3.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/serumBanner4.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/serumBanner5.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/serumBanner6.jpeg" alt="" className="w-full h-auto object-cover" />
                </>
              ) : product.title.toLowerCase().includes('kit') ? (
                <>
                  <img src="/kitBanner1.png" alt="" className="w-full h-auto object-cover" />
                  <img src="/kitBanner2.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/kitBanner3.jpeg" alt="" className="w-full h-auto object-cover" />
                  <img src="/kitBanner4.jpeg" alt="" className="w-full h-auto object-cover" />
                </>
              ) : (
                <div className="max-w-4xl">
                  <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="w-full space-y-16 animate-fadeIn pb-12 mt-4 md:mt-8">
              <div className="w-full">
                <h3 className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-[#111111] border-b border-gray-200 pb-4 mb-6 md:mb-8">
                  Full Botanical Ingredients
                </h3>
                <div className="w-full">
                  {product.ingredients.map((ing, i) => (
                    <div key={i} className="mb-4">
                      <p className="text-[14px] md:text-[15px] text-gray-600 font-light leading-[2] tracking-wide">
                        <strong className="text-[#111111] font-medium mr-2">{ing.name}</strong> 
                        {ing.benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full pt-4">
                <h3 className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-[#111111] border-b border-gray-200 pb-4 mb-6 md:mb-8">
                  Application Guide
                </h3>
                <div className="w-full">
                  <div className="space-y-1">
                    {product.howToUse.map((step, i) => {
                      const isMainHeader = step.includes('Direction to use') || step.includes('How to Use') || step.includes('Directions for Use');
                      const isSubHeader = step === 'SHAMPOO' || step === 'CONDITIONER' || step === 'SERUM' || step === 'IMERBELA Neem Seed Kernel Hair Growth Serum';
                      const isSpacing = step.trim() === '';
                      
                      if (isSpacing) {
                        return <div key={i} className="h-6 w-full"></div>;
                      }

                      if (isMainHeader || isSubHeader) {
                        return (
                          <div key={i} className="pt-6 first:pt-0 pb-2">
                            <h4 className="text-[13px] md:text-[14px] font-bold text-[#111111] uppercase tracking-[0.1em]">
                              {step}
                            </h4>
                          </div>
                        );
                      }

                      // Check if it's a numbered instruction e.g. 1., 2.
                      const isNumberedListing = /^\d+\./.test(step.trim());

                      return (
                        <div key={i} className="w-full py-1.5">
                          <p className={`text-[14px] md:text-[15px] leading-[1.8] whitespace-pre-wrap ${isNumberedListing ? 'text-[#333333] font-normal' : 'pl-0 md:pl-5 text-gray-500 font-light'}`}>
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="max-w-4xl space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111] border-l-2 border-[#6B8E23] pl-4">Clinical Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-md transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#6B8E23] mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600 font-light leading-relaxed">Targets scalp irritation and dandruff at the source using high-purity herbal extracts.</span>
                </div>
                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-md transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#6B8E23] mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600 font-light leading-relaxed">Dermatologically inspired blend that strengthens hair from root to tip.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scientific Transformation Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-[#6B8E23] font-bold block">Scientific Transformation</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#111111]">Visible Scalp Recovery</h2>
            <p className="text-[#6B8E23] text-sm md:text-base font-medium tracking-wide">
              A cleaner scalp environment through advanced botanical science.
            </p>
            <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
              Experience clinically proven results with our neem seed kernel extract formula. Our scientific approach combines traditional herbal wisdom with modern dermatological research to deliver visible scalp recovery in just 4 weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {[
              "Clinically tested formula for visible results",
              "Proven to reduce dandruff and scalp irritation",
              "Results visible within 4 weeks of regular use"
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 p-6 bg-gray-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-[#6B8E23]" />
                <span className="text-xs text-gray-600 font-medium uppercase tracking-wider leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Before/After Transformation */}
      <VisibleResultsSection onCtaClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      {/* Reviews Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif text-[#111111] text-center mb-16 italic tracking-tight">What Our Customers Are Saying</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stars: 5,
                title: "Better than other plex treatments",
                body: "It's a superb product. The results are better than other popular bond repair products. It works on both strength and moisture. The price point is good for the salon.",
                author: "Arman Malik",
                location: "Delhi"
              },
              {
                stars: 5,
                title: "Hair stays strong even after bleach",
                body: "It is a versatile product and can be used with bleach or colour. It works very well on the strength of the hair and leaves the hair with a polished, shiny look.",
                author: "Pooja Singh",
                location: "Haryana"
              },
              {
                stars: 5,
                title: "Saved my thinning, brittle hair",
                body: "\"Years of chemical treatments left my hair weak and prone to falling out. This shampoo doesn't just clean; it actually feels like it's repairing the bonds. I'm seeing significantly less hair on my comb and my ponytail feels thicker.\"",
                author: "Shalini Mehta",
                location: "Indore"
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-[#FAFAFA] p-8 rounded-sm border border-gray-100 flex flex-col items-start space-y-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex gap-0.5">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#111111] text-[#111111]" />
                  ))}
                </div>

                <div className="space-y-4 flex-grow">
                  <h3 className="text-lg font-bold text-[#111111] leading-snug">{review.title}</h3>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">{review.body}</p>
                </div>

                <div className="pt-6 border-t border-gray-100 w-full">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#111111]">{review.author}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free From Section */}
      <section className="bg-[#fafafa] py-16 text-center border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-10 block font-bold">Transparent Formulation</span>
          <div className="flex flex-wrap justify-center gap-12 md:gap-32">
            {[
              { label: "Sulphates", value: "0%" },
              { label: "Parabens", value: "0%" },
              { label: "Silicones", value: "0%" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100">
                  <span className="text-sm font-bold text-[#111111]">{item.value}</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Care */}
      <RelatedProducts
        currentProduct={product}
        onProductClick={onProductClick}
        settings={{
          heading: "Complete Your Routine",
          subtextText: "Clinically compatible products designed for synergistic scalp recovery.",
          limit: 3,
          showPairingLabel: true
        }}
      />
    </div>
  );
};

export default ProductDetail;
