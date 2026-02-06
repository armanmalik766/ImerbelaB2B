
import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="col-span-1 md:col-span-1">
          <div className="text-xl font-semibold tracking-[0.3em] uppercase mb-6">IMERBELA</div>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
            Science-backed, minimalist hair care powered by the ancient wisdom of Neem.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold">Shop</h4>
          <ul className="text-xs space-y-2 text-gray-500 uppercase tracking-tight">
            <li><button onClick={() => onNavigate('home')} className="hover:text-black">All Products</button></li>
            <li><button className="hover:text-black">Regimens</button></li>
            <li><button className="hover:text-black">Bestsellers</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold">Brand</h4>
          <ul className="text-xs space-y-2 text-gray-500 uppercase tracking-tight">
            <li><button onClick={() => onNavigate('about')} className="hover:text-black">Our Story</button></li>
            <li><button onClick={() => onNavigate('ingredients')} className="hover:text-black">Ingredients</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-black">Contact</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest font-bold">Policies</h4>
          <ul className="text-xs space-y-2 text-gray-500 uppercase tracking-tight">
            <li><button className="hover:text-black">Shipping</button></li>
            <li><button className="hover:text-black">Returns</button></li>
            <li><button className="hover:text-black">Privacy</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-16 mt-16 border-t border-gray-50 text-center">
        <p className="text-gray-400 text-[10px] tracking-widest uppercase">© 2024 Imerbela Skincare. Minimal. Science-Led. Honest.</p>
      </div>
    </footer>
  );
};

export default Footer;
