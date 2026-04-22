
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, X, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isApproved, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const navLinks = [
    { href: 'https://imerbela.com', label: 'Retail Store', external: true },
    { to: '/seller', label: 'Seller' },
    { to: '/bulk-order', label: 'Seller Marketplace' },
    ...(isAuthenticated ? [{ to: isAdmin ? '/admin' : '/seller-dashboard', label: 'Dashboard' }] : []),
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-black backdrop-blur-sm border-b border-white/5">
      {/* B2B Announcement Bar */}
      <div className="bg-white text-black text-center py-2 border-b border-gray-100">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2">
          <Package className="w-3 h-3 text-[#6B8E23]" />
          <span>B2B Seller Platform — Exclusive for Business Partners</span>
          <span className="hidden sm:inline text-gray-200 mx-2">|</span>
          <Link to="/become-seller" className="hidden sm:inline text-[#6B8E23] hover:text-[#556B2F] transition-colors font-black">
            Apply Now →
          </Link>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 md:h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-5 h-5 md:hidden cursor-pointer text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
          <div className="hidden md:flex space-x-8 text-[11px] font-medium uppercase tracking-widest">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#6B8E23] transition-all duration-300 font-bold"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to!}
                  className={`hover:text-[#6B8E23] transition-colors ${isActive(link.to!) ? 'text-[#6B8E23]' : 'text-white'
                    } hover:text-[#6B8E23] transition-all duration-300 font-bold`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>

        <Link to="/" className="flex items-center">
          <img src="/imerbela_logo.png" alt="IMERBELA" className="h-16 md:h-22 w-auto object-contain" />
        </Link>

        <div className="flex items-center space-x-4 md:space-x-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hidden md:block text-white" />

          {/* User icon with auth state */}
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/seller-dashboard') : '/seller-login'}
            className="relative hidden md:flex items-center gap-1.5"
            title={isAuthenticated ? 'Dashboard' : 'B2B Login'}
          >
            <User className="w-5 h-5 cursor-pointer" />
            {isAuthenticated && (
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${isApproved ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
            )}
          </Link>

          {/* Cart with count */}
          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingBag className="w-5 h-5" />
            <span className={`absolute -top-1 -right-1 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${itemCount > 0 ? 'bg-[#6B8E23]' : 'bg-black'
              }`}>
              {itemCount > 99 ? '99' : itemCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white shadow-2xl transform transition-transform duration-500 ease-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <span className="text-lg font-bold tracking-[0.2em] uppercase text-[#111111]">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3.5 text-sm font-medium text-gray-500 hover:text-[#6B8E23] hover:bg-[#6B8E23]/5 rounded-xl transition-all"
                    >
                      <span className="flex-1 uppercase tracking-widest">{link.label}</span>
                      <Package className="w-4 h-4 opacity-30" />
                    </a>
                  ) : (
                    <Link
                      to={link.to!}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 text-sm rounded-xl transition-all ${isActive(link.to!)
                        ? 'bg-[#6B8E23] text-white shadow-lg shadow-[#6B8E23]/20'
                        : 'text-gray-500 hover:text-[#6B8E23] hover:bg-[#6B8E23]/5 shadow-none'
                        }`}
                    >
                      <span className="flex-1 uppercase tracking-widest">{link.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 space-y-2">
              <p className="px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Account & Support</p>

              <Link
                to={isAuthenticated ? (isAdmin ? '/admin' : '/seller-dashboard') : '/seller-login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <User className="w-4 h-4 text-[#6B8E23]" />
                <span className="uppercase tracking-widest">{isAuthenticated ? 'Dashboard' : 'B2B Login'}</span>
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/become-seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <Package className="w-4 h-4 text-[#6B8E23]" />
                  <span className="uppercase tracking-widest">Become a Seller</span>
                </Link>
              )}

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#6B8E23]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="uppercase tracking-widest">My Cart</span>
              </Link>
            </div>
          </div>

          <div className="p-6 border-t border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#6B8E23]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#111111] uppercase tracking-wider">B2B Seller</p>
                <p className="text-[9px] text-gray-400">Premium Ayurvedic Skincare</p>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 leading-relaxed">
              Access seller pricing and exclusive bulk offers for business partners.
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
