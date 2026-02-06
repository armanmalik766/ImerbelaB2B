
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isPaired?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isPaired }) => {
  return (
    <div className="group relative flex flex-col h-full bg-white transition-all duration-300">
      {/* Paired Label */}
      {isPaired && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1 font-medium">
            Best paired with this
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden mb-4 bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 hidden md:flex">
          <button className="bg-white text-black px-8 py-3 text-sm font-medium tracking-wide shadow-sm hover:bg-black hover:text-white transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            View Product
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-1 px-1">
        <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-black transition-colors">
          {product.title}
        </h3>
        <p className="text-[12px] md:text-sm text-gray-500 font-light italic">
          {product.benefit}
        </p>
        <div className="pt-2 flex items-center justify-between">
          <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
          {/* Mobile CTA */}
          <button className="md:hidden text-[11px] font-bold uppercase tracking-tighter border-b border-black">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
