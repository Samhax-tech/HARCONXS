import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { Toast } from './components/layout/Toast';
import { PolicyModal } from './components/legal/PolicyModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { AiChatAssistant } from './components/chat/AiChatAssistant';
import { PopupBanner } from './components/layout/PopupBanner';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { AuthModal } from './components/auth/AuthModal';

// Home Views
import { HeroSection } from './components/home/HeroSection';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedSection } from './components/home/FeaturedSection';

// Shop & Product
import { CatalogPage } from './components/shop/CatalogPage';
import { ProductDetailPage } from './components/shop/ProductDetailPage';

// Custom & Bespoke
import { CustomOrderBuilder } from './components/custom/CustomOrderBuilder';
import { CustomOrderPortal } from './components/custom/CustomOrderPortal';

// Couple Sanctuaries
import { CoupleWebsiteBuilder } from './components/couple/CoupleWebsiteBuilder';

// Digital & Bot Panels
import { BotPanelsPage } from './components/digital/BotPanelsPage';

// Checkout & Accounts
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { UserAccountDashboard } from './components/account/UserAccountDashboard';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { EmailNotificationCenter } from './components/account/EmailNotificationCenter';

// Company & Helpdesk
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';

// Master Admin Suite
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Shield, Lock } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen
  } = useStore();

  // Hidden admin portal route listener (/hax-portal)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/hax-portal' || path.startsWith('/hax-portal') || hash === '#hax-portal' || window.location.search.includes('portal=hax')) {
        if (isAdminAuthenticated) {
          setIsAdminMode(true);
          setCurrentView('admin');
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, [isAdminAuthenticated, setIsAdminMode, setCurrentView, setIsAdminLoginModalOpen]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-0">
            <HeroSection />
            <CategoryGrid />
            <FeaturedSection />
          </div>
        );
      case 'catalog':
        return <CatalogPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'custom-builder':
        return <CustomOrderBuilder />;
      case 'custom-portal':
        return <CustomOrderPortal />;
      case 'couple-builder':
        return <CoupleWebsiteBuilder />;
      case 'bot-panels':
        return <BotPanelsPage />;
      case 'about-us':
        return <AboutUsPage />;
      case 'contact-us':
        return <ContactUsPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'account':
        return <UserAccountDashboard />;
      case 'tracking':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <OrderTrackingView />
          </div>
        );
      case 'emails':
        return <EmailNotificationCenter standalone />;
      case 'admin':
        if (!isAdminAuthenticated) {
          return (
            <div className="bg-zinc-950 min-h-[75vh] flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold font-serif text-white">HAX Protected Admin Gateway</h2>
                  <p className="text-xs text-zinc-400">
                    Restricted atelier credentials required. Please authorize via your master administrator pin.
                  </p>
                </div>
                <button
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Master Session</span>
                </button>
              </div>
            </div>
          );
        }
        return <AdminDashboard />;
      default:
        return (
          <div className="space-y-0">
            <HeroSection />
            <CategoryGrid />
            <FeaturedSection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-zinc-950">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1">
        {renderView()}
      </div>

      <Footer />

      {/* Global Modals & Overlays */}
      <PopupBanner />
      <AdminLoginModal />
      <AuthModal />
      <CartDrawer />
      <AiChatAssistant />
      <CommandPalette />
      <PolicyModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
