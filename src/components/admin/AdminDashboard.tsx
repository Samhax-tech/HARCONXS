import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Store,
  Package,
  Boxes,
  Layers,
  ShoppingBag,
  Users,
  Star,
  FileText,
  Palette,
  Eye,
  Menu,
  Image as ImageIcon,
  Heart,
  Bot,
  MessageSquare,
  Send,
  Share2,
  Globe,
  Headphones,
  CreditCard,
  Settings,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  History,
  Terminal,
  Activity,
  Database,
  Search,
  ExternalLink,
  Plus,
  KeyRound,
  Lock,
  ChevronRight,
  ChevronDown,
  LogOut,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// Modular Admin Sections
import { CatalogAdminSection } from './sections/CatalogAdminSection';
import { OrdersAdminSection } from './sections/OrdersAdminSection';
import { CustomersAdminSection } from './sections/CustomersAdminSection';
import { AdminReviewsModeration } from './AdminReviewsModeration';
import { ContentAdminSection } from './sections/ContentAdminSection';
import { ContentNavigationAdmin } from './sections/ContentNavigationAdmin';
import { ContentMediaAdmin } from './sections/ContentMediaAdmin';
import { ThemeEditorWithLivePreview } from './ThemeEditorWithLivePreview';
import { CoupleWebsitesAdminSection } from './sections/CoupleWebsitesAdminSection';
import { BotsIntegrationsAdminSection, IntegrationPlatform } from './sections/BotsIntegrationsAdminSection';
import { SupportAdminSection } from './sections/SupportAdminSection';
import { BillingAuthArchitectureGuide } from './BillingAuthArchitectureGuide';
import { SettingsAdminSection } from './sections/SettingsAdminSection';
import { DeveloperAdminSection } from './sections/DeveloperAdminSection';

