import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, Product } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import {
  Package,
  Truck,
  TrendingUp,
  Shield,
  Users,
  MapPin,
  BarChart3,
  Headphones,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Quote,
  Leaf,
} from 'lucide-react';

interface WholesaleProps {
  onProductClick: (product: Product) => void;
}

const TRUST_STATS = [
  { value: '1000+', label: 'Retail Partners', icon: Users },
  { value: 'Pan India', label: 'Delivery Network', icon: MapPin },
  { value: '48hr', label: 'Fast Dispatch', icon: Zap },
  { value: '40%+', label: 'Profit Margins', icon: TrendingUp },
];

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'High Profit Margins',
    desc: 'Up to 40% margins on every unit. Built for sustainable business growth for our partners.',
  },
  {
    icon: BarChart3,
    title: 'Volume Discounts',
    desc: 'Tiered bulk pricing — the more you order, the more you save. Automatic price breaks.',
  },
  {
    icon: Truck,
    title: 'Fast Dispatch',
    desc: 'Orders dispatched within 48 hours. Reliable logistics across all major Indian cities.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'A personal account manager for every partner. Priority support via phone & WhatsApp.',
  },
  {
    icon: Shield,
    title: 'Authentic Products',
    desc: '100% genuine formulations. Every batch tested and certified for quality assurance.',
  },
  {
    icon: Package,
    title: 'Marketing Support',
    desc: 'POS displays, product samples, and co-branded marketing materials provided free.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Apply',
    desc: 'Submit your business details through our quick application form. Takes under 3 minutes.',
  },
  {
    step: '02',
    title: 'Get Approved',
    desc: 'Our team reviews your application within 24–48 hours and activates your account.',
  },
  {
    step: '03',
    title: 'Order in Bulk',
    desc: 'Access wholesale pricing, place bulk orders directly from your seller dashboard.',
  },
  {
    step: '04',
    title: 'Grow & Earn',
    desc: 'Receive fast delivery, sell premium Ayurvedic products, and maximize your margins.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    business: 'Ayur Beauty Store, Delhi',
    text: 'IMERBELA products fly off our shelves. The wholesale margins are the best I\'ve seen in the Ayurvedic segment. Reordering is seamless.',
    rating: 5,
  },
  {
    name: 'Rajesh Patel',
    business: 'Natural Care Mart, Mumbai',
    text: 'Fast dispatch, premium packaging, and customers love the results. Our repeat purchase rate is over 70% on IMERBELA products.',
    rating: 5,
  },
  {
    name: 'Anita Reddy',
    business: 'Herbal Hub, Bangalore',
    text: 'The dedicated support team is incredible. They helped us set up displays and even provided marketing materials. True partnership.',
    rating: 5,
  },
];

