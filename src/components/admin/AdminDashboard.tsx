import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Sparkles,
  Heart,
  Bot,
  Terminal,
  Tag,
  FileText,
  TrendingUp,
  Settings,
  ShieldCheck,
  RotateCcw,
  Search,
  ExternalLink,
  Plus,
  KeyRound,
  Lock,
  ChevronRight,
  Database,
  Activity,
  Layers
} from 'lucide-react';

// Modular Admin Sections
import { CatalogAdminSection } from './sections/CatalogAdminSection';
import { OrdersAdminSection } from './sections/OrdersAdminSection';
import { CustomersAdminSection } from './sections/CustomersAdminSection';
import { CustomOrdersAdminSection } from './sections/CustomOrdersAdminSection';
import { CoupleWebsitesAdminSection } from './sections/CoupleWebsitesAdminSection';
import { BotPanelsAdminSection } from './sections/BotPanelsAdminSection';
import { MarketingAdminSection } from './sections/MarketingAdminSection';
import { ContentAdminSection } from './sections/ContentAdminSection';
import { AnalyticsAdminSection } from './sections/AnalyticsAdminSection';
import { SettingsAdminSection } from './sections/SettingsAdminSection';
import { AdminApiConsole } from './AdminApiConsole';
import { SupabaseSqlEditor } from './SupabaseSqlEditor';
import { EmailNotificationCenter } from '../account/EmailNotificationCenter';
import { AdminReviewsModeration } from './AdminReviewsModeration';
import { BillingAuthArchitectureGuide } from './BillingAuthArchitectureGuide';
import { getAdminSession, enforceServerSidePermission } from '../../services/adminAuthService';

