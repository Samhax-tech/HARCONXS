import React from 'react';
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

const MainContent: React.FC = () => {
  const { currentView } = useStore();

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