export type MainCategory = 
  | 'dashboard'
  | 'store'
  | 'content'
  | 'couple-websites'
  | 'bots'
  | 'support'
  | 'billing'
  | 'system'
  | 'developer';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    reviews,
    tickets,
    coupleWebsites,
    coupleTemplates,
    formatPrice,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    adminLogout,
    showToast
  } = useStore();

  const navigate = useNavigate();
  const { user: authUser, role: authRole, logout: authLogout } = useAuth();

  // Active navigation selection
  const [activeCategory, setActiveCategory] = useState<MainCategory>('dashboard');
  const [activeSubItem, setActiveSubItem] = useState<string>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  // Expanded menu states
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    store: true,
    content: true,
    bots: true,
    system: true,
    developer: true
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const adminName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'HARCONXS Admin';
  const adminRoleDisplay = (authRole || 'super_admin').toUpperCase();

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
              This console is strictly restricted to verified HARCONXS administrators. Please sign in with your credentials to access the production management console.
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

  // Dashboard Aggregated Stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0) || 148500;
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockCount = products.filter(p => (p.inventory || p.stock || 0) < 5).length;
  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  const handleSelectNav = (category: MainCategory, subItem: string = 'overview') => {
    setActiveCategory(category);
    setActiveSubItem(subItem);
    setIsMobileNavOpen(false);
  };

  const handleLogout = () => {
    adminLogout();
    authLogout();
    showToast('Logged out of Admin Console.');
    navigate('/');
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col md:flex-row pb-20 w-full max-w-full overflow-x-clip">
      
      {/* MOBILE TOP HEADER BAR (< md) */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-serif font-bold text-xs">
            HX
          </div>
          <div>
            <div className="font-serif font-bold text-xs text-zinc-100 capitalize">
              {activeCategory.replace('-', ' ')}
            </div>
            <div className="text-[10px] font-mono text-amber-400">{activeSubItem}</div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-amber-400 text-xs font-semibold cursor-pointer"
        >
          {isMobileNavOpen ? 'Close Menu' : 'Admin Menu'}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        ${isMobileNavOpen ? 'block' : 'hidden'} md:block
        w-full md:w-64 bg-zinc-900 border-r border-zinc-800 shrink-0 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between
        sticky md:top-16 z-20 overflow-y-auto max-h-screen md:max-h-[calc(100vh-4rem)]
      `}>
        <div className="p-4 space-y-4">
          {/* Admin Identity Card */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif font-bold text-xs shrink-0">
                👑
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-zinc-100 truncate">{adminName}</div>
                <div className="text-[10px] font-mono text-amber-400">{adminRoleDisplay}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1 text-xs">
            
            {/* 1. DASHBOARD */}
            <button
              id="admin-nav-dashboard"
              onClick={() => handleSelectNav('dashboard', 'overview')}
              className={`w-full px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-all cursor-pointer ${
                activeCategory === 'dashboard'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            {/* 2. STORE ACCORDION */}
            <div className="pt-2">
              <button
                onClick={() => toggleMenu('store')}
                className="w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 flex items-center justify-between uppercase tracking-wider text-[10px] font-bold font-mono cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Store</span>
                </div>
                {expandedMenus.store ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {expandedMenus.store && (
                <div className="pl-3 space-y-0.5 mt-1 border-l border-zinc-800 ml-3">
                  <button
                    onClick={() => handleSelectNav('store', 'products')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'store' && activeSubItem === 'products'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Products</span>
                    <span className="font-mono text-[10px] text-zinc-500">{products.length}</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('store', 'categories')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'store' && activeSubItem === 'categories'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Categories</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('store', 'inventory')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'store' && activeSubItem === 'inventory'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Inventory</span>
                    {lowStockCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono">
                        {lowStockCount} low
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleSelectNav('store', 'orders')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'store' && activeSubItem === 'orders'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Orders</span>
                    <span className="font-mono text-[10px] text-emerald-400">{orders.length}</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('store', 'customers')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'store' && activeSubItem === 'customers'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Customers</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('store', 'reviews')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'store' && activeSubItem === 'reviews'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Reviews</span>
                    <span className="font-mono text-[10px] text-zinc-500">{reviews.length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. CONTENT ACCORDION */}
            <div className="pt-2">
              <button
                onClick={() => toggleMenu('content')}
                className="w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 flex items-center justify-between uppercase tracking-wider text-[10px] font-bold font-mono cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Content</span>
                </div>
                {expandedMenus.content ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {expandedMenus.content && (
                <div className="pl-3 space-y-0.5 mt-1 border-l border-zinc-800 ml-3">
                  <button
                    onClick={() => handleSelectNav('content', 'pages')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'content' && activeSubItem === 'pages'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Pages</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('content', 'visual-editor')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'content' && activeSubItem === 'visual-editor'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Visual Editor</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('content', 'theme')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'content' && activeSubItem === 'theme'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Theme</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('content', 'navigation')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'content' && activeSubItem === 'navigation'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Navigation</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('content', 'media')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'content' && activeSubItem === 'media'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Media</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. COUPLE WEBSITES */}
            <div className="pt-2">
              <button
                onClick={() => handleSelectNav('couple-websites', 'couple-templates')}
                className={`w-full px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-all cursor-pointer ${
                  activeCategory === 'couple-websites'
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30" />
                  <span>Couple Websites</span>
                </div>
                <span className="font-mono text-[10px]">{coupleWebsites.length}</span>
              </button>
            </div>

            {/* 5. BOTS / INTEGRATIONS ACCORDION */}
            <div className="pt-2">
              <button
                onClick={() => toggleMenu('bots')}
                className="w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 flex items-center justify-between uppercase tracking-wider text-[10px] font-bold font-mono cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bots / Integrations</span>
                </div>
                {expandedMenus.bots ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {expandedMenus.bots && (
                <div className="pl-3 space-y-0.5 mt-1 border-l border-zinc-800 ml-3">
                  <button
                    onClick={() => handleSelectNav('bots', 'whatsapp')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'bots' && activeSubItem === 'whatsapp'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('bots', 'telegram')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'bots' && activeSubItem === 'telegram'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('bots', 'discord')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'bots' && activeSubItem === 'discord'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Discord</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('bots', 'facebook')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'bots' && activeSubItem === 'facebook'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('bots', 'instagram')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'bots' && activeSubItem === 'instagram'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Instagram</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('bots', 'wordpress')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'bots' && activeSubItem === 'wordpress'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>WordPress</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6. SUPPORT */}
            <div className="pt-2">
              <button
                onClick={() => handleSelectNav('support', 'overview')}
                className={`w-full px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-all cursor-pointer ${
                  activeCategory === 'support'
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span>Support</span>
                </div>
                {openTicketsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    {openTicketsCount} open
                  </span>
                )}
              </button>
            </div>

            {/* 7. BILLING */}
            <div className="pt-2">
              <button
                onClick={() => handleSelectNav('billing', 'overview')}
                className={`w-full px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-all cursor-pointer ${
                  activeCategory === 'billing'
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Billing</span>
                </div>
              </button>
            </div>

            {/* 8. SYSTEM ACCORDION */}
            <div className="pt-2">
              <button
                onClick={() => toggleMenu('system')}
                className="w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 flex items-center justify-between uppercase tracking-wider text-[10px] font-bold font-mono cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>System</span>
                </div>
                {expandedMenus.system ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {expandedMenus.system && (
                <div className="pl-3 space-y-0.5 mt-1 border-l border-zinc-800 ml-3">
                  <button
                    onClick={() => handleSelectNav('system', 'settings-staff')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'system' && activeSubItem === 'settings-staff'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Staff</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('system', 'settings-roles')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'system' && activeSubItem === 'settings-roles'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Roles</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('system', 'settings-audit-logs')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'system' && activeSubItem === 'settings-audit-logs'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Audit Logs</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('system', 'settings-general')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'system' && activeSubItem === 'settings-general'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Settings</span>
                  </button>
                </div>
              )}
            </div>

            {/* 9. DEVELOPER / INTERNAL ACCORDION */}
            <div className="pt-2">
              <button
                onClick={() => toggleMenu('developer')}
                className="w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 flex items-center justify-between uppercase tracking-wider text-[10px] font-bold font-mono cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Developer/Internal</span>
                </div>
                {expandedMenus.developer ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {expandedMenus.developer && (
                <div className="pl-3 space-y-0.5 mt-1 border-l border-zinc-800 ml-3">
                  <button
                    onClick={() => handleSelectNav('developer', 'api-console')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'developer' && activeSubItem === 'api-console'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>API Console</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('developer', 'health')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'developer' && activeSubItem === 'health'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Health</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('developer', 'logs')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'developer' && activeSubItem === 'logs'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>Logs</span>
                  </button>

                  <button
                    onClick={() => handleSelectNav('developer', 'sql')}
                    className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      activeCategory === 'developer' && activeSubItem === 'sql'
                        ? 'bg-amber-400/10 text-amber-300 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>SQL</span>
                  </button>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* TOP BREADCRUMB CONTEXT BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500">HARCONXS</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-amber-400 uppercase font-bold">{activeCategory}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-300 capitalize">{activeSubItem.replace('settings-', '').replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live Production Vault
            </span>
          </div>
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeCategory === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-mono text-zinc-400">Total Net Revenue</span>
                <div className="text-2xl font-serif font-bold text-amber-400">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>+18.4% vs last period</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-mono text-zinc-400">Active Order Dispatch</span>
                <div className="text-2xl font-serif font-bold text-zinc-100">
                  {activeOrdersCount}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {orders.length} total orders recorded
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-mono text-zinc-400">Catalog Inventory</span>
                <div className="text-2xl font-serif font-bold text-zinc-100">
                  {products.length}
                </div>
                <div className="text-[11px] text-amber-400">
                  {lowStockCount} items at low inventory
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-mono text-zinc-400">Patron Support Tickets</span>
                <div className="text-2xl font-serif font-bold text-emerald-400">
                  {openTicketsCount}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {tickets.length} total inquiries logged
                </div>
              </div>
            </div>

            {/* Quick Actions Launchpad */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h3 className="font-serif font-bold text-zinc-100 text-base">Atelier Production Launchpad</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => handleSelectNav('store', 'products')}
                  className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-zinc-200">Add Product</div>
                  <div className="text-[10px] text-zinc-500">Catalog management</div>
                </button>

                <button
                  onClick={() => handleSelectNav('store', 'orders')}
                  className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-zinc-200">Process Orders</div>
                  <div className="text-[10px] text-zinc-500">Tracking & fulfillment</div>
                </button>

                <button
                  onClick={() => handleSelectNav('content', 'theme')}
                  className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <Palette className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-zinc-200">Theme Editor</div>
                  <div className="text-[10px] text-zinc-500">Styling & layouts</div>
                </button>

                <button
                  onClick={() => handleSelectNav('couple-websites', 'couple-templates')}
                  className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <Heart className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-zinc-200">Couple Websites</div>
                  <div className="text-[10px] text-zinc-500">Themes & RSVP vaults</div>
                </button>

                <button
                  onClick={() => handleSelectNav('bots', 'whatsapp')}
                  className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <Bot className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-zinc-200">Bot Concierge</div>
                  <div className="text-[10px] text-zinc-500">WhatsApp & Telegram</div>
                </button>

                <button
                  onClick={() => handleSelectNav('developer', 'api-console')}
                  className="p-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <Terminal className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-zinc-200">API Console</div>
                  <div className="text-[10px] text-zinc-500">Keys & endpoints</div>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-zinc-100 text-base">Latest Orders Stream</h3>
                <button
                  onClick={() => handleSelectNav('store', 'orders')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  View All Orders <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-zinc-800">
                {orders.slice(0, 5).map(ord => (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-zinc-200">{ord.orderNumber}</div>
                      <div className="text-zinc-500 text-[11px]">{ord.customerName} • {ord.items.length} items</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400">₹{(ord.total || 0).toLocaleString()}</div>
                      <div className="text-[10px] capitalize text-zinc-400">{ord.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. STORE CATEGORY */}
        {activeCategory === 'store' && (
          <div>
            {(activeSubItem === 'products' || activeSubItem === 'categories' || activeSubItem === 'inventory') && (
              <CatalogAdminSection
                subSection={activeSubItem as any}
                onNavigateSubSection={(sec) => setActiveSubItem(sec)}
              />
            )}
            {activeSubItem === 'orders' && (
              <OrdersAdminSection
                subSection="orders"
                onNavigateSubSection={(sec) => setActiveSubItem(sec)}
              />
            )}
            {activeSubItem === 'customers' && (
              <CustomersAdminSection
                subSection="customers"
                onNavigateSubSection={(sec) => setActiveSubItem(sec)}
              />
            )}
            {activeSubItem === 'reviews' && (
              <AdminReviewsModeration />
            )}
          </div>
        )}

        {/* 3. CONTENT CATEGORY */}
        {activeCategory === 'content' && (
          <div>
            {activeSubItem === 'pages' && (
              <ContentAdminSection
                subSection="pages"
                onNavigateSubSection={(sec) => setActiveSubItem(sec)}
                onOpenPageBuilder={(slug) => navigate(`/edit-page?slug=${slug}`)}
              />
            )}
            {activeSubItem === 'visual-editor' && (
              <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Palette className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Live Visual Canvas & Page Editor</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Launch the full-screen visual layout designer to rearrange storefront hero sections, product grids, story timelines, and promotional ribbons with instant live preview.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/edit-page')}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-2 mx-auto shadow-lg shadow-amber-400/20 cursor-pointer"
                  >
                    <span>Launch Visual Page Editor</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {activeSubItem === 'theme' && (
              <ThemeEditorWithLivePreview />
            )}
            {activeSubItem === 'navigation' && (
              <ContentNavigationAdmin />
            )}
            {activeSubItem === 'media' && (
              <ContentMediaAdmin />
            )}
          </div>
        )}

        {/* 4. COUPLE WEBSITES CATEGORY */}
        {activeCategory === 'couple-websites' && (
          <CoupleWebsitesAdminSection
            subSection={activeSubItem === 'couple-projects' ? 'couple-projects' : 'couple-templates'}
            onNavigateSubSection={(sec) => setActiveSubItem(sec)}
          />
        )}

        {/* 5. BOTS / INTEGRATIONS CATEGORY */}
        {activeCategory === 'bots' && (
          <BotsIntegrationsAdminSection
            initialPlatform={activeSubItem as IntegrationPlatform}
          />
        )}

        {/* 6. SUPPORT CATEGORY */}
        {activeCategory === 'support' && (
          <SupportAdminSection />
        )}

        {/* 7. BILLING CATEGORY */}
        {activeCategory === 'billing' && (
          <BillingAuthArchitectureGuide />
        )}

        {/* 8. SYSTEM CATEGORY */}
        {activeCategory === 'system' && (
          <SettingsAdminSection
            subSection={activeSubItem as any}
            onNavigateSubSection={(sec) => setActiveSubItem(sec)}
          />
        )}

        {/* 9. DEVELOPER / INTERNAL CATEGORY */}
        {activeCategory === 'developer' && (
          <DeveloperAdminSection
            subSection={activeSubItem as any}
            onNavigateSubSection={(sec) => setActiveSubItem(sec)}
          />
        )}

      </main>
    </div>
  );
};
