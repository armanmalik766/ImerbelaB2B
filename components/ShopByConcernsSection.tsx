
import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface Concern {
  id: string;
  label: string;
  imageUrl: string;
  targetProduct: Product;
}

interface ShopByConcernsSectionProps {
  onProductClick: (product: Product) => void;
}

const CONCERNS: Concern[] = [
  {
    id: 'dandruff',
    label: 'Dandruff / Flaky Scalp',
    imageUrl: '/shampoo-150ml.png',
    targetProduct: MOCK_PRODUCTS[0]
  },
  {
    id: 'hair-fall',
    label: 'Hair Fall & Weak Roots',
    imageUrl: '/conditioner-150ml.png',
    targetProduct: MOCK_PRODUCTS[2]
  },
  {
    id: 'dry-scalp',
    label: 'Dry & Itchy Scalp',
    imageUrl: '/shampoo-150ml.png',
    targetProduct: MOCK_PRODUCTS[1]
  },
  {
    id: 'oily-scalp',
    label: 'Oily Scalp & Build-up',
    imageUrl: '/serum.jpeg',
    targetProduct: MOCK_PRODUCTS[0]
  }
];

const ShopByConcernsSection: React.FC<ShopByConcernsSectionProps> = ({ onProductClick }) => {
  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#111111]">
            Shop by Hair Concerns
          </h2>
          <div className="w-12 h-[1px] bg-[#6B8E23] mt-4"></div>
        </div>

        {/* Desktop/Tablet Grid & Mobile Swipeable Container */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 md:gap-8 pb-8 md:pb-0 no-scrollbar snap-x snap-mandatory">
          {CONCERNS.map((concern) => (
            <div 
              key={concern.id}
              onClick={() => onProductClick(concern.targetProduct)}
              className="flex-shrink-0 w-[70vw] md:w-full group cursor-pointer snap-center"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-50 rounded-sm mb-4">
                <img 
                  src={concern.imageUrl} 
                  alt={concern.label}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale-[20%]"
                  loading="lazy"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 group-hover:text-[#6B8E23] transition-colors duration-300">
                  {concern.label}
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Identify Solution →
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByConcernsSection;
