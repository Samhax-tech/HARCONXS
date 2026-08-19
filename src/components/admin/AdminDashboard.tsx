import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Product,
  Order,
  CustomOrder,
  DiscountCoupon,
  SystemPolicy,
  CategoryType,
  PopupBannerConfig,
  BillingPortalConfig,
  YouTubeVideoItem,
  CoupleWebsiteTemplate,
  CoupleThemeCategory,
  CoupleWebsiteProject
} from '../../types';
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
  RefreshCw,
  Heart,
  Palette,
  Layers,
  Sparkle
} from 'lucide-react';
import { EmailNotificationCenter } from '../account/EmailNotificationCenter';
import { AdminApiConsole } from './AdminApiConsole';
import { AdminReviewsModeration } from './AdminReviewsModeration';
import { Star } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    processOrderRefund,
    updateOrderLogistics,
    customOrders,
    sendCustomOrderMessage,
    markCustomOrderMessagesAsRead,
    assignCustomOrderStaff,
    updateCustomOrderConversationStatus,
    provideCustomOrderQuote,
    updateCustomOrderStatus,
    uploadCustomOrderFile,
    packagingOptions,
    coupleTemplates,
    addCoupleTemplate,
    updateCoupleTemplate,
    deleteCoupleTemplate,
    toggleCoupleTemplateActive,
    coupleWebsites,
    publishCoupleWebsite,
    deleteCoupleWebsite,
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
    'overview' | 'products' | 'orders' | 'emails' | 'custom' | 'couple-templates' | 'marketing' | 'popup-banner' | 'reviews' | 'billing' | 'api-keys' | 'youtube' | 'inventory' | 'automation' | 'gmc' | 'policies' | 'system'
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

  // Custom Orders Admin State
  const [customStatusFilter, setCustomStatusFilter] = useState<'all' | CustomOrder['status']>('all');
  const [customSearch, setCustomSearch] = useState('');
  const [quoteOrderId, setQuoteOrderId] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState(12500);
  const [quoteDays, setQuoteDays] = useState(4);
  const [quotePackaging, setQuotePackaging] = useState('Royal Velvet Keepsake Box');
  const [quoteNotes, setQuoteNotes] = useState('Includes 3D CAD render preview, titanium laser engraving & insured courier dispatch.');
  const [quoteProofUrl, setQuoteProofUrl] = useState('https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80');
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  // Status Progression & Logistics Modal
  const [statusModalOrder, setStatusModalOrder] = useState<CustomOrder | null>(null);
  const [nextCustomStatus, setNextCustomStatus] = useState<CustomOrder['status']>('In Design');
  const [customCarrier, setCustomCarrier] = useState('BlueDart Apex Priority');
  const [customTrackingAwb, setCustomTrackingAwb] = useState('');
  const [customTrackingUrl, setCustomTrackingUrl] = useState('');

  // Admin Direct Realtime Chat Drawer
  const [adminChatOrder, setAdminChatOrder] = useState<CustomOrder | null>(null);
  const [adminChatInput, setAdminChatInput] = useState('');
  const [adminChatAttachments, setAdminChatAttachments] = useState<string[]>([]);
  const [isAdminUploadingChatFile, setIsAdminUploadingChatFile] = useState(false);
  const [isAdminProofUpload, setIsAdminProofUpload] = useState(false);
  const [adminProofTitle, setAdminProofTitle] = useState('3D CAD Blueprint');
  const [selectedStaffAssignee, setSelectedStaffAssignee] = useState('Hamza (Lead Master Artisan)');

  // Keep active chat modal synced with live context & mark messages as read
  useEffect(() => {
    if (adminChatOrder) {
      const live = customOrders.find(co => co.id === adminChatOrder.id);
      if (live) {
        setAdminChatOrder(live);
        if ((live.unreadCountAdmin ?? 0) > 0) {
          markCustomOrderMessagesAsRead(live.id, 'admin');
        }
      }
    }
  }, [customOrders, adminChatOrder?.id, markCustomOrderMessagesAsRead]);

  // Create Coupon Modal State
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(20);
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponMinSpend, setCouponMinSpend] = useState(50);

  // YouTube Video Add State
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoYoutubeId, setNewVideoYoutubeId] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState<'Engraving' | 'Couple Websites' | 'Bot Dashboard' | 'Unboxing'>('Engraving');
  const [newVideoDesc, setNewVideoDesc] = useState('');

  // Couple Templates & Websites Admin State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [tmplName, setTmplName] = useState('');
  const [tmplVersion, setTmplVersion] = useState('v2.0');
  const [tmplCategory, setTmplCategory] = useState<CoupleThemeCategory>('Romantic');
  const [tmplPrice, setTmplPrice] = useState(4999);
  const [tmplDesc, setTmplDesc] = useState('');
  const [tmplImage, setTmplImage] = useState('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80');
  const [tmplDemoSubdomain, setTmplDemoSubdomain] = useState('forever-demo');
  const [tmplFeatures, setTmplFeatures] = useState('Live Second Counter, Photo Wall, Soundtrack Player, Guestbook');
  const [tmplColors, setTmplColors] = useState('#e11d48, #fb7185, #fda4af');
  const [tmplFont, setTmplFont] = useState('Playfair Display');
  const [tmplPopular, setTmplPopular] = useState(false);
  const [tmplActive, setTmplActive] = useState(true);

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

  const handleIssueQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteOrderId) return;
    await provideCustomOrderQuote(quoteOrderId, {
      amount: quoteAmount,
      currency: 'INR',
      turnaroundDays: quoteDays,
      packagingIncluded: quotePackaging,
      notes: quoteNotes,
      designProofUrl: quoteProofUrl || undefined,
      status: 'pending_review',
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0]
    });
    setQuoteOrderId(null);
  };

  const handleUploadProofFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingProof(true);
    try {
      const res = await uploadCustomOrderFile(files[0], quoteOrderId || undefined);
      if (res.success && res.url) {
        setQuoteProofUrl(res.url);
        showToast('CAD proof image uploaded to Supabase Storage!');
      }
    } catch {
      showToast('Failed to upload CAD proof.');
    } finally {
      setIsUploadingProof(false);
      e.target.value = '';
    }
  };

  const handleSaveStatusTransition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder) return;
    await updateCustomOrderStatus(statusModalOrder.id, nextCustomStatus, {
      carrier: customCarrier,
      trackingNumber: customTrackingAwb,
      trackingUrl: customTrackingUrl || undefined
    });
    setStatusModalOrder(null);
  };

  const handleSendAdminChat = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || adminChatInput.trim();
    if ((!textToSend && adminChatAttachments.length === 0) || !adminChatOrder) return;
    await sendCustomOrderMessage(
      adminChatOrder.id,
      textToSend,
      'admin',
      {
        attachments: adminChatAttachments.length > 0 ? adminChatAttachments : undefined,
        isAdminProof: isAdminProofUpload && adminChatAttachments.length > 0,
        adminProofTitle: isAdminProofUpload ? adminProofTitle : undefined
      }
    );
    setAdminChatInput('');
    setAdminChatAttachments([]);
    setIsAdminProofUpload(false);
    showToast('Direct artisan message sent to patron via Supabase Realtime.');
  };

  const handleAdminChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !adminChatOrder) return;
    setIsAdminUploadingChatFile(true);
    try {
      const res = await uploadCustomOrderFile(files[0], adminChatOrder.id);
      if (res.success && res.url) {
        setAdminChatAttachments(prev => [...prev, res.url]);
        showToast('Attachment uploaded to chat.');
      }
    } catch {
      showToast('Failed to upload file.');
    } finally {
      setIsAdminUploadingChatFile(false);
      e.target.value = '';
    }
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

  const handleOpenAddTemplate = () => {
    setEditingTemplateId(null);
    setTmplName('');
    setTmplVersion('v2.0');
    setTmplCategory('Romantic');
    setTmplPrice(4999);
    setTmplDesc('A modern, responsive love sanctuary with live anniversary counter, photo wall and guestbook.');
    setTmplImage('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80');
    setTmplDemoSubdomain('demo');
    setTmplFeatures('Live Second Counter, Photo Wall, Soundtrack Player, Guestbook');
    setTmplColors('#e11d48, #fb7185, #fda4af');
    setTmplFont('Playfair Display');
    setTmplPopular(false);
    setTmplActive(true);
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditTemplate = (t: CoupleWebsiteTemplate) => {
    setEditingTemplateId(t.id);
    setTmplName(t.name);
    setTmplVersion(t.version || 'v2.0');
    setTmplCategory(t.themeCategory || 'Romantic');
    setTmplPrice(t.price);
    setTmplDesc(t.description);
    setTmplImage(t.previewImage);
    setTmplDemoSubdomain(t.demoSubdomain || 'demo');
    setTmplFeatures(t.features.join(', '));
    setTmplColors(t.colorPalette ? t.colorPalette.join(', ') : '#e11d48, #fb7185');
    setTmplFont(t.defaultFont || 'Playfair Display');
    setTmplPopular(t.popular || false);
    setTmplActive(t.isActive !== false);
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmplName.trim()) {
      showToast('Template name is required.');
      return;
    }

    const feats = tmplFeatures.split(',').map(s => s.trim()).filter(Boolean);
    const colors = tmplColors.split(',').map(s => s.trim()).filter(Boolean);

    if (editingTemplateId) {
      const existing = coupleTemplates.find(t => t.id === editingTemplateId);
      if (existing) {
        await updateCoupleTemplate({
          ...existing,
          name: tmplName.trim(),
          version: tmplVersion.trim() || 'v2.0',
          themeCategory: tmplCategory,
          price: Number(tmplPrice),
          description: tmplDesc.trim(),
          previewImage: tmplImage.trim(),
          demoSubdomain: tmplDemoSubdomain.trim().toLowerCase(),
          features: feats.length > 0 ? feats : ['Live Counter', 'Photo Gallery'],
          colorPalette: colors,
          defaultFont: tmplFont,
          popular: tmplPopular,
          isActive: tmplActive
        });
      }
    } else {
      await addCoupleTemplate({
        name: tmplName.trim(),
        version: tmplVersion.trim() || 'v2.0',
        themeCategory: tmplCategory,
        price: Number(tmplPrice),
        description: tmplDesc.trim(),
        previewImage: tmplImage.trim(),
        demoSubdomain: tmplDemoSubdomain.trim().toLowerCase(),
        features: feats.length > 0 ? feats : ['Live Counter', 'Photo Gallery', 'Guestbook'],
        colorPalette: colors,
        defaultFont: tmplFont,
        popular: tmplPopular,
        isActive: tmplActive,
        releaseDate: new Date().toISOString().split('T')[0]
      });
    }

    setIsTemplateModalOpen(false);
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

            <button
              onClick={() => setActiveSection('couple-templates')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'couple-templates' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Couple Sites & Themes ({coupleTemplates.length})</span>
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
              onClick={() => setActiveSection('reviews')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'reviews' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>Reviews & Testimonials</span>
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

        {/* 4. API KEYS & INTERNAL SERVICE GATEWAY (ADMIN RESTRICTED) */}
        {activeSection === 'api-keys' && (
          <div className="space-y-6">
            <AdminApiConsole />
          </div>
        )}

        {/* 4.1 REVIEWS & CUSTOMER TESTIMONIAL MODERATION */}
        {activeSection === 'reviews' && (
          <div className="space-y-6">
            <AdminReviewsModeration />
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
                        <option value="Refunded">Refunded</option>
                      </select>

                      {order.status !== 'Refunded' && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Process full refund of ${formatPrice(order.total)} for order ${order.orderNumber}?`)) {
                              await processOrderRefund({
                                orderId: order.id,
                                reason: 'Customer requested refund via admin panel',
                                restockInventory: true
                              });
                            }
                          }}
                          className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-300">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Delivery Address</span>
                      <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] text-zinc-400 font-mono">Carrier: {order.carrier} • Tracking #{order.trackingNumber}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            const newTracking = prompt('Enter new tracking number:', order.trackingNumber || '');
                            if (newTracking && newTracking !== order.trackingNumber) {
                              await updateOrderLogistics(order.id, {
                                trackingNumber: newTracking,
                                carrier: order.carrier
                              });
                            }
                          }}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Total Amount</span>
                      <p className="font-mono text-lg font-bold text-amber-400">{formatPrice(order.total)}</p>
                      <span className="text-[10px] text-zinc-400 font-mono">Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
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

        {/* 8. CUSTOM BESPOKE ORDERS ATELIER */}
        {activeSection === 'custom' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Bespoke Custom Orders & Atelier Pipeline</h3>
                <p className="text-xs text-zinc-400">Manage client briefs, dispatch official quotes with CAD blueprints, advance fabrication, and chat in realtime.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-bold">
                  {customOrders.length} Total Projects
                </span>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {(['all', 'Submitted', 'Quoted', 'Paid', 'In Design', 'Production', 'Shipped', 'Delivered'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setCustomStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      customStatusFilter === st
                        ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {st === 'all' ? 'All Projects' : st}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  placeholder="Search request #, customer, recipient..."
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400 w-full sm:w-64"
                />
              </div>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              {customOrders
                .filter(co => customStatusFilter === 'all' || co.status === customStatusFilter)
                .filter(co => {
                  if (!customSearch.trim()) return true;
                  const q = customSearch.toLowerCase();
                  return (
                    co.requestNumber.toLowerCase().includes(q) ||
                    co.customerName.toLowerCase().includes(q) ||
                    co.customerEmail.toLowerCase().includes(q) ||
                    co.recipient.toLowerCase().includes(q) ||
                    co.productType.toLowerCase().includes(q)
                  );
                })
                .map(co => (
                  <div key={co.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 text-xs space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                            {co.requestNumber}
                          </span>
                          <span className="font-bold text-zinc-100 text-sm">{co.productType}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Patron: <strong className="text-zinc-200">{co.customerName}</strong> ({co.customerEmail}) • Recipient: <strong className="text-zinc-200">{co.recipient} ({co.relationship})</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          co.status === 'Paid' || co.status === 'Delivered' || co.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : co.status === 'Shipped' || co.status === 'Production' || co.status === 'In Design'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          Status: {co.status}
                        </span>
                      </div>
                    </div>

                    {/* Brief Description & Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
                      <div className="md:col-span-2 space-y-2">
                        <span className="text-[10px] uppercase font-mono text-zinc-500 block">Artisan Fabrication Brief</span>
                        <p className="text-zinc-200 leading-relaxed italic">
                          "{co.description}"
                        </p>
                        {co.giftNote && (
                          <p className="text-amber-300/80 text-[11px] font-serif">
                            <strong>Calligraphy Gift Note:</strong> "{co.giftNote}"
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 text-[11px] text-zinc-400 border-t md:border-t-0 md:border-l border-zinc-800 md:pl-4">
                        <div><strong className="text-zinc-300">Occasion:</strong> {co.occasion}</div>
                        <div><strong className="text-zinc-300">Budget Range:</strong> {co.budgetRange}</div>
                        <div><strong className="text-zinc-300">Target Date:</strong> {co.targetDeliveryDate || 'Flexible'}</div>
                        <div><strong className="text-zinc-300">Colors:</strong> {co.preferredColors.join(', ')}</div>
                        <div><strong className="text-zinc-300">Style:</strong> {co.preferredStyle}</div>
                      </div>
                    </div>

                    {/* Uploaded Sketches & Proofs */}
                    {(co.uploadedFiles.length > 0 || co.quote?.designProofUrl || co.designProofUrl) && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono text-zinc-500 block">Brief Sketches & CAD Blueprints:</span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {co.uploadedFiles.map((fUrl, i) => (
                            <a
                              key={i}
                              href={fUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="relative group w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 shrink-0"
                            >
                              <img src={fUrl} alt="" className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center text-zinc-300">
                                Client #{i + 1}
                              </span>
                            </a>
                          ))}

                          {(co.quote?.designProofUrl || co.designProofUrl) && (
                            <a
                              href={co.quote?.designProofUrl || co.designProofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="relative group w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 bg-zinc-950 shrink-0"
                            >
                              <img src={co.quote?.designProofUrl || co.designProofUrl} alt="" className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-zinc-950 font-bold text-[8px] text-center">
                                CAD Proof
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quote Details summary if active */}
                    {co.quote && (
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 font-mono font-bold text-sm">
                            Quoted: {formatPrice(co.quote.amount)}
                          </span>
                          <span className="text-zinc-400 text-[11px]">
                            ({co.quote.turnaroundDays} business days turnaround • {co.quote.packagingIncluded})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 uppercase">
                          Quote Status: {co.quote.status}
                        </span>
                      </div>
                    )}

                    {/* Shipping info if dispatched */}
                    {co.trackingNumber && (
                      <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-xl flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-emerald-400 font-bold">Dispatched via {co.carrier}:</span>
                          <span className="font-mono text-zinc-200 ml-2">AWB #{co.trackingNumber}</span>
                        </div>
                        {co.trackingUrl && (
                          <a href={co.trackingUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                            <span>Track Parcel</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Admin Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-mono">Assigned:</span>
                        <span className="text-xs font-bold text-zinc-300">
                          {co.assignedAdminName || 'Hamza (Master Atelier)'}
                        </span>
                        {co.conversationStatus && (
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                            co.conversationStatus === 'waiting_on_customer'
                              ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                              : co.conversationStatus === 'waiting_on_artisan'
                              ? 'bg-rose-950/60 border-rose-800 text-rose-300 animate-pulse'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                          }`}>
                            {co.conversationStatus.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setAdminChatOrder(co);
                          }}
                          className={`px-3.5 py-2 font-medium text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
                            (co.unreadCountAdmin ?? 0) > 0
                              ? 'bg-rose-500 text-white font-bold animate-pulse shadow-lg shadow-rose-500/20'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Artisan Chat ({co.messages.length})</span>
                          {(co.unreadCountAdmin ?? 0) > 0 && (
                            <span className="px-1.5 py-0.2 bg-white text-rose-600 rounded-full text-[9px] font-bold">
                              {co.unreadCountAdmin} new
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setStatusModalOrder(co);
                            setNextCustomStatus(co.status);
                            setCustomCarrier(co.carrier || 'BlueDart Apex Priority');
                            setCustomTrackingAwb(co.trackingNumber || '');
                            setCustomTrackingUrl(co.trackingUrl || '');
                          }}
                          className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Sliders className="w-3.5 h-3.5 text-sky-400" />
                          <span>Advance Workflow Status</span>
                        </button>

                        <button
                          onClick={() => {
                            setQuoteOrderId(co.id);
                            if (co.quote) {
                              setQuoteAmount(co.quote.amount);
                              setQuoteDays(co.quote.turnaroundDays);
                              setQuotePackaging(co.quote.packagingIncluded);
                              setQuoteNotes(co.quote.notes || '');
                              setQuoteProofUrl(co.quote.designProofUrl || '');
                            }
                          }}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{co.quote ? 'Revise Quotation & CAD' : 'Issue Official Quotation'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 8. COUPLE SANCTUARY TEMPLATES & DOMAINS */}
        {activeSection === 'couple-templates' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Couple Sanctuary Templates & Live Subdomains</h3>
                <p className="text-xs text-zinc-400">
                  Manage marketplace template versions, pricing, color aesthetics, and monitor all active patron sanctuaries.
                </p>
              </div>
              <button
                onClick={handleOpenAddTemplate}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Template</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
                <span className="text-[11px] text-zinc-400 font-mono">Marketplace Templates</span>
                <p className="text-xl font-serif font-bold text-zinc-100 mt-1">{coupleTemplates.length}</p>
                <span className="text-[10px] text-emerald-400">{coupleTemplates.filter(t => t.isActive !== false).length} Active</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
                <span className="text-[11px] text-zinc-400 font-mono">Patron Sanctuaries</span>
                <p className="text-xl font-serif font-bold text-rose-400 mt-1">{coupleWebsites.length}</p>
                <span className="text-[10px] text-zinc-500">Live subdomains</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
                <span className="text-[11px] text-zinc-400 font-mono">Total Hearts Sent</span>
                <p className="text-xl font-serif font-bold text-rose-400 mt-1">
                  {coupleWebsites.reduce((acc, ws) => acc + (ws.heartsGiven || 0), 0)}
                </p>
                <span className="text-[10px] text-zinc-500">Realtime interactions</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
                <span className="text-[11px] text-zinc-400 font-mono">Guestbook Entries</span>
                <p className="text-xl font-serif font-bold text-amber-400 mt-1">
                  {coupleWebsites.reduce((acc, ws) => acc + (ws.guestbook?.length || 0), 0)}
                </p>
                <span className="text-[10px] text-zinc-500">Patron wishes</span>
              </div>
            </div>

            {/* Template Catalog Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-serif font-bold text-zinc-200">Catalog Templates ({coupleTemplates.length})</h4>
                <span className="text-[11px] text-zinc-500 font-mono">Version control & pricing active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupleTemplates.map(t => {
                  const isActive = t.isActive !== false;
                  return (
                    <div
                      key={t.id}
                      className={`bg-zinc-900/70 border rounded-3xl p-5 space-y-4 text-xs transition-all ${
                        isActive ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-800/40 opacity-60'
                      }`}
                    >
                      {/* Image Preview & Badges */}
                      <div className="relative h-40 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                        <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono text-zinc-200 border border-zinc-700">
                            {t.version || 'v2.0'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-950/80 backdrop-blur-md text-[10px] font-mono text-rose-300 border border-rose-800">
                            {t.themeCategory || 'Romantic'}
                          </span>
                        </div>
                        {t.popular && (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-[9px] uppercase tracking-wider">
                            Popular
                          </div>
                        )}
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-zinc-950/90 backdrop-blur-md text-amber-400 font-mono font-bold text-xs border border-zinc-800">
                          {formatPrice(t.price)}
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h5 className="font-serif font-bold text-base text-zinc-100">{t.name}</h5>
                        <p className="text-zinc-400 line-clamp-2 mt-1 text-[11px]">{t.description}</p>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {t.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300">
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCoupleTemplateActive(t.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border cursor-pointer ${
                              isActive
                                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                            }`}
                          >
                            {isActive ? '● Active' : '○ Disabled'}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditTemplate(t)}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg cursor-pointer transition-colors"
                            title="Edit Template"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete template "${t.name}"?`)) {
                                deleteCoupleTemplate(t.id);
                              }
                            }}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg cursor-pointer transition-colors"
                            title="Delete Template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patron Sanctuaries Table */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h4 className="text-sm font-serif font-bold text-zinc-200">Patron Live Sanctuaries ({coupleWebsites.length})</h4>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 border-b border-zinc-800 font-mono text-[10px] uppercase text-zinc-400">
                      <tr>
                        <th className="p-3.5">Partners</th>
                        <th className="p-3.5">Subdomain URL</th>
                        <th className="p-3.5">Template</th>
                        <th className="p-3.5">Engagement</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {coupleWebsites.map(ws => {
                        const isLive = ws.isPublished !== false && ws.status === 'active';
                        const liveUrl = `https://${ws.subdomain}.harconxsshop.com`;
                        return (
                          <tr key={ws.id} className="hover:bg-zinc-850/40">
                            <td className="p-3.5 font-bold text-zinc-100">
                              {ws.partner1Name} & {ws.partner2Name}
                            </td>
                            <td className="p-3.5 font-mono text-amber-400">
                              <a href={liveUrl} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                                <span>{ws.subdomain}.harconxsshop.com</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                            <td className="p-3.5 font-mono text-zinc-400">
                              {ws.templateId}
                            </td>
                            <td className="p-3.5 text-[11px] text-zinc-400">
                              <span className="text-rose-400 font-bold">{ws.heartsGiven || 0} ❤️</span> •{' '}
                              <span className="text-amber-400 font-bold">{ws.guestbook?.length || 0} ✍️</span> •{' '}
                              <span>{ws.views || 0} views</span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                isLive ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              }`}>
                                {isLive ? 'Live' : 'Paused'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => publishCoupleWebsite(ws.id, !isLive)}
                                  className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer border ${
                                    isLive ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                  }`}
                                >
                                  {isLive ? 'Pause' : 'Go Live'}
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Delete this sanctuary permanently?')) {
                                      deleteCoupleWebsite(ws.id);
                                    }
                                  }}
                                  className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
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

      {/* 2. ISSUE / REVISE QUOTE MODAL */}
      {quoteOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-zinc-100 text-sm">Issue Official Atelier Quotation</h3>
                <span className="text-[10px] text-zinc-500 font-mono">Custom Project Specifier</span>
              </div>
              <button onClick={() => setQuoteOrderId(null)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <form onSubmit={handleIssueQuote} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Fabrication Price (₹ INR)</label>
                  <input
                    type="number"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Turnaround Time (Days)</label>
                  <input
                    type="number"
                    value={quoteDays}
                    onChange={(e) => setQuoteDays(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Presentation Packaging Included</label>
                <select
                  value={quotePackaging}
                  onChange={(e) => setQuotePackaging(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400"
                >
                  {packagingOptions.map(p => (
                    <option key={p.id} value={p.name}>{p.name} (+{formatPrice(p.price)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Fabrication Specifications & Engineering Notes</label>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400 resize-none"
                  placeholder="Details regarding 24K gilding, laser depth, titanium alloy..."
                />
              </div>

              {/* CAD Design Proof Upload (Supabase Storage) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <label className="text-zinc-300 font-semibold block text-[11px]">Attach 3D CAD Blueprint / Laser Render</label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg cursor-pointer text-xs font-semibold flex items-center gap-1.5 border border-zinc-700">
                    <span>{isUploadingProof ? 'Uploading...' : 'Upload CAD Proof'}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.svg"
                      onChange={handleUploadProofFile}
                      className="hidden"
                      disabled={isUploadingProof}
                    />
                  </label>
                  <input
                    type="url"
                    value={quoteProofUrl}
                    onChange={(e) => setQuoteProofUrl(e.target.value)}
                    placeholder="Or paste Proof Image URL..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
                {quoteProofUrl && (
                  <div className="w-16 h-10 rounded overflow-hidden mt-1 border border-zinc-700">
                    <img src={quoteProofUrl} alt="Proof" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteOrderId(null)}
                  className="flex-1 py-2.5 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl cursor-pointer shadow-lg"
                >
                  Dispatch Official Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2.1 STATUS TRANSITION & LOGISTICS MODAL */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-zinc-100 text-sm">Advance Fabrication Workflow</h3>
                <span className="text-[10px] text-zinc-500 font-mono">Project #{statusModalOrder.requestNumber}</span>
              </div>
              <button onClick={() => setStatusModalOrder(null)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <form onSubmit={handleSaveStatusTransition} className="space-y-3.5 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">New Workflow Stage</label>
                <select
                  value={nextCustomStatus}
                  onChange={(e) => setNextCustomStatus(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400 font-mono text-xs"
                >
                  <option value="REQUESTED">REQUESTED (Brief Submitted)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Feasibility & Metallurgy Analysis)</option>
                  <option value="NEEDS_INFORMATION">NEEDS_INFORMATION (Clarification Required)</option>
                  <option value="QUOTED">QUOTED (Quotation Dispatched)</option>
                  <option value="QUOTE_ACCEPTED">QUOTE_ACCEPTED (Quote Accepted by Patron)</option>
                  <option value="PAYMENT_PENDING">PAYMENT_PENDING (Awaiting Payment Authorization)</option>
                  <option value="PAID">PAID (Payment Verified & Vault Reserved)</option>
                  <option value="DESIGNING">DESIGNING (3D CAD & Laser Proofing)</option>
                  <option value="CUSTOMER_REVIEW">CUSTOMER_REVIEW (3D Proof Ready for Patron Review)</option>
                  <option value="APPROVED">APPROVED (CAD Blueprints Approved)</option>
                  <option value="PRODUCTION">PRODUCTION (Machining & Laser Engraving)</option>
                  <option value="PACKING">PACKING (Polishing & Wax-Sealed Packaging)</option>
                  <option value="SHIPPED">SHIPPED (Dispatched with Courier)</option>
                  <option value="DELIVERED">DELIVERED (Completed Delivery)</option>
                  <option value="CANCELLED">CANCELLED (Cancelled by Patron/Store)</option>
                  <option value="REJECTED">REJECTED (Brief Rejected)</option>
                </select>
              </div>

              {(nextCustomStatus === 'Shipped' || nextCustomStatus === 'Delivered') && (
                <div className="space-y-3 p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] uppercase font-mono text-amber-400 block font-bold">Courier Logistics Details</span>
                  <div>
                    <label className="text-zinc-400 block mb-1">Logistics Carrier</label>
                    <input
                      type="text"
                      value={customCarrier}
                      onChange={(e) => setCustomCarrier(e.target.value)}
                      placeholder="e.g. BlueDart Apex Priority / DHL Express"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">AWB Tracking Number</label>
                    <input
                      type="text"
                      value={customTrackingAwb}
                      onChange={(e) => setCustomTrackingAwb(e.target.value)}
                      placeholder="e.g. BD-893201948"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Public Courier Tracking URL</label>
                    <input
                      type="url"
                      value={customTrackingUrl}
                      onChange={(e) => setCustomTrackingUrl(e.target.value)}
                      placeholder="https://track.bluedart.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOrder(null)}
                  className="flex-1 py-2.5 bg-zinc-900 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl cursor-pointer"
                >
                  Update Lifecycle State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2.2 ARTISAN DIRECT CHAT DRAWER */}
      {adminChatOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl flex flex-col h-[700px]">
            {/* Header with Assignment & Conversation Status */}
            <div className="border-b border-zinc-800 pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="font-serif font-bold text-zinc-100 text-sm">Direct Artisan Messaging Console</h3>
                  <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                    Supabase Realtime
                  </span>
                </div>
                <button onClick={() => setAdminChatOrder(null)} className="text-zinc-400 hover:text-zinc-200 text-sm cursor-pointer">✕</button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-800">
                <div>
                  <span className="text-zinc-400">Patron: </span>
                  <strong className="text-zinc-200">{adminChatOrder.customerName}</strong>
                  <span className="text-zinc-500 ml-1">({adminChatOrder.customerEmail})</span>
                  <span className="mx-2 text-zinc-600">•</span>
                  <span className="text-zinc-400">Order: </span>
                  <span className="font-mono text-amber-400 font-bold">{adminChatOrder.requestNumber}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Assign Staff */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 font-mono text-[10px]">Staff:</span>
                    <select
                      value={adminChatOrder.assignedAdminName || 'Hamza (Master Atelier)'}
                      onChange={(e) => {
                        const val = e.target.value;
                        assignCustomOrderStaff(adminChatOrder.id, 'admin-1', val);
                        showToast(`Custom order assigned to ${val}`);
                      }}
                      className="bg-zinc-950 border border-zinc-700 text-zinc-200 text-[11px] rounded-lg px-2 py-1 outline-none focus:border-amber-400"
                    >
                      <option value="Hamza (Master Atelier)">Hamza (Master Atelier)</option>
                      <option value="Lucas (3D CAD Engineer)">Lucas (3D CAD Engineer)</option>
                      <option value="Elena (Laser & Metallurgy)">Elena (Laser & Metallurgy)</option>
                      <option value="Sarah (Client Concierge)">Sarah (Client Concierge)</option>
                    </select>
                  </div>

                  {/* Conversation Status */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 font-mono text-[10px]">Status:</span>
                    <select
                      value={adminChatOrder.conversationStatus || 'waiting_on_customer'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        updateCustomOrderConversationStatus(adminChatOrder.id, val);
                        showToast(`Conversation marked as ${val.replace(/_/g, ' ')}`);
                      }}
                      className="bg-zinc-950 border border-zinc-700 text-zinc-200 text-[11px] rounded-lg px-2 py-1 outline-none focus:border-amber-400"
                    >
                      <option value="waiting_on_customer">Waiting on Patron</option>
                      <option value="waiting_on_artisan">Waiting on Artisan</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick response chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
              <span className="text-zinc-500 shrink-0 font-mono">Quick reply:</span>
              <button
                type="button"
                onClick={() => handleSendAdminChat(undefined, 'We have prepared your quotation and CAD specifications. Please review them at your convenience.')}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 shrink-0 cursor-pointer"
              >
                Quotation Issued
              </button>
              <button
                type="button"
                onClick={() => handleSendAdminChat(undefined, 'Your revised 3D CAD blueprint is rendered and attached below for your approval.')}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 shrink-0 cursor-pointer"
              >
                CAD Blueprint Ready
              </button>
              <button
                type="button"
                onClick={() => handleSendAdminChat(undefined, 'Your custom keepsake is currently on our atelier bench undergoing titanium laser engraving.')}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 shrink-0 cursor-pointer"
              >
                Engraving On Bench
              </button>
              <button
                type="button"
                onClick={() => handleSendAdminChat(undefined, 'Quality inspection complete. Your parcel has been packed in velvet and dispatched via priority courier.')}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 shrink-0 cursor-pointer"
              >
                Dispatched via Courier
              </button>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
              {adminChatOrder.messages.map((m) => {
                const isAdmin = m.sender === 'admin';
                return (
                  <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {isAdmin ? 'HARCONXS Atelier' : m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isAdmin && (
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {m.readByCustomer ? '✓✓ Seen by Patron' : '✓ Delivered'}
                        </span>
                      )}
                    </div>

                    <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      isAdmin ? 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none shadow-md' : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800'
                    }`}>
                      <p>{m.text}</p>

                      {/* Attachments preview */}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mt-2.5 space-y-2 border-t border-black/10 pt-2">
                          <div className="flex gap-2 overflow-x-auto">
                            {m.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={att}
                                target="_blank"
                                rel="noreferrer"
                                className="relative group block w-20 h-20 rounded-xl overflow-hidden border border-black/20 bg-black/5"
                              >
                                <img src={att} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity">
                                  View
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CAD Proof Upload Metadata options if attachment selected */}
            {adminChatAttachments.length > 0 && (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-200">Attached File(s)</span>
                  <button
                    type="button"
                    onClick={() => setAdminChatAttachments([])}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear attachments
                  </button>
                </div>

                <div className="flex gap-2">
                  {adminChatAttachments.map((url, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-700">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                  <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdminProofUpload}
                      onChange={(e) => setIsAdminProofUpload(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-950 text-amber-400"
                    />
                    <span>Mark as Official 3D CAD Blueprint Proof</span>
                  </label>
                  {isAdminProofUpload && (
                    <input
                      type="text"
                      value={adminProofTitle}
                      onChange={(e) => setAdminProofTitle(e.target.value)}
                      placeholder="Blueprint Title (e.g. Dimensions v2.1)"
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 outline-none"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Input Composer */}
            <form onSubmit={(e) => handleSendAdminChat(e)} className="pt-2 border-t border-zinc-800 flex items-center gap-2">
              <label className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl cursor-pointer border border-zinc-800 flex items-center gap-1 text-xs" title="Upload design file or CAD blueprint">
                <Plus className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Attach</span>
                <input
                  type="file"
                  accept="image/*,.pdf,.dwg,.dxf"
                  onChange={handleAdminChatFileUpload}
                  className="hidden"
                  disabled={isAdminUploadingChatFile}
                />
              </label>

              <input
                type="text"
                value={adminChatInput}
                onChange={(e) => setAdminChatInput(e.target.value)}
                placeholder="Type response from master artisan / atelier team..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 outline-none focus:border-amber-400 placeholder-zinc-500"
              />

              <button
                type="submit"
                disabled={!adminChatInput.trim() && adminChatAttachments.length === 0}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
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

      {/* 5. ADD / EDIT COUPLE TEMPLATE MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <h3 className="font-serif font-bold text-zinc-100 text-base">
                  {editingTemplateId ? 'Edit Sanctuary Template' : 'Add New Marketplace Template'}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                HARCONXS Atelier
              </span>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-zinc-400 block mb-1">Template Name</label>
                  <input
                    type="text"
                    value={tmplName}
                    onChange={(e) => setTmplName(e.target.value)}
                    placeholder="e.g. Celestial Starlight"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Version</label>
                  <input
                    type="text"
                    value={tmplVersion}
                    onChange={(e) => setTmplVersion(e.target.value)}
                    placeholder="e.g. v2.1"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Theme Aesthetic Category</label>
                  <select
                    value={tmplCategory}
                    onChange={(e) => setTmplCategory(e.target.value as CoupleThemeCategory)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-400"
                  >
                    <option value="Romantic">Romantic (Rose & Blush)</option>
                    <option value="Minimal">Minimal (Clean Monochrome)</option>
                    <option value="Luxury">Luxury (Obsidian & Gold)</option>
                    <option value="Cute">Cute (Pastel Playful)</option>
                    <option value="Elegance">Elegance (Fine Serif)</option>
                    <option value="Golden Hour">Golden Hour (Sunset Glow)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={tmplPrice}
                    onChange={(e) => setTmplPrice(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description</label>
                <textarea
                  value={tmplDesc}
                  onChange={(e) => setTmplDesc(e.target.value)}
                  rows={2}
                  placeholder="Describe the aesthetic and mood of this theme..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Preview Thumbnail Image URL</label>
                <input
                  type="url"
                  value={tmplImage}
                  onChange={(e) => setTmplImage(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono text-[11px] outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Demo Subdomain</label>
                  <input
                    type="text"
                    value={tmplDemoSubdomain}
                    onChange={(e) => setTmplDemoSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="demo-celestial"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Default Typography</label>
                  <select
                    value={tmplFont}
                    onChange={(e) => setTmplFont(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none"
                  >
                    <option value="Playfair Display">Playfair Display (Serif)</option>
                    <option value="Cormorant Garamond">Cormorant Garamond (Fine Classic)</option>
                    <option value="Cinzel">Cinzel (Roman Heritage)</option>
                    <option value="Great Vibes">Great Vibes (Romantic Script)</option>
                    <option value="Inter">Inter (Ultra Clean)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Key Features (comma-separated)</label>
                <input
                  type="text"
                  value={tmplFeatures}
                  onChange={(e) => setTmplFeatures(e.target.value)}
                  placeholder="Live Counter, Photo Wall, Soundtrack Player, Guestbook"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Accent Hex Colors (comma-separated)</label>
                <input
                  type="text"
                  value={tmplColors}
                  onChange={(e) => setTmplColors(e.target.value)}
                  placeholder="#e11d48, #fb7185, #fda4af"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono text-[11px] outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tmplPopular}
                    onChange={(e) => setTmplPopular(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-zinc-300">Mark as Featured / Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tmplActive}
                    onChange={(e) => setTmplActive(e.target.checked)}
                    className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-zinc-300">Active in Storefront Marketplace</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-rose-600/20"
                >
                  {editingTemplateId ? 'Save Changes' : 'Publish Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
