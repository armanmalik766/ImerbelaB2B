
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import VisibleResultsSection from '../components/VisibleResultsSection';
import ScalpInsightsSection from '../components/ScalpInsightsSection';
import ShopByConcernsSection from '../components/ShopByConcernsSection';
import { ShieldCheck, Leaf, FlaskConical, Check, Info, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeProps {
  onProductClick: (product: Product) => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    title: "Clear Scalp.\nStrong Hair.",
    subtext: "Neem-powered haircare, inspired by science and modern Ayurveda.",
    image: "./im1.jpeg",
    ctaLabel: "Shop Shampoo",
    product: MOCK_PRODUCTS[0],
    color: "#fdfdfd"
  },
  {
    id: 2,
    title: "Deep Hydration.\nZero Weight.",
    subtext: "Intensive care that targets parched strands without the heavy build-up.",
    image: "im2.jpeg",
    ctaLabel: "Shop Conditioner",
    product: MOCK_PRODUCTS[1],
    color: "#f8f9f8"
  },
  {
    id: 3,
    title: "Root Strength.\nVisible Growth.",
    subtext: "Clinical strength support for hair follicle vitality and density.",
    image: "im4.jpeg",
    ctaLabel: "Shop Serum",
    product: MOCK_PRODUCTS[2],
    color: "#fafafa"
  }
];

