
import React, { useMemo } from 'react';
import { Product, SectionSettings } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProduct: Product;
  onProductClick: (product: Product) => void;
  settings: SectionSettings;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, onProductClick, settings }) => {
  const related = useMemo(() => {
    return MOCK_PRODUCTS
      .filter(p => p.id !== currentProduct.id)
      .slice(0, settings.limit);
  }, [currentProduct, settings.limit]);

  const isBestPair = (relatedProduct: Product) => {
    if (!settings.showPairingLabel) return false;
    if (currentProduct.category === 'shampoo' && relatedProduct.category === 'conditioner') return true;
    if (currentProduct.category === 'conditioner' && relatedProduct.category === 'shampoo') return true;
    return false;
  };

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-2">
            {settings.heading}
          </h2>
          <p className="text-gray-500 text-sm font-light max-w-xl">
            {settings.subtextText}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((product) => (
            <div 
              key={product.id} 
              className="cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <ProductCard 
                product={product} 
                isPaired={isBestPair(product)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
