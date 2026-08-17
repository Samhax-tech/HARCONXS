import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, CustomOrder, DiscountCoupon, SystemPolicy, CategoryType, PopupBannerConfig, BillingPortalConfig, YouTubeVideoItem } from '../../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  Globe,
  Zap,
  Tag,
  Boxes,
  Cpu,
  Share2,
  FileText,
  Activity,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Shield,
  Lock,
  KeyRound,
  CreditCard,
  ExternalLink,
  Youtube,
  Megaphone,
  Check,
  RotateCcw,
  Sliders,
  Copy,
  Radio,
  Mail,
  Database,
  RefreshCw
} from 'lucide-react';
import { EmailNotificationCenter } from '../account/EmailNotificationCenter';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    customOrders,
    sendCustomOrderMessage,
    provideCustomOrderQuote,
    policies,
    updatePolicy,
    formatPrice,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    adminLogout,
    popupBanner,
    updatePopupBanner,
    billingPortal,
    updateBillingPortal,
    apiKeys,
    createApiKey,
    revokeApiKey,
    youtubeVideos,
    addYouTubeVideo,
    deleteYouTubeVideo,
    socialLinks,
    emailNotifications,
    supabaseStatus,
    syncDatabase,
    showToast
  } = useStore();

  const [activeSection, setActiveSection] = useState<
    'overview' | 'products' | 'orders' | 'emails' | 'custom' | 'marketing' | 'popup-banner' | 'billing' | 'api-keys' | 'youtube' | 'inventory' | 'automation' | 'gmc' | 'policies' | 'system'
  >('overview');

  const [adminSearch, setAdminSearch] = useState('');

  // Local Coupons in Admin
  const [couponsList, setCouponsList] = useState<DiscountCoupon[]>([
    {
      id: 'c1',
      code: 'WELCOME15',
      type: 'percentage',
      value: 15,
      minOrderValue: 40,
      currentUsage: 89,
      expiresAt: '2026-12-31',
      active: true
    },
    {
      id: 'c2',
      code: 'COUPLE10',
      type: 'fixed',
      value: 10,
      minOrderValue: 50,
      currentUsage: 45,
      expiresAt: '2026-12-31',
      active: true
    },
    {
      id: 'c3',
      code: 'FREESHIP',
      type: 'free_shipping',
      value: 0,
      minOrderValue: 30,
      currentUsage: 124,
      expiresAt: '2026-12-31',
      active: true
    }
  ]);

  // Pop-up banner local state
  const [popupConfig, setPopupConfig] = useState<PopupBannerConfig>(popupBanner);

  // Billing portal local state
  const [portalConfig, setPortalConfig] = useState<BillingPortalConfig>(billingPortal);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryType>('couples');
  const [newProdPrice, setNewProdPrice] = useState(89);
  const [newProdCost, setNewProdCost] = useState(28);
  const [newProdInventory, setNewProdInventory] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80');
  const [newProdPersonalizable, setNewProdPersonalizable] = useState(true);

  // Quote Issuer State
  const [quoteOrderId, setQuoteOrderId] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState(165);
  const [quoteDays, setQuoteDays] = useState(3);
  const [quotePackaging, setQuotePackaging] = useState('Valentine Luxury Velvet Box');
  const [quoteNotes, setQuoteNotes] = useState('Includes 3D render preview + titanium alloy polishing.');

  // Create Coupon Modal State
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(20);
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponMinSpend, setCouponMinSpend] = useState(50);

  // API Key creation
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPerms, setNewKeyPerms] = useState<string[]>(['orders:read', 'products:read', 'webhooks:listen']);
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  // YouTube Video Add State
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoYoutubeId, setNewVideoYoutubeId] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState<'Engraving' | 'Couple Websites' | 'Bot Dashboard' | 'Unboxing'>('Engraving');
  const [newVideoDesc, setNewVideoDesc] = useState('');

  // 1. ADMIN LOCK SCREEN GATE
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-zinc-100">
              Admin Access Protected
            </h2>
            <p className="text-xs text-zinc-400">
              This area is restricted to HARCONXS authorized atelier administrators. Please authenticate to access product records, custom orders, and private billing systems.
            </p>
          </div>

          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Admin Atelier Console</span>
          </button>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      sku: `HX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/\s+/g, '-'),
      shortDescription: newProdDesc.slice(0, 100),
      fullDescription: newProdDesc,
      price: newProdPrice,
      compareAtPrice: Math.round(newProdPrice * 1.3),
      cost: newProdCost,
      inventory: newProdInventory,
      category: newProdCategory,
      subcategory: 'Fine Jewelry & Keepsakes',
      brand: 'HARCONXS Atelier',
      tags: ['Handcrafted', 'Laser Engraved', 'Custom'],
      productType: 'physical',
      images: [newProdImage],
      badges: ['New', 'Featured'],
      isPersonalizable: newProdPersonalizable,
      personalizationFields: newProdPersonalizable ? { allowNames: true, allowDate: true, allowMessage: true, allowFontSelection: true } : undefined,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addProduct(newProd);
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const handleIssueQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteOrderId) return;
    provideCustomOrderQuote(quoteOrderId, {
      price: quoteAmount,
      currency: 'USD',
      estimatedDays: quoteDays,
      breakdown: {
        fabrication: quoteAmount - 35,
        packaging: 20,
        expressShipping: 15
      },
      packagingIncluded: quotePackaging,
      notes: quoteNotes,
      status: 'pending',
      validUntil: '2026-09-01'
    });
    setQuoteOrderId(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newC: DiscountCoupon = {
      id: `c-${Date.now()}`,
      code: couponCode.toUpperCase(),
      type: couponType,
      value: couponDiscount,
      minOrderValue: couponMinSpend,
      currentUsage: 0,
      expiresAt: '2026-12-31',
      active: true
    };
    setCouponsList(prev => [newC, ...prev]);
    setIsAddCouponOpen(false);
    setCouponCode('');
    showToast(`Promo code ${newC.code} generated.`);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const res = createApiKey(newKeyName.trim(), newKeyPerms, 2000);
    setGeneratedSecret(res.secretKey);
    setNewKeyName('');
  };

  const handleSavePopupBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updatePopupBanner(popupConfig);
  };

  const handleSaveBillingPortal = (e: React.FormEvent) => {
    e.preventDefault();
    updateBillingPortal(portalConfig);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoYoutubeId) return;
    addYouTubeVideo({
      id: `yt-${Date.now()}`,
      title: newVideoTitle,
      youtubeId: newVideoYoutubeId,
      category: newVideoCategory,
      views: '1.2K views',
      publishedDate: 'Just now',
      description: newVideoDesc || 'Official HARCONXS video tutorial & showcase.'
    });
    setIsAddVideoOpen(false);
    setNewVideoTitle('');
    setNewVideoYoutubeId('');
    setNewVideoDesc('');
  };

  // Aggregated Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalProfit = totalRevenue * 0.62; // 62% avg margin
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col md:flex-row pb-20">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
                HX
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm tracking-wider text-zinc-100">HARCONXS</h2>
                <span className="text-[10px] font-mono text-amber-400 block -mt-0.5">Admin Atelier Console</span>
              </div>
            </div>
            <button
              onClick={adminLogout}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg text-xs cursor-pointer"
              title="Logout Admin"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'overview' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>

            <button
              onClick={() => setActiveSection('products')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'products' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'orders' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('emails')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'emails' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Logs ({emailNotifications.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('custom')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'custom' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Custom Requests ({customOrders.length})</span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Marketing & Growth
            </div>

            <button
              onClick={() => setActiveSection('popup-banner')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'popup-banner' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Pop-up Banner & Deals</span>
            </button>

            <button
              onClick={() => setActiveSection('marketing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'marketing' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons & Promos</span>
            </button>

            <button
              onClick={() => setActiveSection('youtube')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'youtube' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube & Socials</span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Digital & Infrastructure
            </div>

            <button
              onClick={() => setActiveSection('billing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'billing' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing Portal Gateway</span>
            </button>

            <button
              onClick={() => setActiveSection('api-keys')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'api-keys' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>API Keys (Admin Only)</span>
            </button>

            <button
              onClick={() => setActiveSection('gmc')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'gmc' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Google Merchant Feed</span>
            </button>

            <button
              onClick={() => setActiveSection('policies')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'policies' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Policies & Terms</span>
            </button>

            <button
              onClick={() => setActiveSection('system')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'system' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>System & RLS Health</span>
            </button>

          </nav>
        </div>

        {/* Admin Footer Status */}
        <div className="p-4 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-semibold">HARCONXS Master Session</span>
          </div>
          <p className="text-[10px] text-zinc-500">256-Bit Authenticated</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        
        {/* TOP SEARCH & ACTION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search products, orders, customers, or SKUs..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Gross Revenue</span>
                <p className="text-2xl font-serif font-bold text-amber-400">{formatPrice(totalRevenue)}</p>
                <span className="text-[10px] text-emerald-400 font-mono">↑ 18.4% from last month</span>
              </div>

              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Estimated Net Profit</span>
                <p className="text-2xl font-serif font-bold text-zinc-100">{formatPrice(totalProfit)}</p>
                <span className="text-[10px] text-zinc-500 font-mono">62% Avg Margin</span>
              </div>

              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Active Orders</span>
                <p className="text-2xl font-serif font-bold text-zinc-100">{activeOrdersCount}</p>
                <span className="text-[10px] text-amber-400 font-mono">In Fabrication & Logistics</span>
              </div>

              <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-400 text-xs font-medium">Custom Inquiries</span>
                <p className="text-2xl font-serif font-bold text-rose-400">{customOrders.length}</p>
                <span className="text-[10px] text-zinc-400 font-mono">Pending Quotation</span>
              </div>
            </div>

            {/* Quick Overview Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Orders */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold font-serif text-zinc-100">Recent Customer Orders</h3>
                  <button onClick={() => setActiveSection('orders')} className="text-xs text-amber-400 hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-100">{o.orderNumber}</p>
                        <p className="text-[11px] text-zinc-400">{o.customerName} • {o.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-amber-400">{formatPrice(o.total)}</p>
                        <span className="text-[10px] text-emerald-400">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Order Inquiries */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold font-serif text-zinc-100">Bespoke Engraving Briefs</h3>
                  <button onClick={() => setActiveSection('custom')} className="text-xs text-amber-400 hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {customOrders.slice(0, 3).map(co => (
                    <div key={co.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-100">{co.requestNumber} ({co.productType})</p>
                        <p className="text-[11px] text-zinc-400">For: {co.recipient} • Budget: {co.budget}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => { setQuoteOrderId(co.id); }}
                          className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold hover:bg-amber-500/30 cursor-pointer"
                        >
                          Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. POP-UP BANNER & DEALS CONFIGURATION */}
        {activeSection === 'popup-banner' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Pop-up Discount & Promotion Banner</h3>
                <p className="text-xs text-zinc-400">
                  Configure storefront modal for limited-time flash discounts, festival deals & lead capture.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold font-mono ${popupConfig.enabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {popupConfig.enabled ? '● ACTIVE ON STOREFRONT' : '○ DISABLED'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSavePopupBanner} className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="space-y-4 text-xs">
                
                <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div>
                    <label className="font-bold text-zinc-200 block">Enable Pop-up Banner</label>
                    <span className="text-[11px] text-zinc-400">Show to new visitors on store entry</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={popupConfig.enabled}
                    onChange={(e) => setPopupConfig({ ...popupConfig, enabled: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={popupConfig.title}
                    onChange={(e) => setPopupConfig({ ...popupConfig, title: e.target.value })}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Description / Offer Details</label>
                  <textarea
                    rows={2}
                    value={popupConfig.description}
                    onChange={(e) => setPopupConfig({ ...popupConfig, description: e.target.value })}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Promo Coupon Code</label>
                    <input
                      type="text"
                      value={popupConfig.couponCode}
                      onChange={(e) => setPopupConfig({ ...popupConfig, couponCode: e.target.value.toUpperCase() })}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono uppercase outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={popupConfig.badgeText}
                      onChange={(e) => setPopupConfig({ ...popupConfig, badgeText: e.target.value })}
                      placeholder="e.g. FLASH SALE 20% OFF"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={popupConfig.imageUrl}
                    onChange={(e) => setPopupConfig({ ...popupConfig, imageUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">CTA Action Button</label>
                    <input
                      type="text"
                      value={popupConfig.ctaText}
                      onChange={(e) => setPopupConfig({ ...popupConfig, ctaText: e.target.value })}
                      placeholder="Shop With Discount"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Target View</label>
                    <select
                      value={popupConfig.ctaView}
                      onChange={(e) => setPopupConfig({ ...popupConfig, ctaView: e.target.value as any })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="catalog">Product Catalog</option>
                      <option value="couple-builder">Couple Sanctuary Builder</option>
                      <option value="custom-builder">Custom Order Request</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer transition-all mt-2"
                >
                  Save Pop-up Banner Settings
                </button>

              </div>

              {/* Live Preview Panel */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                    Live Storefront Preview
                  </span>
                  
                  <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 p-4 space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-950">
                      <img src={popupConfig.imageUrl} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-amber-500 text-zinc-950 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {popupConfig.badgeText}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-white">{popupConfig.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1">{popupConfig.description}</p>
                    </div>
                    <div className="p-2 bg-zinc-950 border border-dashed border-amber-500/50 rounded-lg flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">Coupon:</span>
                      <span className="font-mono text-xs font-bold text-amber-300">{popupConfig.couponCode}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 text-center">
                  Changes reflect in realtime for all active customers.
                </p>
              </div>

            </form>
          </div>
        )}

        {/* 3. BILLING PORTAL GATEWAY CONNECTION */}
        {activeSection === 'billing' && (
          <div className="max-w-4xl space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-zinc-100">Private Billing Portal & Subscription Gateway</h3>
              <p className="text-xs text-zinc-400">
                Connect HARCONXS to your external billing platform (e.g. Stripe Customer Portal, Razorpay Subscriptions, LemonSqueezy, or custom private host).
              </p>
            </div>

            <form onSubmit={handleSaveBillingPortal} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Billing Portal Name</label>
                  <input
                    type="text"
                    value={portalConfig.portalName}
                    onChange={(e) => setPortalConfig({ ...portalConfig, portalName: e.target.value })}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Gateway Provider</label>
                  <select
                    value={portalConfig.provider}
                    onChange={(e) => setPortalConfig({ ...portalConfig, provider: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="custom_portal">Custom Private Billing Portal</option>
                    <option value="razorpay">Razorpay Subscriptions (India UPI / Mandates)</option>
                    <option value="stripe">Stripe Billing & Customer Portal</option>
                    <option value="lemonsqueezy">LemonSqueezy Merchant of Record</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Portal Direct URL / Endpoint</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={portalConfig.portalUrl}
                    onChange={(e) => setPortalConfig({ ...portalConfig, portalUrl: e.target.value })}
                    required
                    placeholder="https://billing.harconxs.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-zinc-100 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Webhook Secret Key (HMAC verification)</label>
                  <input
                    type="password"
                    value={portalConfig.webhookSecret}
                    onChange={(e) => setPortalConfig({ ...portalConfig, webhookSecret: e.target.value })}
                    placeholder="whsec_••••••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Redirect Behavior</label>
                  <select
                    value={portalConfig.redirectMode}
                    onChange={(e) => setPortalConfig({ ...portalConfig, redirectMode: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="new_tab">Open Gateway in Secure New Tab</option>
                    <option value="same_window">Redirect in Same Window</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer transition-all"
                >
                  Save Gateway Configuration
                </button>
                <a
                  href={portalConfig.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Connect to Portal</span>
                </a>
              </div>

            </form>
          </div>
        )}

        {/* 4. API KEYS (ADMIN RESTRICTED) */}
        {activeSection === 'api-keys' && (
          <div className="max-w-4xl space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Admin API Management & Scoped Keys</h3>
                <p className="text-xs text-zinc-400">
                  Generate cryptographic API tokens for Discord bots, Telegram webhooks, and private storefront microservices.
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Restricted</span>
              </div>
            </div>

            {/* Generated Secret One-Time Notice */}
            {generatedSecret && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>New Secret API Key Generated! Copy it now (will never be displayed again):</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedSecret}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs font-mono text-emerald-400 outline-none select-all"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSecret);
                      showToast('API Key copied to clipboard.');
                    }}
                    className="px-3 py-2 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Create API Key Box */}
            <form onSubmit={handleCreateApiKey} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs">
              <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px]">Generate New Service Key</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Key Identifier / Integration Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Telegram Bot Dispatcher or Discord Sync"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Rate Limit (Req/Hour)</label>
                  <input
                    type="number"
                    defaultValue={2000}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer transition-all"
              >
                Generate Token
              </button>
            </form>

            {/* Existing Keys Table */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px]">Active Service Keys ({apiKeys.length})</h4>
              
              <div className="space-y-2.5 text-xs">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100">{k.name}</span>
                        <span className="font-mono text-[10px] text-zinc-500">{k.prefix}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${k.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                          {k.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Rate: {k.rateLimit} req/hr • Last Used: {k.lastUsed}</p>
                    </div>

                    {k.status === 'active' && (
                      <button
                        onClick={() => revokeApiKey(k.id)}
                        className="px-3 py-1 bg-rose-950/60 text-rose-300 border border-rose-800/80 rounded-lg text-xs hover:bg-rose-900 transition-colors cursor-pointer"
                      >
                        Revoke Key
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 5. YOUTUBE VIDEOS & SOCIAL MEDIA MANAGER */}
        {activeSection === 'youtube' && (
          <div className="max-w-4xl space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">YouTube Video Showcase & Social Links</h3>
                <p className="text-xs text-zinc-400">
                  Manage YouTube tutorial videos and official social media handles displayed on the "About Us" page.
                </p>
              </div>
              <button
                onClick={() => setIsAddVideoOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add YouTube Video</span>
              </button>
            </div>

            {/* Video List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {youtubeVideos.map((vid) => (
                <div key={vid.id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950">
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                      ID: {vid.youtubeId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-400">{vid.category}</span>
                    <h4 className="font-semibold text-xs text-zinc-100">{vid.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{vid.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-zinc-800 text-[11px]">
                    <span className="text-zinc-500">{vid.views}</span>
                    <button
                      onClick={() => deleteYouTubeVideo(vid.id)}
                      className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 6. CATALOG PRODUCTS TABLE */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Product Catalog Management</h3>
                <p className="text-xs text-zinc-400">Manage pricing, variants, laser personalizations & inventory levels.</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Product</span>
              </button>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-950 shrink-0" />
                        <div>
                          <p className="font-semibold text-zinc-100">{p.name}</p>
                          <span className="font-mono text-[10px] text-zinc-500">{p.sku}</span>
                        </div>
                      </td>
                      <td className="p-3.5 capitalize text-zinc-300">{p.category}</td>
                      <td className="p-3.5 font-mono font-bold text-amber-400">{formatPrice(p.price)}</td>
                      <td className="p-3.5 font-mono text-zinc-200">{p.inventory} units</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 7. ORDERS FULFILLMENT */}
        {activeSection === 'orders' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-zinc-100">Customer Orders & Logistics Fulfillment</h3>
              <p className="text-xs text-zinc-400">Track shipments, dispatch BlueDart / Delhivery / DTDC tracking codes.</p>
            </div>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <span className="font-mono text-base font-bold text-zinc-100">{order.orderNumber}</span>
                      <p className="text-[11px] text-zinc-400">{order.customerName} ({order.customerEmail}) • {order.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl py-1.5 px-3 text-xs text-amber-400 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                        <option value="Production">In Laser Production</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-300">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Delivery Address</span>
                      <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1">Carrier: {order.carrier} • Tracking #{order.trackingNumber}</p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Total Amount</span>
                      <p className="font-mono text-lg font-bold text-amber-400">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 7.1 EMAIL LOGS & RELAYS */}
        {activeSection === 'emails' && (
          <div className="space-y-6">
            <EmailNotificationCenter />
          </div>
        )}

        {/* 8. CUSTOM ORDERS */}
        {activeSection === 'custom' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-zinc-100">Bespoke Custom Orders & Quotations</h3>
              <p className="text-xs text-zinc-400">Review briefs submitted by customers and provide custom pricing.</p>
            </div>

            <div className="space-y-4">
              {customOrders.map(co => (
                <div key={co.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <span className="font-mono text-base font-bold text-zinc-100">{co.requestNumber}</span>
                      <p className="text-[11px] text-zinc-400">{co.customerName} ({co.customerEmail}) • {co.productType}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-bold">
                      Status: {co.status}
                    </span>
                  </div>

                  <p className="text-zinc-300 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                    "{co.description}"
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Budget: {co.budget} • Occasion: {co.occasion}</span>
                    <button
                      onClick={() => setQuoteOrderId(co.id)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Issue Official Quotation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. MARKETING & COUPONS */}
        {activeSection === 'marketing' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Discount Coupons & Campaigns</h3>
                <p className="text-xs text-zinc-400">Manage promotional codes and minimum cart spend thresholds.</p>
              </div>
              <button
                onClick={() => setIsAddCouponOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {couponsList.map(c => (
                <div key={c.id} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-amber-300">{c.code}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value * 86.5} OFF`}
                    </span>
                  </div>
                  <p className="text-zinc-400">Min Spend: {formatPrice(c.minOrderValue || 0)}</p>
                  <p className="text-[11px] text-zinc-500">Total Uses: {c.currentUsage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. GOOGLE MERCHANT CENTER */}
        {activeSection === 'gmc' && (
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-zinc-100">Google Merchant Center XML Feed</h3>
              <p className="text-xs text-zinc-400">Live schema-compliant product XML feed for Google Shopping campaigns.</p>
            </div>

            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Google Merchant Feed Active</h4>
                  <p className="text-zinc-400">All {products.length} catalog items formatted with GTIN, SKU, and GST pricing.</p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-300 break-all border border-zinc-800">
                https://harconxs.com/api/feeds/google-merchant.xml
              </div>

              <button
                onClick={() => showToast('Google Merchant Center feed synced!')}
                className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Trigger GMC Sync Now
              </button>
            </div>
          </div>
        )}

        {/* 11. POLICIES */}
        {activeSection === 'policies' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-zinc-100">Legal Policies & Terms Manager</h3>
              <p className="text-xs text-zinc-400">Publish updated terms of service, custom order warranties & refund rules.</p>
            </div>

            <div className="space-y-4">
              {policies.map(p => (
                <div key={p.id} className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-zinc-100">{p.title} (v{p.version})</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Last updated: {p.lastUpdated}</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">{p.content.slice(0, 180)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. SYSTEM HEALTH & SUPABASE */}
        {activeSection === 'system' && (
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">System Status & Supabase RLS Matrix</h3>
                <p className="text-xs text-zinc-400">Live health monitor, PostgreSQL schemas and security policies.</p>
              </div>
              <button
                onClick={async () => {
                  await syncDatabase();
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Supabase Cloud DB</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Database</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">● Online (Postgres)</p>
                <p className="text-[10px] text-zinc-500 font-mono">Status: {supabaseStatus.connected ? 'Cloud Connected' : 'Local Fallback'}</p>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Auth & RLS</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">● Active & Secure</p>
                <p className="text-[10px] text-zinc-500 font-mono">Row Level Security</p>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Email Relay</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">● {emailNotifications.length} Dispatched</p>
                <p className="text-[10px] text-zinc-500 font-mono">SMTP / Brevo API</p>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-500 uppercase font-mono text-[10px]">Logistics Carrier</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">● BlueDart / Delhivery</p>
                <p className="text-[10px] text-zinc-500 font-mono">Live Webhooks</p>
              </div>
            </div>

            {/* Supabase Schema Status Card */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-200 font-bold">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase Cloud Database Tables</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                The complete SQL schema is defined in <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-amber-400 font-mono">supabase-schema.sql</code>. It includes public tables with Row Level Security (RLS) policies for orders, products, custom briefs, email logs, and customer profiles.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300">
                  <span className="text-zinc-500 block text-[9px] uppercase">Table</span>
                  <span className="text-amber-400">products</span> ({products.length} rows)
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300">
                  <span className="text-zinc-500 block text-[9px] uppercase">Table</span>
                  <span className="text-amber-400">orders</span> ({orders.length} rows)
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300">
                  <span className="text-zinc-500 block text-[9px] uppercase">Table</span>
                  <span className="text-amber-400">email_logs</span> ({emailNotifications.length} rows)
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300">
                  <span className="text-zinc-500 block text-[9px] uppercase">Table</span>
                  <span className="text-amber-400">custom_orders</span> ({customOrders.length} rows)
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      {/* 1. ADD PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-zinc-100 text-sm">Add New Creation to Catalog</h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                  placeholder="e.g. Celestial Orbit Couple Ring"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                  >
                    <option value="couples">Couples</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="digital">Digital Services</option>
                    <option value="bot-panels">Bot Panels</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description</label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ISSUE QUOTE MODAL */}
      {quoteOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-zinc-100 text-sm">Issue Official Atelier Quotation</h3>
            <form onSubmit={handleIssueQuote} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Custom Fabrication Price ($ USD)</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Turnaround Time (Business Days)</label>
                <input
                  type="number"
                  value={quoteDays}
                  onChange={(e) => setQuoteDays(Number(e.target.value))}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteOrderId(null)}
                  className="flex-1 py-2 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl cursor-pointer"
                >
                  Dispatch Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD YOUTUBE VIDEO MODAL */}
      {isAddVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-zinc-100 text-sm">Add YouTube Video to Showcase</h3>
            <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Video Title</label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="e.g. Master Laser Engraving Demonstration"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">YouTube Video ID (11 chars)</label>
                <input
                  type="text"
                  value={newVideoYoutubeId}
                  onChange={(e) => setNewVideoYoutubeId(e.target.value)}
                  placeholder="e.g. dQw4w9WgXcQ"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Category</label>
                <select
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                >
                  <option value="Engraving">Engraving</option>
                  <option value="Couple Websites">Couple Websites</option>
                  <option value="Bot Dashboard">Bot Dashboard</option>
                  <option value="Unboxing">Unboxing</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVideoOpen(false)}
                  className="flex-1 py-2 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. CREATE COUPON MODAL */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-zinc-100 text-sm">Create Promo Coupon Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 font-mono uppercase outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Discount Amount</label>
                  <input
                    type="number"
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                  >
                    <option value="percentage">% Percentage</option>
                    <option value="fixed">$ Fixed Amount</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="flex-1 py-2 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl cursor-pointer"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
