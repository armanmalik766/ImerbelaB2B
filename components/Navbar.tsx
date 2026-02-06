
import React from 'react';
import { Menu, Search, User, ShoppingBag } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Menu className="w-5 h-5 md:hidden cursor-pointer" />
          <div className="hidden md:flex space-x-8 text-[11px] font-medium uppercase tracking-widest">
            <button onClick={() => onNavigate('home')} className={`hover:text-gray-400 transition-colors ${currentPage === 'home' ? 'text-black' : 'text-gray-500'}`}>Home</button>
            <button onClick={() => onNavigate('ingredients')} className={`hover:text-gray-400 transition-colors ${currentPage === 'ingredients' ? 'text-black' : 'text-gray-500'}`}>Ingredients</button>
            <button onClick={() => onNavigate('about')} className={`hover:text-gray-400 transition-colors ${currentPage === 'about' ? 'text-black' : 'text-gray-500'}`}>Science</button>
            <button onClick={() => onNavigate('contact')} className={`hover:text-gray-400 transition-colors ${currentPage === 'contact' ? 'text-black' : 'text-gray-500'}`}>Contact</button>
          </div>
        </div>
        
        <div onClick={() => onNavigate('home')} className="text-xl md:text-2xl font-semibold tracking-[0.3em] uppercase cursor-pointer">
          IMERBELA
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <Search className="w-5 h-5 cursor-pointer hidden md:block" />
          <User className="w-5 h-5 cursor-pointer hidden md:block" />
          <div className="relative cursor-pointer">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
