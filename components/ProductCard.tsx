
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert, Package, TrendingDown } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isPaired?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isPaired }) => {
  const { isAuthenticated, isApproved, isPending } = useAuth();

  const canViewPrice = isAuthenticated && isApproved;
  const hasBulkDiscount = product.bulkPricing && product.bulkPricing.length > 1;

  return (
    <div className="group relative flex flex-col h-full bg-white transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isPaired && (
          <span className="bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1 font-medium">
            Best paired with this
          </span>
        )}
        {product.isB2BOnly && (
          <span className="bg-[#6B8E23] text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-sm flex items-center gap-1">
            <Package className="w-3 h-3" />
            B2B Only
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative aspect-square md:aspect-[4/5] overflow-hidden mb-4 bg-white flex items-center justify-center">
        <img
          src={product.imageUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}` : product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 p-2"
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
      <div className="flex flex-col space-y-1.5 px-1 flex-1">
        <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-black transition-colors">
          {product.title}
        </h3>
        <p className="text-[12px] md:text-sm text-gray-500 font-light italic">
          {product.benefit}
        </p>

        {/* Price Section */}
        <div className="pt-2 mt-auto border-t border-gray-50 mt-4">
          {canViewPrice ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Wholesale Price</p>
                  <p className="text-base font-bold text-[#111111]">₹{product.price.toFixed(0)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#6B8E23] px-2 py-0.5 bg-[#6B8E23]/5 rounded-full uppercase">
                    {product.handle.match(/(\d+)nos/)?.[1] || 'Bundle'} Nos
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                {product.subtitle} available in 3, 6, & 12 Nos
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {!isAuthenticated ? (
                <>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      Seller Price
                    </span>
                  </div>
                  <Link
                    to="/seller-login"
                    className="inline-block text-[10px] uppercase tracking-widest font-bold text-[#6B8E23] border-b border-[#6B8E23] pb-0.5 hover:text-[#111111] hover:border-[#111111] transition-colors"
                  >
                    Login to View Price →
                  </Link>
                </>
              ) : isPending ? (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Account Under Review
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-red-500">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Account Not Approved
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