export type MainAdminSection = 
  | 'dashboard'
  | 'catalog'
  | 'orders'
  | 'customers'
  | 'custom-orders'
  | 'couple-websites'
  | 'bot-panels'
  | 'private-api'
  | 'marketing'
  | 'content'
  | 'analytics'
  | 'settings'
  | 'sql-editor'
  | 'system-health';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    customOrders,
    coupleTemplates,
    formatPrice,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    adminLogout,
    showToast
  } = useStore();

  const navigate = useNavigate();

  // Navigation state
  const [mainSection, setMainSection] = useState<MainAdminSection>('dashboard');
  const [subSection, setSubSection] = useState<string>('overview');
  const [adminSearch, setAdminSearch] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const { user: authUser, role: authRole, logout: authLogout } = useAuth();
  const adminName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Admin';
  const adminRoleDisplay = (authRole || 'admin').toUpperCase();

  // 1. ADMIN LOCK SCREEN GATE
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">
              Admin Access Protected
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This area is restricted to HARCONXS authorized atelier administrators. Please authenticate with Supabase Auth credentials to access the ecommerce administrative suite.
            </p>
          </div>

          <button
            id="admin-unlock-console-btn"
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="w-full min-h-[48px] py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Admin Atelier Console</span>
          </button>
        </div>
      </div>
    );
  }

  // Aggregated Stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0) || 148500;
  const totalProfit = Math.round(totalRevenue * 0.68);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const navigateToSection = (main: MainAdminSection, sub: string) => {
    setMainSection(main);
    setSubSection(sub);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col md:flex-row pb-20 w-full max-w-full overflow-x-clip">
      
      {/* MOBILE TOP BAR (Only visible on < md viewports) */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-serif font-bold text-xs">
            HX
          </div>
          <div>
            <div className="font-serif font-bold text-xs text-zinc-100 capitalize">
              {mainSection.replace('-', ' ')}
            </div>
            <div className="text-[10px] font-mono text-amber-400">Atelier Console</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/edit-page')}
            className="px-2.5 py-1.5 min-h-[36px] rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER OVERLAY */}
      {isMobileNavOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileNavOpen(false)}
        >
          <div 
            className="w-4/5 max-w-sm h-full bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-serif font-bold text-xs">
                    HX
                  </div>
                  <span className="font-serif font-bold text-sm text-zinc-100">HARCONXS Admin</span>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items in mobile drawer */}
              <nav className="space-y-1 text-xs">
                <button
                  onClick={() => navigateToSection('dashboard', 'overview')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'dashboard' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </button>

                <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Commerce & Atelier
                </div>

                <button
                  onClick={() => navigateToSection('catalog', 'products')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'catalog' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Catalog & Inventory</span>
                </button>

                <button
                  onClick={() => navigateToSection('orders', 'orders')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'orders' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders & Logistics ({orders.length})</span>
                </button>

                <button
                  onClick={() => navigateToSection('customers', 'customers')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'customers' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Customers & CRM</span>
                </button>

                <button
                  onClick={() => navigateToSection('custom-orders', 'custom')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'custom-orders' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Custom Orders & Quotes</span>
                </button>

                <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Digital Verticals
                </div>

                <button
                  onClick={() => navigateToSection('couple-websites', 'couple-templates')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'couple-websites' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Couple Websites</span>
                </button>

                <button
                  onClick={() => navigateToSection('bot-panels', 'bot-plans')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'bot-panels' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>Bot Panels & Services</span>
                </button>

                <button
                  onClick={() => navigateToSection('private-api', 'api-clients')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'private-api' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Private API Platform</span>
                </button>

                <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Growth & Experience
                </div>

                <button
                  onClick={() => navigateToSection('marketing', 'coupons')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'marketing' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Marketing & Loyalty</span>
                </button>

                <button
                  onClick={() => navigateToSection('content', 'pages')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'content' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Content, CMS & SEO</span>
                </button>

                <button
                  onClick={() => navigateToSection('analytics', 'analytics-sales')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'analytics' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics & Funnels</span>
                </button>

                <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Administration & Security
                </div>

                <button
                  onClick={() => navigateToSection('settings', 'settings-general')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'settings' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings & Staff RBAC</span>
                </button>

                <button
                  onClick={() => navigateToSection('sql-editor', 'sql-console')}
                  className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium cursor-pointer ${
                    mainSection === 'sql-editor' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Supabase SQL Studio</span>
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono truncate">{adminName}</span>
              <button
                onClick={adminLogout}
                className="px-3 py-1.5 min-h-[38px] text-xs text-rose-400 bg-rose-500/10 rounded-lg font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION (Hidden on < md viewports) */}
      <aside className="hidden md:flex w-64 bg-zinc-900 border-r border-zinc-800 flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-serif font-bold text-sm">
                HX
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm tracking-wider text-zinc-100">HARCONXS</h2>
                <span className="text-[10px] font-mono text-amber-400 block -mt-0.5">Atelier Administration</span>
              </div>
            </div>
            <button
              onClick={adminLogout}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg text-xs cursor-pointer transition-colors"
              title="Logout Admin"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs max-h-[calc(100vh-140px)] overflow-y-auto">
            
            {/* Visual Website Editor Studio Link */}
            <div className="pb-2">
              <button
                id="admin-launch-page-editor-btn"
                onClick={() => navigate('/edit-page')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-400/20 to-amber-400/10 border border-amber-400/40 text-amber-300 hover:from-amber-400/30 hover:to-amber-400/20 transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-amber-300">Website Editor</div>
                    <div className="text-[9px] text-amber-400/80 font-mono">/edit-page Studio</div>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-amber-400/70" />
              </button>
            </div>

            {/* Dashboard Overview */}
            <button
              id="sidebar-nav-dashboard"
              onClick={() => navigateToSection('dashboard', 'overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'dashboard' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* 1. Catalog & Products */}
            <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Commerce & Atelier
            </div>

            <button
              id="sidebar-nav-catalog"
              onClick={() => navigateToSection('catalog', 'products')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'catalog' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog & Inventory</span>
            </button>

            {/* 2. Orders & Logistics */}
            <button
              id="sidebar-nav-orders"
              onClick={() => navigateToSection('orders', 'orders')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'orders' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Shipping ({orders.length})</span>
            </button>

            {/* 3. Customers & CRM */}
            <button
              id="sidebar-nav-customers"
              onClick={() => navigateToSection('customers', 'customers')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'customers' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers & CRM</span>
            </button>

            {/* 4. Custom Bespoke Orders */}
            <button
              id="sidebar-nav-custom-orders"
              onClick={() => navigateToSection('custom-orders', 'custom')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'custom-orders' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Custom Orders & Quotes</span>
            </button>

            {/* Digital Verticals */}
            <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Digital Verticals
            </div>

            {/* 5. Couple Websites */}
            <button
              id="sidebar-nav-couple-websites"
              onClick={() => navigateToSection('couple-websites', 'couple-templates')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'couple-websites' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Couple Websites</span>
            </button>

            {/* 6. Bot Panels */}
            <button
              id="sidebar-nav-bot-panels"
              onClick={() => navigateToSection('bot-panels', 'bot-plans')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'bot-panels' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Bot Panels & Services</span>
            </button>

            {/* 7. Private API */}
            <button
              id="sidebar-nav-private-api"
              onClick={() => navigateToSection('private-api', 'api-clients')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'private-api' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Private API Platform</span>
            </button>

            {/* Growth & Content */}
            <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Growth & Experience
            </div>

            {/* 8. Marketing */}
            <button
              id="sidebar-nav-marketing"
              onClick={() => navigateToSection('marketing', 'coupons')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'marketing' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Marketing & Loyalty</span>
            </button>

            {/* 9. Content & CMS */}
            <button
              id="sidebar-nav-content"
              onClick={() => navigateToSection('content', 'pages')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'content' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Content, CMS & SEO</span>
            </button>

            {/* 10. Analytics */}
            <button
              id="sidebar-nav-analytics"
              onClick={() => navigateToSection('analytics', 'analytics-sales')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'analytics' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics & Funnels</span>
            </button>

            {/* System & Settings */}
            <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Administration & Security
            </div>

            {/* 11. Settings & RBAC */}
            <button
              id="sidebar-nav-settings"
              onClick={() => navigateToSection('settings', 'settings-general')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'settings' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Staff RBAC</span>
            </button>

            {/* 12. Supabase SQL Studio */}
            <button
              id="sidebar-nav-sql-editor"
              onClick={() => navigateToSection('sql-editor', 'sql-console')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                mainSection === 'sql-editor' ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/10' : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Supabase SQL Studio</span>
            </button>
          </nav>
        </div>

        {/* Admin Footer Status */}
        <div className="p-4 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-semibold truncate">{adminName}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Role: {adminRoleDisplay}</span>
            <span className="text-emerald-400">RBAC Active</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-y-auto overflow-x-hidden">
        
        {/* TOP SEARCH & BREADCRUMB BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1 font-mono flex-wrap">
              <span>ADMIN</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-zinc-300 uppercase truncate max-w-[120px] sm:max-w-none">{mainSection}</span>
              {subSection && (
                <>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  <span className="text-amber-400 uppercase truncate max-w-[140px] sm:max-w-none">{subSection}</span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 capitalize">
              {mainSection.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search across atelier admin..."
                className="w-full min-h-[40px] bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => navigate('/edit-page')}
              className="px-3.5 py-2 min-h-[40px] rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Visual Editor</span>
            </button>
          </div>
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {mainSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Gross Revenue</span>
                <p className="text-2xl font-serif font-bold text-amber-400">{formatPrice(totalRevenue)}</p>
                <span className="text-[10px] text-emerald-400 font-mono">↑ 24.8% from last month</span>
              </div>

              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Estimated Net Profit</span>
                <p className="text-2xl font-serif font-bold text-zinc-100">{formatPrice(totalProfit)}</p>
                <span className="text-[10px] text-zinc-500 font-mono">68% Atelier Gross Margin</span>
              </div>

              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Active Orders</span>
                <p className="text-2xl font-serif font-bold text-zinc-100">{activeOrdersCount}</p>
                <span className="text-[10px] text-amber-400 font-mono">In Fabrication & Logistics</span>
              </div>

              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Custom Inquiries</span>
                <p className="text-2xl font-serif font-bold text-rose-400">{customOrders.length}</p>
                <span className="text-[10px] text-zinc-400 font-mono">Pending CAD Quotation</span>
              </div>
            </div>

            {/* Quick module launchpad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => navigateToSection('catalog', 'products')}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-zinc-100">Catalog, Variants & Inventory</h3>
                <p className="text-xs text-zinc-400">Manage 18K/Platinum jewelry, metal variants, SKU stock levels, and category hierarchies.</p>
              </div>

              <div 
                onClick={() => navigateToSection('orders', 'orders')}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-zinc-100">Orders, Returns & Refunds</h3>
                <p className="text-xs text-zinc-400">Real-time order inspection, RMA return workflows, Razorpay refunds, and BlueDart air dispatch.</p>
              </div>

              <div 
                onClick={() => navigateToSection('custom-orders', 'custom')}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-zinc-100">Bespoke Quotes & CAD Studio</h3>
                <p className="text-xs text-zinc-400">Master artisan direct patron chat, 3D CAD render uploads, and formal quote generation.</p>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-zinc-100 text-sm">Recent Orders Stream</h3>
                <button 
                  onClick={() => navigateToSection('orders', 'orders')}
                  className="text-xs text-amber-400 hover:underline font-medium"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-2">
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono font-bold text-zinc-100">{o.orderNumber}</div>
                      <div className="text-zinc-400">{o.customerName} • {o.items.length} items</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400">{formatPrice(o.total || 0)}</div>
                      <span className="text-[10px] text-emerald-400 font-mono uppercase">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CATALOG & INVENTORY SECTION */}
        {mainSection === 'catalog' && (
          <CatalogAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 3. ORDERS & LOGISTICS SECTION */}
        {mainSection === 'orders' && (
          <OrdersAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 4. CUSTOMERS & CRM SECTION */}
        {mainSection === 'customers' && (
          <CustomersAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 5. CUSTOM ORDERS & QUOTES SECTION */}
        {mainSection === 'custom-orders' && (
          <CustomOrdersAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 6. COUPLE WEBSITES SECTION */}
        {mainSection === 'couple-websites' && (
          <CoupleWebsitesAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 7. BOT PANELS SECTION */}
        {mainSection === 'bot-panels' && (
          <BotPanelsAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 8. PRIVATE API SECTION */}
        {mainSection === 'private-api' && (
          <AdminApiConsole />
        )}

        {/* 9. MARKETING & PROMOTIONS SECTION */}
        {mainSection === 'marketing' && (
          <MarketingAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 10. CONTENT, CMS & SEO SECTION */}
        {mainSection === 'content' && (
          <ContentAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
            onOpenPageBuilder={() => navigate('/edit-page')}
          />
        )}

        {/* 11. ANALYTICS SECTION */}
        {mainSection === 'analytics' && (
          <AnalyticsAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 12. SETTINGS & STAFF RBAC SECTION */}
        {mainSection === 'settings' && (
          <SettingsAdminSection
            subSection={subSection as any}
            onNavigateSubSection={(sec) => setSubSection(sec)}
          />
        )}

        {/* 13. SUPABASE SQL STUDIO */}
        {mainSection === 'sql-editor' && (
          <SupabaseSqlEditor />
        )}

      </main>
    </div>
  );
};
