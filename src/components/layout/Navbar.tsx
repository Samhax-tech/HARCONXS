import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Sparkles, Menu, X, LogIn, Truck, Shield } from 'lucide-react';
import { useStore, CurrencyCode } from '../../context/StoreContext';
import { CategoryType } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setSelectedCategory,
    cart,
    setIsCartOpen,
    wishlist,
    currency,
    setCurrency,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    isUserLoggedIn,
    currentUser,
    openAuthModalWithAction,
    setIsCommandPaletteOpen,
    setIsAiChatOpen
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavClick = (view: string, category?: CategoryType | 'all') => {
    if (category) {
      setSelectedCategory(category);
    }
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setCurrentView('home');
    } else {
      if (isAdminAuthenticated) {
        setIsAdminMode(true);
        setCurrentView('admin');
      } else {
        setIsAdminLoginModalOpen(true);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* ZONE 1: BRAND TITLE (Single line text element) */}
        <button
          onClick={() => handleNavClick('home', 'all')}
          className="text-left font-serif text-xl font-bold tracking-wider text-zinc-100 hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 cursor-pointer"
        >
          HARCONXS
        </button>

        {/* ZONE 2: 4-6 NAV LINKS (1-2 word labels, single line) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => handleNavClick('catalog', 'all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentView === 'catalog' ? 'text-white bg-zinc-800' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'couples')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentView === 'catalog' ? 'text-rose-400 bg-zinc-900' : 'text-zinc-300 hover:text-rose-300 hover:bg-zinc-900'
            }`}
          >
            Couples
          </button>
          <button
            onClick={() => handleNavClick('custom-builder')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentView === 'custom-builder' ? 'text-amber-300 bg-zinc-800' : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-900'
            }`}
          >
            Custom Orders
          </button>
          <button
            onClick={() => handleNavClick('couple-builder')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentView === 'couple-builder' ? 'text-rose-300 bg-zinc-800' : 'text-zinc-300 hover:text-rose-300 hover:bg-zinc-900'
            }`}
          >
            Couple Websites
          </button>
          <button
            onClick={() => handleNavClick('about-us')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentView === 'about-us' ? 'text-amber-400 bg-zinc-800' : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-900'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('contact-us')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentView === 'contact-us' ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* ZONE 3: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Ctrl+K trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-700/70 text-zinc-400 px-2.5 py-1.5 rounded-lg hover:border-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Search products, orders, commands (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="truncate max-w-[80px] xl:max-w-none">Search</span>
            <kbd className="bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700 font-mono">⌘K</kbd>
          </button>

          {/* AI Assistant button */}
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="hidden md:flex items-center gap-1 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1.5 rounded-lg hover:bg-amber-900/40 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">AI Gift Helper</span>
          </button>

          {/* Strict Currency Display (INR ₹) */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-amber-400 select-none">
            <span className="font-bold">₹ INR</span>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => handleNavClick('account')}
            className="relative p-2 text-zinc-300 hover:text-rose-400 transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer"
            title="Shopping Bag"
            aria-label="Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-[10px] font-bold text-zinc-950 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Sign In / Account Button */}
          {isUserLoggedIn && currentUser ? (
            <button
              onClick={() => handleNavClick('account')}
              className="flex items-center gap-1.5 p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-200 cursor-pointer transition-colors"
              title="My Account"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 font-bold text-[11px] flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-medium max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModalWithAction()}
              className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl text-xs text-zinc-200 font-semibold cursor-pointer transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Hidden Admin Indicator - Only shown when authenticated as Admin */}
          {isAdminAuthenticated && (
            <button
              onClick={handleAdminToggle}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isAdminMode
                  ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
              title="HAX Portal Active"
              aria-label="Admin Atelier Console"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-4 space-y-2">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleNavClick('catalog', 'all')}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              All Products
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'couples')}
              className="text-left px-3 py-2 text-sm text-rose-300 hover:bg-zinc-900 rounded-md font-medium"
            >
              Couples & Personalized
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'men')}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Men's Collection
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'women')}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Women's Collection
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'unisex')}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Unisex Carry Gear
            </button>
            <button
              onClick={() => handleNavClick('custom-builder')}
              className="text-left px-3 py-2 text-sm text-amber-300 hover:bg-zinc-900 rounded-md font-medium"
            >
              Create Custom Order
            </button>
            <button
              onClick={() => handleNavClick('couple-builder')}
              className="text-left px-3 py-2 text-sm text-rose-300 hover:bg-zinc-900 rounded-md"
            >
              Couple Website Builder
            </button>
            <button
              onClick={() => handleNavClick('about-us')}
              className="text-left px-3 py-2 text-sm text-amber-400 hover:bg-zinc-900 rounded-md"
            >
              About Us & YouTube Videos
            </button>
            <button
              onClick={() => handleNavClick('contact-us')}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Contact Us & Support
            </button>
            <button
              onClick={() => handleNavClick('tracking')}
              className="text-left px-3 py-2 text-sm text-amber-400 hover:bg-zinc-900 rounded-md font-medium flex items-center justify-between"
            >
              <span>Live Order Tracking</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => handleNavClick('account')}
              className="text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-md"
            >
              My Account & Orders
            </button>
            {isAdminAuthenticated && (
              <button
                onClick={handleAdminToggle}
                className="text-left px-3 py-2 text-sm text-amber-400 bg-amber-950/30 rounded-md font-medium flex items-center justify-between"
              >
                <span>{isAdminMode ? 'Exit Admin Mode' : 'HAX Admin Portal'}</span>
                <Shield className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
