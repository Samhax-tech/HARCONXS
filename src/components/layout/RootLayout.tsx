import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';
import { Toast } from './Toast';
import { PolicyModal } from '../legal/PolicyModal';
import { CartDrawer } from '../cart/CartDrawer';
import { AiChatAssistant } from '../chat/AiChatAssistant';
import { PopupBanner } from './PopupBanner';
import { AdminLoginModal } from '../auth/AdminLoginModal';
import { AuthModal } from '../auth/AuthModal';
import { Analytics } from '../../services/analyticsService';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isEditorRoute = pathname.startsWith('/edit-page');
  const isCoupleRoute = pathname.startsWith('/couple/');

  // Scroll to top and track page view on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
    Analytics.trackPageView(pathname);
  }, [pathname]);

  // Full-screen isolated canvas layout for Visual Page Editor (No consumer headers/footers)
  if (isEditorRoute) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans w-full max-w-full overflow-hidden">
        <Outlet />
        <Toast />
        <AdminLoginModal />
      </div>
    );
  }

  // Pure standalone canvas layout for Couple Websites runtime (No consumer headers/footers/e-commerce modals)
  if (isCoupleRoute) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans w-full max-w-full">
        <Outlet />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-zinc-950 w-full max-w-full overflow-x-clip">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 w-full max-w-full min-w-0">
        <Outlet />
      </main>

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
