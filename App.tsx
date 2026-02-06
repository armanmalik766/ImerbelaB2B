
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { Product, Page } from './types';
import { MOCK_PRODUCTS } from './constants';
import { ShieldCheck, Leaf, Droplet, Microscope, Sprout, Feather, Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Simple page scroll reset
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, currentProduct]);

  const navigateToProduct = (product: Product) => {
    setCurrentProduct(product);
    setCurrentPage('product');
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    setCurrentProduct(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-[#111111]">
      <Navbar onNavigate={navigateToPage} currentPage={currentPage} />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home onProductClick={navigateToProduct} />
        )}

        {currentPage === 'product' && currentProduct && (
          <ProductDetail
            product={currentProduct}
            onProductClick={navigateToProduct}
          />
        )}

        {currentPage === 'ingredients' && (
          <section className="py-24 bg-[#F5F5F7]">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#6B8E23] mb-4 block">The Science Inside</span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111] mb-6">Transparent Formulations</h1>
                <p className="text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
                  We believe in radical transparency. Every ingredient in our formulations is selected for its specific clinical efficacy.
                  <span className="block mt-2 font-medium text-[#111111]">No fillers. No fluff. Just results.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from(new Map(MOCK_PRODUCTS.flatMap(p => p.ingredients).map(i => [i.name, i])).values()).map((ing, i) => (
                  <div
                    key={i}
                    className="group bg-white p-8 rounded-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 border border-gray-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Decorative Background Number */}
                    <span className="absolute -right-4 -top-8 text-[120px] font-bold text-gray-50 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none z-0 font-serif">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-mono text-gray-400 border border-gray-100 px-2 py-1 rounded-full">
                          0{i + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center group-hover:bg-[#6B8E23] transition-colors duration-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-white transition-colors"></div>
                        </div>
                      </div>

                      <h3 className="text-2xl font-serif italic text-[#111111] mb-4 group-hover:text-[#6B8E23] transition-colors">
                        {ing.name}
                      </h3>

                      <div className="h-[1px] w-12 bg-gray-100 mb-4 group-hover:w-full group-hover:bg-[#6B8E23]/30 transition-all duration-700"></div>

                      <p className="text-gray-500 text-sm font-light leading-relaxed">
                        {ing.benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'about' && (
          <>
            {/* Hero Section */}
            <section className="min-h-[90vh] grid grid-cols-1 md:grid-cols-2 bg-[#FAFAF9]">
              {/* Visual Side */}
              <div className="relative h-[60vh] md:h-auto w-full order-2 md:order-1 bg-gray-100 overflow-hidden group flex items-center justify-center">
                <img
                  src="./ab.png"
                  className="w-full h-auto max-h-full object-contain transition-transform duration-[2s] ease-in-out group-hover:scale-105"
                  alt="Modern Ayurveda"
                />
              </div>

              {/* Content Side */}
              <div className="flex flex-col justify-center p-10 md:p-24 lg:p-32 order-1 md:order-2 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="mb-12">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#6B8E23] font-bold block mb-6">Our Philosophy</span>
                  <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-[#111111] leading-[0.9]">
                    Restoring <br />
                    <span className="font-serif italic text-gray-400">Balance.</span>
                  </h1>
                </div>

                <div className="space-y-8 max-w-lg">
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-[#111111] border-l-2 border-[#111111] pl-6">
                    IMERBELA was born from a simple observation: modern haircare had forgotten the roots of scalp health.
                  </p>

                  <div className="space-y-6 text-gray-500 font-light text-sm leading-loose">
                    <p>
                      By combining high-purity clinical actives with pure Neem extracts, we've created a routine that doesn't just clean—it heals. We believe in the wisdom of subtraction.
                    </p>
                    <p>
                      We remove everything your hair doesn't need to leave room for everything it does. No synthetic fragrances. No harsh detergents. Just clinical results wrapped in nature.
                    </p>
                  </div>

                  <div className="pt-8">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_sample.svg" className="h-12 w-auto opacity-30 invert" alt="Founder Signature" style={{ filter: 'invert(1)' }} />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 block">Founder, IMERBELA</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: The 3 Pillars */}
            <section className="py-24 bg-white border-y border-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
                  <div className="space-y-6 group">
                    <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center group-hover:bg-[#6B8E23] transition-colors duration-500">
                      <Microscope className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111]">Clinical Purity</h3>
                    <p className="text-gray-500 font-light leading-relaxed text-sm">
                      We don't rely on myths. Every formulation is backed by rigorous clinical testing to ensure efficacy without compromising safety.
                    </p>
                  </div>
                  <div className="space-y-6 group">
                    <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center group-hover:bg-[#6B8E23] transition-colors duration-500">
                      <Sprout className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111]">Conscious Sourcing</h3>
                    <p className="text-gray-500 font-light leading-relaxed text-sm">
                      Our Neem is harvested from dedicated groves where soil health is paramount, ensuring the highest concentration of Nimbin.
                    </p>
                  </div>
                  <div className="space-y-6 group">
                    <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center group-hover:bg-[#6B8E23] transition-colors duration-500">
                      <Feather className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111]">Radical Transparency</h3>
                    <p className="text-gray-500 font-light leading-relaxed text-sm">
                      You deserve to know what goes on your scalp. We disclose every ingredient, its origin, and its specific purpose.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: The Process */}
            <section className="py-32 bg-[#111111] text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {/* Abstract pattern or gradient could go here */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6B8E23] rounded-full blur-[150px] mix-blend-overlay"></div>
              </div>
              <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="text-[#6B8E23] font-bold tracking-widest uppercase text-xs mb-4 block">The Methodology</span>
                  <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">Cold-Pressed. <br /> <span className="text-gray-500 font-serif italic">Never Heated.</span></h2>
                  <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
                    Heat kills potency. That's why we use a slow, cold-press extraction method for our Neem Oil. It takes 4x longer, but retians 100% of the bio-active compounds.
                  </p>
                  <div className="mt-12 grid grid-cols-2 gap-8">
                    <div>
                      <span className="block text-3xl font-light mb-1">24h</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Extraction Time</span>
                    </div>
                    <div>
                      <span className="block text-3xl font-light mb-1">100%</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Active Retention</span>
                    </div>
                  </div>
                </div>
                <div className="border border-white/10 p-8 rounded-sm backdrop-blur-sm">
                  <h3 className="text-xl font-light mb-6">Process Breakdown</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="flex items-center space-x-4">
                        <span className="text-[#6B8E23] font-serif italic text-2xl">0{num}</span>
                        <div className="h-[1px] bg-white/10 flex-grow"></div>
                        <span className="text-sm font-light uppercase tracking-wider text-gray-400">
                          {num === 1 ? 'Harvest & Selection' : num === 2 ? 'Cold Press Extraction' : 'Stabilization & Blending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPage === 'contact' && (
          <section className="min-h-screen bg-white text-[#111111] flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full py-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">

                {/* Contact Context */}
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

                {/* Minimal Form */}
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
        )}
      </main>

      <Footer onNavigate={navigateToPage} />
    </div>
  );
};

export default App;