const Home: React.FC<HomeProps> = ({ onProductClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Slider Section */}
      <section className="relative min-h-[85vh] grid grid-cols-1 overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`col-start-1 row-start-1 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            style={{ backgroundColor: slide.color }}
          >
            <div className="max-w-7xl mx-auto px-4 h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className={`space-y-6 md:space-y-10 text-center md:text-left transition-all duration-1000 delay-300 transform pt-20 md:pt-0 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                <h1 className="text-5xl md:text-8xl font-light tracking-tight leading-[1] text-[#111111] whitespace-pre-line">
                  {slide.title}
                </h1>
                <p className="text-gray-500 text-lg md:text-xl font-light max-w-md mx-auto md:mx-0">
                  {slide.subtext}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start pt-4">
                  <button
                    onClick={() => onProductClick(slide.product)}
                    className="bg-[#111111] text-white px-12 py-5 text-xs font-medium tracking-widest hover:bg-black transition-all uppercase rounded-sm shadow-sm"
                  >
                    {slide.ctaLabel}
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' })}
                    className="bg-white border border-[#111111] text-[#111111] px-12 py-5 text-xs font-medium tracking-widest hover:bg-[#111111] hover:text-white transition-all uppercase rounded-sm"
                  >
                    Learn Science
                  </button>
                </div>
              </div>
              <div className={`relative aspect-square md:aspect-[4/5] block transition-all duration-1000 transform mt-8 md:mt-0 ${index === currentSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                }`}>
                <img
                  src={slide.image}
                  className="w-full h-full object-cover rounded-sm grayscale-[15%]"
                  alt={`IMERBELA Slide ${slide.id}`}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-8">
          <button onClick={prevSlide} className="p-2 text-gray-400 hover:text-black transition-colors">
            <ChevronLeft className="w-5 h-5 stroke-1" />
          </button>

          <div className="flex space-x-3">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-12 h-[2px] transition-all duration-500 ${idx === currentSlide ? 'bg-black' : 'bg-gray-200'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button onClick={nextSlide} className="p-2 text-gray-400 hover:text-black transition-colors">
            <ChevronRight className="w-5 h-5 stroke-1" />
          </button>
        </div>
      </section>

      {/* Why IMERBELA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { icon: Leaf, title: "Neem Seed Kernel", desc: "Purity-grade extracts for maximum scalp therapeutic benefits." },
            { icon: FlaskConical, title: "Dermatologically Inspired", desc: "Dermatologically tested formulations for proven hair efficacy." },
            { icon: ShieldCheck, title: "Free From Harsh Chemicals", desc: "Zero sulfates, parabens, or synthetic silicones for hair integrity." }
          ].map((item, idx) => (
            <div key={idx} className="text-center space-y-5">
              <item.icon className="w-8 h-8 mx-auto text-[#6B8E23] stroke-[1.5px]" />
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#111111]">{item.title}</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-[280px] mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredient Spotlight Layout */}
      <section className="relative py-24 md:py-32 bg-[#F5F5F7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Image Composition */}
            <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center md:justify-start">
              {/* Decorative Background Text */}
              <span className="absolute -left-20 top-0 text-[120px] md:text-[200px] font-bold text-white leading-none select-none opacity-50 z-0">
                NEEM
              </span>

              {/* Main Image - Styled to look organic and large */}
              <img
                src="./in.png"
                className="relative z-10 h-full w-auto object-contain drop-shadow-2xl md:ml-12"
                alt="Neem Seed Kernel"
              />
            </div>

            {/* Content Card with Glassmorphism */}
            <div className="relative z-20 md:-ml-24">
              <div className="bg-white/70 backdrop-blur-xl p-8 md:p-14 border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-[1px] w-8 bg-[#6B8E23]"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B8E23] font-bold">The Core Active</span>
                </div>

                <h2 className="text-5xl md:text-6xl font-light tracking-tighter text-[#111111] mb-8 leading-[0.9]">
                  Neem Seed <br />
                  <span className="font-serif italic text-4xl md:text-5xl text-gray-400">Kernel Extract</span>
                </h2>

                <div className="space-y-8">
                  <div className="group">
                    <h4 className="flex items-center text-[10px] uppercase font-bold tracking-widest text-[#111111] mb-2 group-hover:text-[#6B8E23] transition-colors">
                      <FlaskConical className="w-3 h-3 mr-2" />
                      Bio-Active Potency
                    </h4>
                    <p className="text-gray-600 text-sm font-light leading-relaxed pl-5 border-l border-gray-200">
                      We discard the leaves. We keep the kernel. Rich in concentrated Nimbin, it targets the root cause of dandruff without drying the scalp.
                    </p>
                  </div>

                  <div className="group">
                    <h4 className="flex items-center text-[10px] uppercase font-bold tracking-widest text-[#111111] mb-2 group-hover:text-[#6B8E23] transition-colors">
                      <ShieldCheck className="w-3 h-3 mr-2" />
                      Microbiome Balance
                    </h4>
                    <p className="text-gray-600 text-sm font-light leading-relaxed pl-5 border-l border-gray-200">
                      Intelligently restores the scalp's natural defense barrier, reducing inflammation and preventing future flare-ups.
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Clinical Grade Purity</span>
                  <button
                    onClick={() => onProductClick(MOCK_PRODUCTS[0])}
                    className="text-xs uppercase tracking-widest border-b border-[#111111] pb-1 hover:text-[#6B8E23] hover:border-[#6B8E23] transition-all"
                  >
                    Shop Formulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scalp Insights Section */}
      <ScalpInsightsSection onCtaClick={() => onProductClick(MOCK_PRODUCTS[0])} />

      {/* Shop By Concerns Section - NEW */}
      <ShopByConcernsSection onProductClick={onProductClick} />

      {/* Visible Results Section */}
      <VisibleResultsSection onCtaClick={() => onProductClick(MOCK_PRODUCTS[0])} />

      {/* Featured Grid */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-light tracking-tight mb-4">The Routine</h2>
            <p className="text-gray-400 text-sm font-light">Minimal steps for maximum hair health.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MOCK_PRODUCTS.map(product => (
              <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-light tracking-tight text-center mb-16">The Journey to Healthier Hair</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Cleanse Scalp", desc: "Gentle removal of impurities without stripping natural oils." },
              { step: "02", title: "Reduce Dandruff", desc: "Targeted botanical action to eliminate visible flakes." },
              { step: "03", title: "Strengthen Roots", desc: "Nutrient delivery to support long-term hair resilience." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                <span className="text-[10px] font-bold text-[#6B8E23] uppercase tracking-widest">Step {item.step}</span>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
          <div className="flex items-center space-x-3">
            <Check className="w-4 h-4 text-[#6B8E23]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Made in India</span>
          </div>
          <div className="flex items-center space-x-3">
            <Heart className="w-4 h-4 text-[#6B8E23]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Cruelty Free</span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-4 h-4 text-[#6B8E23]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Clean Formulation</span>
          </div>
          <div className="flex items-center space-x-3">
            <Info className="w-4 h-4 text-[#6B8E23]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Transparent Sourcing</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
