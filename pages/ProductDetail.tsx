
import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import VisibleResultsSection from '../components/VisibleResultsSection';
import { MOCK_PRODUCTS } from '../constants';

interface ProductDetailProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onProductClick }) => {
  const [openSection, setOpenSection] = useState<string | null>('ingredients');
  const [quantity, setQuantity] = useState(1);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Gallery */}
        <div className="sticky top-24 space-y-4">
          <div className="aspect-[4/5] bg-gray-50 overflow-hidden rounded-sm">
            <img 
              src={product.imageUrl} 
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
              alt={product.title}
            />
          </div>
        </div>

        {/* Details - Simulated Shopify Product Form */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <nav className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center space-x-2">
              <span>Home</span>
              <span>/</span>
              <span>Hair Care</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#111111]">{product.title}</h1>
            <p className="text-[#6B8E23] text-xs font-bold uppercase tracking-widest">{product.subtitle}</p>
          </div>

          <div className="flex items-baseline space-x-4">
            <p className="text-2xl font-light text-[#111111]">${product.price.toFixed(2)}</p>
            <span className="text-gray-400 text-[10px] uppercase tracking-widest">Inclusive of all taxes</span>
          </div>

          <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base">
            {product.description}
          </p>

          {/* Shopify Product Form Simulation */}
          <div className="flex flex-col space-y-4 pt-4">
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Quantity</label>
               <div className="flex items-center space-x-4">
                  <div className="flex border border-gray-200 h-14 w-32">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 hover:bg-gray-50 transition-colors text-lg"
                    >-</button>
                    <div className="flex-[0.5] flex items-center justify-center text-sm font-medium">{quantity}</div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex-1 hover:bg-gray-50 transition-colors text-lg"
                    >+</button>
                  </div>
               </div>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <button className="w-full bg-[#111111] text-white h-14 text-xs font-medium tracking-widest uppercase hover:bg-black transition-all rounded-sm shadow-sm">
                Add to Bag
              </button>
              <button className="w-full border border-[#111111] text-[#111111] h-14 text-xs font-medium tracking-widest uppercase hover:bg-[#111111] hover:text-white transition-all rounded-sm">
                Buy It Now
              </button>
            </div>
          </div>

          {/* Accordions */}
          <div className="pt-8 border-t border-gray-50 space-y-1">
            <Accordion 
              title="Key Benefits" 
              isOpen={openSection === 'benefits'} 
              onClick={() => toggleSection('benefits')}
            >
              <ul className="space-y-3 text-sm text-gray-500 font-light">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#6B8E23] mt-0.5 shrink-0" />
                  <span>Targets scalp irritation and dandruff at the source.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#6B8E23] mt-0.5 shrink-0" />
                  <span>Dermatologically inspired herbal extract blend.</span>
                </li>
              </ul>
            </Accordion>

            <Accordion 
              title="Full Ingredients" 
              isOpen={openSection === 'ingredients'} 
              onClick={() => toggleSection('ingredients')}
            >
              <div className="space-y-5">
                {product.ingredients.map((ing, i) => (
                  <div key={i}>
                    <span className="block text-[11px] font-bold uppercase tracking-tight text-[#111111] mb-1">{ing.name}</span>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{ing.benefit}</p>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion 
              title="Application Guide" 
              isOpen={openSection === 'howtouse'} 
              onClick={() => toggleSection('howtouse')}
            >
              <div className="space-y-4">
                {product.howToUse.map((step, i) => (
                  <div key={i} className="flex space-x-4">
                    <span className="text-[#6B8E23] font-bold text-[10px] uppercase tracking-tighter shrink-0 pt-0.5">Step {i+1}</span>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Before/After Transformation */}
      <VisibleResultsSection onCtaClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />

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

const Accordion: React.FC<{ title: string; isOpen: boolean; onClick: () => void; children: React.ReactNode }> = ({ title, isOpen, onClick, children }) => {
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button 
        className="w-full py-5 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#111111] hover:text-[#6B8E23] transition-colors"
        onClick={onClick}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 opacity-30" /> : <ChevronDown className="w-4 h-4 opacity-30" />}
      </button>
      {isOpen && (
        <div className="pb-8 animate-in fade-in slide-in-from-top-1 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
