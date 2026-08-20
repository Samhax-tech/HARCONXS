import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Sparkles, Menu, X, LogIn, Truck, Shield, User, Bell, CheckCheck, ChevronRight, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    wishlist,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    isUserLoggedIn,
    currentUser,
    openAuthModalWithAction,
    setIsCommandPaletteOpen,
    setIsAiChatOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    themeConfig
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationTrayOpen, setIsNotificationTrayOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const siteName = themeConfig?.brand?.siteName || themeConfig?.siteName || 'HARCONXS';
  const logoUrl = themeConfig?.brand?.logoImageUrl || themeConfig?.logoImageUrl;
  const isSticky = themeConfig?.header?.headerSticky !== false;

  // Close notification popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationTrayOpen(false);
      }
    };
    if (isNotificationTrayOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationTrayOpen]);

  const handleAdminToggle = () => {
    if (isAdminAuthenticated) {
      navigate('/admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
      isActive
        ? 'text-white bg-zinc-800 font-semibold'
        : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
    }`;

  return (
    <header className={`${isSticky ? 'sticky top-0' : 'relative'} z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* ZONE 1: BRAND TITLE (Single line text element) */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-left font-serif text-xl font-bold tracking-wider text-zinc-100 hover:text-white transition-colors uppercase whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-8 w-auto max-w-[140px] object-contain" />
          ) : (
            <span>{siteName}</span>
          )}
        </Link>

        {/* ZONE 2: 4-6 NAV LINKS (1-2 word labels, single line) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/shop/couples" className={navLinkClass}>
            Couples
          </NavLink>
          <NavLink to="/custom-products" className={navLinkClass}>
            Custom Orders
          </NavLink>
          <NavLink to="/couple-websites" className={navLinkClass}>
            Couple Websites
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* ZONE 3: ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
          <div className="hidden xs:flex sm:flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-amber-400 select-none">
            <span className="font-bold">₹ INR</span>
          </div>

          {/* In-App Notification Center Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationTrayOpen(!isNotificationTrayOpen)}
              className="relative p-1.5 sm:p-2 text-zinc-300 hover:text-amber-400 transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-[10px] font-bold text-zinc-950 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Dropdown Quick Tray */}
            {isNotificationTrayOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="p-3.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-zinc-100">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {unreadNotificationsCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification Items List (Top 4 latest) */}
                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-900">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-500">
                      <Bell className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead) markNotificationAsRead(notif.id);
                          if (notif.actionUrl) {
                            setIsNotificationTrayOpen(false);
                            navigate(notif.actionUrl);
                          }
                        }}
                        className={`p-3.5 text-xs transition cursor-pointer hover:bg-zinc-900/80 flex items-start gap-3 ${
                          !notif.isRead ? 'bg-zinc-900/40' : 'opacity-80'
                        }`}
                      >
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h5 className={`truncate font-semibold ${!notif.isRead ? 'text-zinc-100' : 'text-zinc-300'}`}>
                              {notif.title}
                            </h5>
                            <span className="text-[10px] text-zinc-500 whitespace-nowrap shrink-0 font-mono">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-zinc-400 line-clamp-2 text-[11px]">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Link to /account/notifications */}
                <div className="p-2.5 bg-zinc-900/90 border-t border-zinc-800 text-center">
                  <Link
                    to="/account/notifications"
                    onClick={() => setIsNotificationTrayOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                  >
                    <span>Open Full Notification Center</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            to="/account/wishlist"
            className="relative p-1.5 sm:p-2 text-zinc-300 hover:text-rose-400 transition-colors rounded-lg hover:bg-zinc-900"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger / Link */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 sm:p-2 text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer"
            title="Shopping Bag"
            aria-label="Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-amber-500 text-[10px] font-bold text-zinc-950 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Sign In / Account Button */}
          {isUserLoggedIn && currentUser ? (
            <Link
              to="/account"
              className="flex items-center gap-1.5 p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-200 transition-colors"
              title="My Account"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 font-bold text-[11px] flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-medium max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl text-xs text-zinc-200 font-semibold transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Admin Indicator */}
          {isAdminAuthenticated && (
            <Link
              to="/admin"
              className={`p-2 rounded-lg transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
              title="HAX Admin Portal"
              aria-label="Admin Atelier Console"
            >
              <Shield className="w-4 h-4" />
            </Link>
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
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              All Products
            </Link>
            <Link
              to="/shop/couples"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-rose-300 hover:bg-zinc-900 rounded-md font-medium"
            >
              Couples & Personalized
            </Link>
            <Link
              to="/shop/men"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Men's Collection
            </Link>
            <Link
              to="/shop/women"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Women's Collection
            </Link>
            <Link
              to="/shop/unisex"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Unisex Carry Gear
            </Link>
            <Link
              to="/custom-products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-amber-300 hover:bg-zinc-900 rounded-md font-medium"
            >
              Create Custom Order
            </Link>
            <Link
              to="/couple-websites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-rose-300 hover:bg-zinc-900 rounded-md"
            >
              Couple Website Builder
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-amber-400 hover:bg-zinc-900 rounded-md"
            >
              About Us & Story
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 rounded-md"
            >
              Contact Us & Support
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-md"
            >
              FAQ & Help Center
            </Link>
            <Link
              to="/reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-md"
            >
              Customer Reviews
            </Link>
            <Link
              to="/account/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-amber-400 hover:bg-zinc-900 rounded-md font-medium flex items-center justify-between"
            >
              <span>Live Order Tracking</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </Link>
            <Link
              to="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-md"
            >
              My Account & Orders
            </Link>
            {isAdminAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left px-3 py-2 text-sm text-amber-400 bg-amber-950/30 rounded-md font-medium flex items-center justify-between"
              >
                <span>HAX Admin Portal</span>
                <Shield className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
