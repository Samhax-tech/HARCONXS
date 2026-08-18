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

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-zinc-950">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
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
