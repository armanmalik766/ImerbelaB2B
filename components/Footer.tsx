
import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-16 md:py-24 border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-12 text-center md:text-left items-start">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-start justify-center md:justify-start mb-6 md:-mt-4 md:-ml-4">
            <img src="/imerbela_logo.png" alt="IMERBELA" className="h-20 md:h-28 w-auto object-contain" />
          </Link>
          <div className="flex items-center justify-center md:justify-start gap-1.5 mb-4">
            <Package className="w-3 h-3 text-[#6B8E23]" />
            <span className="text-[9px] uppercase tracking-widest text-[#6B8E23] font-bold">B2B Wholesale</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
            Science-backed, minimalist hair care powered by the ancient wisdom of Neem. Exclusively for wholesale partners.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold">Products</h4>
          <ul className="text-xs space-y-2 text-gray-400 uppercase tracking-tight">
            <li><Link to="/" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/bulk-order" className="hover:text-[#6B8E23] transition-colors font-medium">Bulk Order</Link></li>
            <li><button className="hover:text-white transition-colors">Bestsellers</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold">Wholesale</h4>
          <ul className="text-xs space-y-2 text-gray-400 uppercase tracking-tight">
            <li><Link to="/wholesale" className="hover:text-[#6B8E23] transition-colors font-medium">Wholesale Hub</Link></li>
            <li><Link to="/distributor-program" className="hover:text-[#6B8E23] transition-colors font-medium">Distributor Program</Link></li>
            <li><Link to="/become-seller" className="hover:text-[#6B8E23] transition-colors font-medium">Become a Seller</Link></li>
            <li><Link to="/seller-login" className="hover:text-white transition-colors">B2B Login</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold">Brand</h4>
          <ul className="text-xs space-y-2 text-gray-400 uppercase tracking-tight">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><a href="https://imerbela.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Main Website</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold">Policies</h4>
          <ul className="text-xs space-y-2 text-gray-400 uppercase tracking-tight">
            <li><button className="hover:text-white transition-colors">Wholesale Terms</button></li>
            <li><button className="hover:text-white transition-colors">Shipping</button></li>
            <li><button className="hover:text-white transition-colors">Returns</button></li>
            <li><button className="hover:text-white transition-colors">Privacy</button></li>
          </ul>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-12 mt-12 border-t border-white/5">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8">
          {['Trusted by 1000+ Retailers', 'Pan India Delivery', 'High Margin Products', 'Dedicated B2B Support'].map((item, idx) => (
            <span key={idx} className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#6B8E23]"></span>
              {item}
            </span>
          ))}
        </div>
        <p className="text-gray-400 text-[10px] tracking-widest uppercase text-center">
          © 2024 Imerbela. Wholesale B2B Platform. Minimal. Science-Led. Honest.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
