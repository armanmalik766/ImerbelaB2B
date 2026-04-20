import React, { useMemo } from 'react';
import { Product, SectionSettings } from '../types';
import { getProducts } from '../services/api';
import { Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProduct: Product;
  onProductClick: (product: Product) => void;
  settings: SectionSettings;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, onProductClick, settings }) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProducts(currentProduct.category);
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch related products', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentProduct.category]);

  const related = useMemo(() => {
    return products
      .filter(p => p._id !== currentProduct._id)
      .slice(0, settings.limit);
  }, [products, currentProduct._id, settings.limit]);

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
             <Loader2 className="w-6 h-6 animate-spin text-[#6B8E23] mb-4" />
             <p className="text-sm text-gray-400 font-light italic">Finding routine complements...</p>
          </div>
        ) : related.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 font-light">Explore our other categories for ritual pairings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((product) => (
              <div 
                key={product._id} 
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
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