const Wholesale: React.FC<WholesaleProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response.success && response.data) {
          // Group products by base name (e.g. "shampoo-300ml") then pick the smallest bundle (3nos)
          const grouped: Record<string, Product> = {};
          response.data.forEach(p => {
             const baseHandle = p.handle.split('-').slice(0, -1).join('-');
             // Preference: pick '3nos' if available, else first one
             if (!grouped[baseHandle] || p.handle.includes('3nos')) {
               grouped[baseHandle] = p;
             }
          });
          setProducts(Object.values(grouped));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[90vh] bg-white text-[#111111] overflow-hidden flex items-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6B8E23] rounded-full blur-[200px] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6B8E23] rounded-full blur-[150px] opacity-5"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-[#6B8E23]"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#6B8E23] font-bold">
                  B2B Wholesale Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] text-[#111111]">
                India's Premium{' '}
                <span className="block font-serif italic text-[#6B8E23] mt-2">
                  Ayurvedic Wholesale
                </span>
                <span className="block mt-2">Partner.</span>
              </h1>

              <p className="text-gray-500 text-lg md:text-xl font-light max-w-lg leading-relaxed">
                Bulk pricing with high margins. Fast delivery across India.
                Join 1000+ retailers growing with science-backed Neem haircare.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/become-seller"
                  className="bg-[#6B8E23] text-white px-10 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#7da028] transition-all rounded-sm text-center shadow-lg shadow-[#6B8E23]/20 flex items-center justify-center gap-2"
                >
                  Become a Seller
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/seller-login"
                  className="border border-[#111111]/20 text-[#111111] px-10 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#111111] hover:text-white transition-all rounded-sm text-center backdrop-blur-sm"
                >
                  Login as Seller
                </Link>
              </div>
            </div>

            {/* Hero Image Composition */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-[420px] h-[520px]">
                {/* Main product image */}
                <div className="absolute inset-0 bg-gray-50 rounded-sm overflow-hidden shadow-2xl border border-gray-100">
                  <img
                    src="/shampoo-150ml.png"
                    className="w-full h-full object-cover opacity-90 mix-blend-luminosity hover:opacity-100 hover:mix-blend-normal transition-all duration-1000"
                    alt="IMERBELA Wholesale Products"
                  />
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-6 -left-8 bg-white text-[#111111] p-5 rounded-sm shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6B8E23]/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#6B8E23]" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">40%+</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Profit Margins</p>
                    </div>
                  </div>
                </div>
                {/* Floating partner card */}
                <div className="absolute -top-4 -right-6 bg-white text-[#111111] p-4 rounded-sm shadow-xl">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#6B8E23]" />
                    <span className="text-xs font-bold">1000+ Partners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST STATS BAR ═══ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="text-center group"
              >
                <div className="w-12 h-12 bg-[#F5F5F7] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-[#6B8E23] transition-colors duration-500">
                  <stat.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <p className="text-2xl md:text-3xl font-light text-[#111111] mb-1">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS SECTION ═══ */}
      <section className="py-24 md:py-32 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B8E23] font-bold block mb-4">
              Why Partner With Us
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111] mb-6">
              Built for{' '}
              <span className="font-serif italic text-gray-400">Business Growth</span>
            </h2>
            <p className="text-gray-500 font-light max-w-lg mx-auto">
              Everything you need to build a profitable Ayurvedic product line.
              No upfront fees. No hidden costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-sm border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-[#6B8E23]/20 transition-all duration-500 relative overflow-hidden"
              >
                <span className="absolute -right-4 -top-8 text-[100px] font-bold text-gray-50 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none z-0 font-serif">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6B8E23] transition-colors duration-500">
                    <benefit.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111] mb-3 group-hover:text-[#6B8E23] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B8E23] font-bold block mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111]">
              Start in{' '}
              <span className="font-serif italic text-gray-400">4 Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-[1px] bg-gray-200 z-0"></div>

            {HOW_IT_WORKS.map((item, idx) => (
              <div key={idx} className="relative z-10 text-center group">
                <div className="w-14 h-14 bg-[#111111] text-white rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-[#6B8E23] transition-colors duration-500 shadow-lg">
                  <span className="text-sm font-bold">{item.step}</span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#111111] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed max-w-[220px] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/become-seller"
              className="inline-flex items-center gap-2 bg-[#111111] text-white px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-sm shadow-sm"
            >
              Start Your Application
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS (B2B) ═══ */}
      <section className="py-24 md:py-32 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B8E23] font-bold block mb-4">
                Product Catalog
              </span>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111]">
                Wholesale{' '}
                <span className="font-serif italic text-gray-400">Products</span>
              </h2>
              <p className="text-gray-500 font-light mt-3 max-w-lg">
                Premium Ayurvedic haircare formulations. Login to view wholesale pricing and bulk discounts.
              </p>
            </div>
            <Link
              to="/bulk-order"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#6B8E23] border-b border-[#6B8E23] pb-1 hover:text-[#111111] hover:border-[#111111] transition-all self-start md:self-auto"
            >
              View Full Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mx-auto mb-4" />
                <p className="text-gray-400 text-sm italic">Sourcing premium products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 text-sm">No wholesale products found.</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => onProductClick(product)}
                  className="cursor-pointer"
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 md:py-32 bg-[#111111] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#6B8E23] rounded-full blur-[200px] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B8E23] font-bold block mb-4">
              Partner Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Trusted by{' '}
              <span className="font-serif italic text-gray-400">1000+ Retailers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-sm hover:bg-white/10 transition-all duration-500 group"
              >
                <Quote className="w-8 h-8 text-[#6B8E23]/30 mb-6 group-hover:text-[#6B8E23]/50 transition-colors" />
                <p className="text-gray-300 font-light leading-relaxed mb-8 text-sm">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#6B8E23] fill-[#6B8E23]" />
                  ))}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#6B8E23]/10 rounded-full mx-auto mb-8 flex items-center justify-center">
            <Leaf className="w-7 h-7 text-[#6B8E23]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-[#111111] mb-6">
            Ready to{' '}
            <span className="font-serif italic text-gray-400">Grow?</span>
          </h2>
          <p className="text-gray-500 font-light text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join India's fastest-growing Ayurvedic wholesale network.
            Premium products, unbeatable margins, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/become-seller"
              className="bg-[#111111] text-white px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-sm shadow-sm inline-flex items-center justify-center gap-2"
            >
              Apply Now — It's Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/distributor-program"
              className="border border-[#111111] text-[#111111] px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#111111] hover:text-white transition-all rounded-sm inline-flex items-center justify-center"
            >
              Distributor Program
            </Link>
          </div>
          <p className="mt-8 text-xs text-gray-400">
            No registration fees • Approval within 48 hours • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default Wholesale;
