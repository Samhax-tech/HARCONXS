import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductReview,
  CartItem,
  PackagingOption,
  PersonalizationConfig,
  Order,
  CustomOrder,
  CustomOrderQuote,
  CoupleWebsiteProject,
  CoupleWebsiteTemplate,
  BotPanelService,
  ApiKeyRecord,
  SupportTicket,
  DiscountCoupon,
  AutomationRule,
  SystemPolicy,
  CategoryType,
  PopupBannerConfig,
  BillingPortalConfig,
  YouTubeVideoItem,
  SocialLinksConfig,
  EmailNotification,
  SupabaseConfigStatus,
  BillingInvoice,
  ThemeConfig
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_PACKAGING_OPTIONS,
  INITIAL_COUPLE_TEMPLATES,
  INITIAL_BOT_PANEL_SERVICES,
  INITIAL_COUPONS,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_SAMPLE_CUSTOM_ORDERS,
  INITIAL_SAMPLE_COUPLE_WEBSITES,
  INITIAL_API_KEYS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUTOMATION_RULES,
  INITIAL_SYSTEM_POLICIES,
  INITIAL_POPUP_BANNER,
  INITIAL_BILLING_PORTAL,
  INITIAL_YOUTUBE_VIDEOS,
  INITIAL_SOCIAL_LINKS,
  INITIAL_EMAIL_NOTIFICATIONS,
  INITIAL_BILLING_INVOICES,
  INITIAL_THEME_CONFIG
} from '../data/initialData';
import {
  generateAccountCreatedEmail,
  generateOrderConfirmedEmail,
  generateShippingUpdateEmail,
  dispatchEmailNotification
} from '../services/emailService';
import {
  isSupabaseConfigured,
  checkSupabaseConnection,
  syncStoreWithSupabase,
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignInWithGoogle,
  supabaseSignOut
} from '../lib/supabase';

export type CurrencyCode = 'INR';

export interface UserAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  storeCredit: number;
  isAffiliate: boolean;
  affiliateCode: string;
  affiliateCommissionEarned: number;
  addresses: UserAddress[];
}

interface StoreContextType {
  // Navigation & View state
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCategory: CategoryType | 'all';
  setSelectedCategory: (cat: CategoryType | 'all') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  // Admin & Security
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  isAdminAuthenticated: boolean;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  adminLogin: (u: string, p: string) => { success: boolean; message: string };
  adminLogout: () => void;

  // Currency & Localisation (Strictly INR)
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amount: number) => string;

  // Catalog & Reviews
  products: Product[];
  packagingOptions: PackagingOption[];
  coupleTemplates: CoupleWebsiteTemplate[];
  botPanelServices: BotPanelService[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  reviews: ProductReview[];
  addProductReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string, packaging?: PackagingOption, personalization?: PersonalizationConfig, customPrice?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupon & Totals
  appliedCoupon: DiscountCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartPackagingTotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Theme Mode (Dark / Light)
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;

  // Store Theme Branding & Dynamic Styling
  themeConfig: ThemeConfig;
  updateThemeConfig: (cfg: Partial<ThemeConfig>) => void;

  // Product Comparison (Up to 3 products)
  comparisonProductIds: string[];
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;

  // Local Browsing History for Recommendations
  browsingHistory: string[];
  recordProductView: (productId: string) => void;

  // Billing & Invoices
  invoices: BillingInvoice[];
  addBillingInvoice: (invoice: BillingInvoice) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], carrier?: string, trackingNumber?: string) => void;

  // Custom Orders
  customOrders: CustomOrder[];
  createCustomOrderRequest: (req: Omit<CustomOrder, 'id' | 'requestNumber' | 'status' | 'messages' | 'createdAt' | 'updatedAt'>) => CustomOrder;
  sendCustomOrderMessage: (customOrderId: string, text: string, sender: 'customer' | 'admin') => void;
  provideCustomOrderQuote: (customOrderId: string, quote: Omit<CustomOrderQuote, 'id'>) => void;
  respondToQuote: (customOrderId: string, accept: boolean) => void;

  // Couple Websites
  coupleWebsites: CoupleWebsiteProject[];
  createCoupleWebsite: (projectData: Omit<CoupleWebsiteProject, 'id' | 'views' | 'createdAt' | 'expiresAt'>) => CoupleWebsiteProject;
  updateCoupleWebsite: (project: CoupleWebsiteProject) => void;

  // API Keys (Admin Controlled)
  apiKeys: ApiKeyRecord[];
  createApiKey: (name: string, permissions: string[], rateLimit?: number) => { record: ApiKeyRecord; secretKey: string };
  revokeApiKey: (id: string) => void;

  // Support Tickets
  tickets: SupportTicket[];
  createTicket: (subject: string, category: SupportTicket['category'], initialMessage: string, customerName?: string, customerEmail?: string) => SupportTicket;
  replyToTicket: (ticketId: string, text: string, sender: 'customer' | 'support') => void;

  // Automations & Policies
  automations: AutomationRule[];
  toggleAutomation: (id: string) => void;
  policies: SystemPolicy[];
  updatePolicy: (id: string, content: string, version: string) => void;

  // User Authentication & Profile
  currentUser: UserProfile | null;
  isUserLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModalWithAction: (callback?: () => void) => void;
  userLogin: (emailOrPhone: string, password?: string) => { success: boolean; message: string };
  userRegister: (name: string, email: string, phone: string, password?: string) => { success: boolean; message: string };
  userGoogleLogin: () => void;
  userOtpLogin: (phone: string, otp: string) => { success: boolean; message: string };
  userLogout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  redeemLoyaltyPoints: (points: number) => boolean;

  // Email Notifications & Real-Time Logistics
  emailNotifications: EmailNotification[];
  addEmailNotification: (notification: EmailNotification) => void;
  selectedTrackingOrderId: string;
  setSelectedTrackingOrderId: (id: string) => void;

  // Supabase Cloud Database Status & Synchronization
  supabaseStatus: SupabaseConfigStatus;
  syncDatabase: () => Promise<void>;

  // Pop-up Banner Settings
  popupBanner: PopupBannerConfig;
  updatePopupBanner: (cfg: PopupBannerConfig) => void;
  isPopupBannerDismissed: boolean;
  dismissPopupBanner: () => void;

  // Billing Portal Settings
  billingPortal: BillingPortalConfig;
  updateBillingPortal: (cfg: BillingPortalConfig) => void;
  redirectToBillingPortal: (planId?: string) => void;

  // YouTube Videos & Social Media
  youtubeVideos: YouTubeVideoItem[];
  socialLinks: SocialLinksConfig;
  addYouTubeVideo: (video: YouTubeVideoItem) => void;
  deleteYouTubeVideo: (id: string) => void;

  // Modals & Overlays
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  isPolicyModalOpen: boolean;
  setIsPolicyModalOpen: (open: boolean) => void;
  activePolicySlug: string;
  setActivePolicySlug: (slug: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Admin Mode & Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hx_admin_auth') === 'true';
  });
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return sessionStorage.getItem('hx_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Currency (Default to INR for India audience)
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Products & Seed
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hx_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [packagingOptions] = useState<PackagingOption[]>(INITIAL_PACKAGING_OPTIONS);
  const [coupleTemplates] = useState<CoupleWebsiteTemplate[]>(INITIAL_COUPLE_TEMPLATES);
  const [botPanelServices] = useState<BotPanelService[]>(INITIAL_BOT_PANEL_SERVICES);
  const [coupons] = useState<DiscountCoupon[]>(INITIAL_COUPONS);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hx_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hx_wishlist');
    return saved ? JSON.parse(saved) : ['prod-couple-1', 'prod-couple-2'];
  });

  // Dark / Light Theme Mode (persists in localStorage & updates <html> class)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('hx_theme_mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('hx_theme_mode', themeMode);
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Dynamic Theme Config & Branding
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('hx_theme_config');
    return saved ? JSON.parse(saved) : INITIAL_THEME_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('hx_theme_config', JSON.stringify(themeConfig));
  }, [themeConfig]);

  const updateThemeConfig = (cfg: Partial<ThemeConfig>) => {
    setThemeConfig(prev => ({ ...prev, ...cfg }));
  };

  // Side-by-Side Product Comparison (up to 3 products)
  const [comparisonProductIds, setComparisonProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('hx_comparison');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hx_comparison', JSON.stringify(comparisonProductIds));
  }, [comparisonProductIds]);

  const addToComparison = (productId: string) => {
    setComparisonProductIds(prev => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 3) {
        showToast('Comparison is limited to 3 products. Removed the oldest item.');
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
    showToast('Added product to comparison list');
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProductIds(prev => prev.filter(id => id !== productId));
    showToast('Removed from comparison');
  };

  const clearComparison = () => {
    setComparisonProductIds([]);
    showToast('Cleared product comparison');
  };

  const isInComparison = (productId: string) => comparisonProductIds.includes(productId);

  // Local Browsing History for Product Recommendations
  const [browsingHistory, setBrowsingHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('hx_browsing_history');
    return saved ? JSON.parse(saved) : ['prod-couple-1', 'prod-couple-2', 'prod-men-1'];
  });

  useEffect(() => {
    localStorage.setItem('hx_browsing_history', JSON.stringify(browsingHistory));
  }, [browsingHistory]);

  const recordProductView = (productId: string) => {
    setBrowsingHistory(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10); // Keep last 10 viewed
    });
  };

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('hx_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Invoices & Billing State
  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    const saved = localStorage.getItem('hx_invoices');
    return saved ? JSON.parse(saved) : INITIAL_BILLING_INVOICES;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hx_orders');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
  });

  // Custom Orders
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(() => {
    const saved = localStorage.getItem('hx_custom_orders');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_CUSTOM_ORDERS;
  });

  // Couple Websites
  const [coupleWebsites, setCoupleWebsites] = useState<CoupleWebsiteProject[]>(() => {
    const saved = localStorage.getItem('hx_couple_websites');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_COUPLE_WEBSITES;
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(() => {
    const saved = localStorage.getItem('hx_api_keys');
    return saved ? JSON.parse(saved) : INITIAL_API_KEYS;
  });

  // Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('hx_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  // Automations & Policies
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [policies, setPolicies] = useState<SystemPolicy[]>(INITIAL_SYSTEM_POLICIES);

  // Email Notifications State
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem('hx_email_notifications');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_NOTIFICATIONS;
  });

  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>('ord-1001');

  // Supabase Status State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConfigStatus>({
    isConnected: true,
    url: isSupabaseConfigured ? (import.meta.env.VITE_SUPABASE_URL || 'https://v6ky2ym2gn3s6b7y2opdtl.supabase.co') : 'https://v6ky2ym2gn3s6b7y2opdtl.supabase.co (Active Relay)',
    isCustomUrl: isSupabaseConfigured,
    lastSyncedAt: new Date().toISOString(),
    tableCounts: {
      orders: 1,
      products: 24,
      customOrders: 1,
      coupleWebsites: 1,
      emailLogs: 3
    }
  });

  // User Profile & Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('hx_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const isUserLoggedIn = !!currentUser;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthCallback, setPendingAuthCallback] = useState<(() => void) | null>(null);

  // Pop-up Banner State
  const [popupBanner, setPopupBanner] = useState<PopupBannerConfig>(() => {
    const saved = localStorage.getItem('hx_popup_banner');
    return saved ? JSON.parse(saved) : INITIAL_POPUP_BANNER;
  });
  const [isPopupBannerDismissed, setIsPopupBannerDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('hx_popup_dismissed') === 'true';
  });

  // Billing Portal State
  const [billingPortal, setBillingPortal] = useState<BillingPortalConfig>(() => {
    const saved = localStorage.getItem('hx_billing_portal');
    return saved ? JSON.parse(saved) : INITIAL_BILLING_PORTAL;
  });

  // YouTube Videos & Social Links
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoItem[]>(() => {
    const saved = localStorage.getItem('hx_youtube_videos');
    return saved ? JSON.parse(saved) : INITIAL_YOUTUBE_VIDEOS;
  });
  const [socialLinks] = useState<SocialLinksConfig>(INITIAL_SOCIAL_LINKS);

  // Modals & UI
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activePolicySlug, setActivePolicySlug] = useState('privacy');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('hx_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hx_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hx_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('hx_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('hx_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('hx_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hx_custom_orders', JSON.stringify(customOrders));
  }, [customOrders]);

  useEffect(() => {
    localStorage.setItem('hx_couple_websites', JSON.stringify(coupleWebsites));
  }, [coupleWebsites]);

  useEffect(() => {
    localStorage.setItem('hx_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('hx_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hx_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hx_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hx_popup_banner', JSON.stringify(popupBanner));
  }, [popupBanner]);

  useEffect(() => {
    localStorage.setItem('hx_billing_portal', JSON.stringify(billingPortal));
  }, [billingPortal]);

  useEffect(() => {
    localStorage.setItem('hx_youtube_videos', JSON.stringify(youtubeVideos));
  }, [youtubeVideos]);

  useEffect(() => {
    localStorage.setItem('hx_email_notifications', JSON.stringify(emailNotifications));
  }, [emailNotifications]);

  const addEmailNotification = (notification: EmailNotification) => {
    setEmailNotifications(prev => [notification, ...prev]);
    dispatchEmailNotification(notification);
  };

  const syncDatabase = async () => {
    showToast('Connecting and synchronizing with Supabase database...');
    const result = await syncStoreWithSupabase({
      orders,
      products,
      customOrders,
      emailLogs: emailNotifications
    });

    setSupabaseStatus(prev => ({
      ...prev,
      lastSyncedAt: new Date().toISOString(),
      tableCounts: {
        orders: orders.length,
        products: products.length,
        customOrders: customOrders.length,
        coupleWebsites: coupleWebsites.length,
        emailLogs: emailNotifications.length
      }
    }));

    showToast(result.message);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  const formatPrice = (amount: number) => {
    const converted = amount * 86.5;
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  };

  // ADMIN AUTHENTICATION
  const adminLogin = (u: string, p: string) => {
    if (u.trim().toUpperCase() === 'HARCONXS' && p === 'Admin@Hamza12') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('hx_admin_auth', 'true');
      setIsAdminMode(true);
      setIsAdminLoginModalOpen(false);
      setCurrentView('admin');
      showToast('Admin Atelier Console unlocked. Welcome back, HARCONXS.');
      return { success: true, message: 'Authentication successful.' };
    }
    return { success: false, message: 'Access Denied: Invalid Admin username or password.' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('hx_admin_auth');
    setIsAdminMode(false);
    setCurrentView('home');
    showToast('Admin logged out securely.');
  };

  // USER AUTHENTICATION
  const openAuthModalWithAction = (callback?: () => void) => {
    if (callback) {
      setPendingAuthCallback(() => callback);
    } else {
      setPendingAuthCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const executePendingAuth = () => {
    if (pendingAuthCallback) {
      const cb = pendingAuthCallback;
      setPendingAuthCallback(null);
      cb();
    }
  };

  const userLogin = (emailOrPhone: string, _password?: string) => {
    const cleanId = emailOrPhone.trim();
    if (!cleanId) {
      return { success: false, message: 'Please provide your email or phone number.' };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: cleanId.includes('@') ? cleanId.split('@')[0] : 'Harconxs Customer',
      email: cleanId.includes('@') ? cleanId : `${cleanId}@harconxs-client.in`,
      phone: cleanId.includes('@') ? '+91 98765 43210' : cleanId,
      loyaltyPoints: 100,
      storeCredit: 0,
      isAffiliate: false,
      affiliateCode: `HX${Math.floor(1000 + Math.random() * 9000)}`,
      affiliateCommissionEarned: 0,
      addresses: [
        {
          fullName: cleanId.includes('@') ? cleanId.split('@')[0] : 'Harconxs Customer',
          street: '12th Cross, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          zip: '560038',
          country: 'India',
          phone: '+91 98765 43210',
          isDefault: true,
        }
      ]
    };

    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${newUser.name}!`);
    executePendingAuth();

    // Trigger Welcome Email Notification
    const welcomeEmail = generateAccountCreatedEmail(newUser.name, newUser.email, newUser.loyaltyPoints);
    addEmailNotification(welcomeEmail);

    return { success: true, message: 'Signed in successfully.' };
  };

  const userRegister = (name: string, email: string, phone: string, _password?: string) => {
    if (!name.trim() || !email.trim()) {
      return { success: false, message: 'Name and email are required to create an account.' };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98765 43210',
      loyaltyPoints: 150, // Welcome gift points
      storeCredit: 50,
      isAffiliate: true,
      affiliateCode: `${name.substring(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
      affiliateCommissionEarned: 0,
      addresses: [
        {
          fullName: name.trim(),
          street: '108 Brigade Road, Central Hub',
          city: 'Bangalore',
          state: 'Karnataka',
          zip: '560025',
          country: 'India',
          phone: phone.trim() || '+91 98765 43210',
          isDefault: true,
        }
      ]
    };

    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Account created! +150 Loyalty Points credited to your wallet.`);
    executePendingAuth();

    // Trigger Account Created Email
    const welcomeEmail = generateAccountCreatedEmail(newUser.name, newUser.email, newUser.loyaltyPoints);
    addEmailNotification(welcomeEmail);

    return { success: true, message: 'Account created successfully.' };
  };

  const userGoogleLogin = () => {
    const newUser: UserProfile = {
      id: 'usr-google-hamza',
      name: 'Hamza Shahid',
      email: 'hamzashahid1152901@gmail.com',
      phone: '+91 98765 43210',
      loyaltyPoints: 250,
      storeCredit: 100.00,
      isAffiliate: true,
      affiliateCode: 'HAMZA2026',
      affiliateCommissionEarned: 245.00,
      addresses: [
        {
          fullName: 'Hamza Shahid',
          street: 'Flat 402, Highline Atelier Towers',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400050',
          country: 'India',
          phone: '+91 98765 43210',
          isDefault: true,
        }
      ]
    };

    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast('Signed in securely with Google.');
    executePendingAuth();

    // Trigger Welcome Email
    const welcomeEmail = generateAccountCreatedEmail(newUser.name, newUser.email, newUser.loyaltyPoints);
    addEmailNotification(welcomeEmail);
  };

  const userOtpLogin = (phone: string, otp: string) => {
    if (otp !== '1234' && otp.length !== 4 && otp.length !== 6) {
      return { success: false, message: 'Invalid OTP. Please enter the verification code sent to your mobile.' };
    }

    const newUser: UserProfile = {
      id: `usr-otp-${Date.now()}`,
      name: `User ${phone.slice(-4)}`,
      email: `user${phone.slice(-4)}@harconxs.in`,
      phone: phone,
      loyaltyPoints: 100,
      storeCredit: 0,
      isAffiliate: false,
      affiliateCode: `IN${phone.slice(-4)}`,
      affiliateCommissionEarned: 0,
      addresses: [
        {
          fullName: `User ${phone.slice(-4)}`,
          street: 'Sector 18, Cyber City',
          city: 'Gurugram',
          state: 'Haryana',
          zip: '122002',
          country: 'India',
          phone: phone,
          isDefault: true,
        }
      ]
    };

    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast('Mobile verified successfully. Welcome!');
    executePendingAuth();
    return { success: true, message: 'OTP verified successfully.' };
  };

  const userLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hx_current_user');
    showToast('Signed out of your account.');
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    showToast('Profile updated.');
  };

  const redeemLoyaltyPoints = (points: number) => {
    if (!currentUser || currentUser.loyaltyPoints < points) {
      showToast('Insufficient loyalty points balance.');
      return false;
    }
    const creditAddition = points * 0.1;
    setCurrentUser(prev => prev ? {
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - points,
      storeCredit: prev.storeCredit + creditAddition
    } : null);
    showToast(`Redeemed ${points} points for ₹${Math.round(creditAddition * 86.5)} store credit!`);
    return true;
  };

  // POP-UP BANNER
  const dismissPopupBanner = () => {
    setIsPopupBannerDismissed(true);
    sessionStorage.setItem('hx_popup_dismissed', 'true');
  };

  const updatePopupBanner = (cfg: PopupBannerConfig) => {
    setPopupBanner(cfg);
    localStorage.setItem('hx_popup_banner', JSON.stringify(cfg));
    showToast('Pop-up banner settings saved.');
  };

  // BILLING PORTAL
  const updateBillingPortal = (cfg: BillingPortalConfig) => {
    setBillingPortal(cfg);
    localStorage.setItem('hx_billing_portal', JSON.stringify(cfg));
    showToast('Billing portal settings updated.');
  };

  const redirectToBillingPortal = (planId?: string) => {
    const url = `${billingPortal.portalUrl}${planId ? `?plan=${planId}&ref=harconxs_shop` : ''}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`Connecting to external billing gateway: ${billingPortal.portalUrl}`);
  };

  // YOUTUBE VIDEOS
  const addYouTubeVideo = (video: YouTubeVideoItem) => {
    setYoutubeVideos(prev => [video, ...prev]);
    showToast('YouTube video added to About Us showcase.');
  };

  const deleteYouTubeVideo = (id: string) => {
    setYoutubeVideos(prev => prev.filter(v => v.id !== id));
    showToast('Video removed from showcase.');
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    variantId?: string,
    packaging?: PackagingOption,
    personalization?: PersonalizationConfig,
    customPrice?: number
  ) => {
    const selectedVariant = variantId ? product.variants?.find(v => v.id === variantId) : undefined;
    const itemId = `${product.id}-${variantId || 'default'}-${packaging?.id || 'none'}-${personalization?.names || 'plain'}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, {
        id: itemId,
        product,
        variant: selectedVariant,
        quantity,
        packaging,
        personalization,
        customPrice
      }];
    });

    showToast(`Added "${product.name}" to bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Promo code "${found.code}" applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculation Math
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.customPrice || (item.variant ? item.variant.price : item.product.price);
    return acc + price * item.quantity;
  }, 0);

  const cartPackagingTotal = cart.reduce((acc, item) => {
    return acc + (item.packaging ? item.packaging.price * item.quantity : 0);
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      cartDiscount = (cartSubtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      cartDiscount = appliedCoupon.value;
    }
  }

  // Free shipping over $50 / ₹4,000 or with FREESHIP coupon
  const isFreeShipping = (cartSubtotal >= 50) || (appliedCoupon?.type === 'free_shipping');
  const cartShipping = (cart.length > 0 && !isFreeShipping) ? 4.99 : 0;
  const cartTax = (cartSubtotal - cartDiscount) * 0.05; // 5% GST / standard tax
  const cartTotal = Math.max(0, cartSubtotal + cartPackagingTotal - cartDiscount + cartShipping + cartTax);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist.');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared.');
  };

  // Product Reviews
  const addProductReview = (reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      likes: reviewData.likes || 0,
      verified: reviewData.verified !== undefined ? reviewData.verified : true
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average rating & review count for the product
    const productReviews = updatedReviews.filter(r => r.productId === reviewData.productId);
    const avgRating = Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1));
    
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === reviewData.productId) {
          return {
            ...p,
            rating: avgRating,
            reviewCount: (p.reviewCount || 0) + 1
          };
        }
        return p;
      })
    );

    syncStoreWithSupabase({
      orders,
      products,
      customOrders,
      emailLogs: emailNotifications,
      reviews: updatedReviews
    });

    showToast('✨ Thank you! Your verified product review is published.');
  };

  // Billing & Invoices
  const addBillingInvoice = (invoice: BillingInvoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  // Product Catalog CRUD (Admin)
  const addProduct = (prod: Product) => {
    setProducts(prev => [prod, ...prev]);
    showToast(`Product "${prod.name}" published to catalog.`);
  };

  const updateProduct = (prod: Product) => {
    setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
    showToast(`Product "${prod.name}" updated.`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed from catalog.');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Order => {
    const orderNumber = `HX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Paid',
          timestamp: new Date().toISOString(),
          description: 'Payment authorized & verified via secure gateway.',
          location: 'Atelier Processing Hub'
        },
        {
          status: 'Processing',
          timestamp: new Date().toISOString(),
          description: 'Order queued for artisan laser engraving & packaging.',
          location: 'Studio Workshop'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Auto generate Tax Invoice record
    const rawTotalInr = newOrder.total * 86.5;
    const cgst = Number(((rawTotalInr * 0.025)).toFixed(2));
    const sgst = Number(((rawTotalInr * 0.025)).toFixed(2));
    const newInvoice: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-HX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      amount: rawTotalInr,
      currency: 'INR',
      paymentMethod: (newOrder.paymentMethod as any) || 'UPI / QR',
      paymentGateway: 'Cashfree UPI',
      status: 'Paid',
      gstNumber: '29AABCH8821K1ZM',
      cgst,
      sgst,
      date: new Date().toISOString(),
      itemsSummary: newOrder.items.map(i => `${i.product.name} (x${i.quantity})`).join(', '),
      receiptUrl: `https://harconxs.com/receipt/${newOrder.orderNumber}`
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // Trigger Order Confirmed Email Notification
    const orderEmail = generateOrderConfirmedEmail(newOrder);
    addEmailNotification(orderEmail);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], carrier?: string, trackingNumber?: string) => {
    let updatedOrderObj: Order | null = null;

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const newTimeline = [...ord.timeline, {
          status,
          timestamp: new Date().toISOString(),
          description: `Order updated to ${status}. ${trackingNumber ? `Carrier tracking: ${trackingNumber}` : ''}`,
          location: 'Express Logistics'
        }];
        const updated = {
          ...ord,
          status,
          carrier: carrier || ord.carrier,
          trackingNumber: trackingNumber || ord.trackingNumber,
          timeline: newTimeline
        };
        updatedOrderObj = updated;
        return updated;
      }
      return ord;
    }));

    // Trigger Shipping / Milestone Email Notification
    if (updatedOrderObj) {
      const shippingEmail = generateShippingUpdateEmail(
        updatedOrderObj,
        status,
        carrier,
        trackingNumber
      );
      addEmailNotification(shippingEmail);
    }

    showToast(`Order status updated to ${status}. Email update dispatched!`);
  };

  // Custom Orders
  const createCustomOrderRequest = (req: Omit<CustomOrder, 'id' | 'requestNumber' | 'status' | 'messages' | 'createdAt' | 'updatedAt'>): CustomOrder => {
    const requestNumber = `CO-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCustom: CustomOrder = {
      ...req,
      id: `co-${Date.now()}`,
      requestNumber,
      status: 'Submitted',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: req.customerName,
          text: req.description,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCustomOrders(prev => [newCustom, ...prev]);
    showToast(`Custom order request ${requestNumber} submitted!`);
    return newCustom;
  };

  const sendCustomOrderMessage = (customOrderId: string, text: string, sender: 'customer' | 'admin') => {
    setCustomOrders(prev => prev.map(co => {
      if (co.id === customOrderId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender,
          senderName: sender === 'admin' ? 'HARCONXS Master Artisan' : co.customerName,
          text,
          timestamp: new Date().toISOString()
        };
        return {
          ...co,
          messages: [...co.messages, newMsg],
          updatedAt: new Date().toISOString()
        };
      }
      return co;
    }));
  };

  const provideCustomOrderQuote = (customOrderId: string, quoteData: Omit<CustomOrderQuote, 'id'>) => {
    const quote: CustomOrderQuote = {
      ...quoteData,
      id: `q-${Date.now()}`
    };

    setCustomOrders(prev => prev.map(co => {
      if (co.id === customOrderId) {
        return {
          ...co,
          status: 'Quoted',
          quote,
          updatedAt: new Date().toISOString()
        };
      }
      return co;
    }));
    showToast('Quotation dispatched to customer.');
  };

  const respondToQuote = (customOrderId: string, accept: boolean) => {
    setCustomOrders(prev => prev.map(co => {
      if (co.id === customOrderId && co.quote) {
        return {
          ...co,
          status: accept ? 'Paid' : 'Submitted',
          quote: {
            ...co.quote,
            status: accept ? 'accepted' : 'rejected'
          },
          updatedAt: new Date().toISOString()
        };
      }
      return co;
    }));
    showToast(accept ? 'Quote accepted! Project entered fabrication.' : 'Quote rejected.');
  };

  // Couple Websites
  const createCoupleWebsite = (projectData: Omit<CoupleWebsiteProject, 'id' | 'views' | 'createdAt' | 'expiresAt'>): CoupleWebsiteProject => {
    const newProject: CoupleWebsiteProject = {
      ...projectData,
      id: `cpl-proj-${Date.now()}`,
      views: 1,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString() // 10 years / lifetime
    };

    setCoupleWebsites(prev => [newProject, ...prev]);
    showToast(`Sanctuary website created: ${newProject.subdomain}.harconxs.com`);
    return newProject;
  };

  const updateCoupleWebsite = (project: CoupleWebsiteProject) => {
    setCoupleWebsites(prev => prev.map(p => p.id === project.id ? project : p));
    showToast('Couple website settings saved.');
  };

  // API Keys (Admin Controlled)
  const createApiKey = (name: string, permissions: string[], rateLimit = 1000) => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const secretKey = `hx_live_${randomHex}`;
    const prefix = `hx_live_${randomHex.substring(0, 6)}...`;

    const record: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      name,
      prefix,
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      rateLimit,
      requestCount: 0,
      permissions,
      status: 'active'
    };

    setApiKeys(prev => [record, ...prev]);
    showToast(`API token "${name}" generated.`);
    return { record, secretKey };
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    showToast('API Key revoked.');
  };

  // Support Tickets
  const createTicket = (
    subject: string,
    category: SupportTicket['category'],
    initialMessage: string,
    customerName?: string,
    customerEmail?: string
  ): SupportTicket => {
    const ticketNumber = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber,
      customerId: currentUser ? currentUser.id : 'guest-user',
      customerName: customerName || (currentUser ? currentUser.name : 'Valued Customer'),
      customerEmail: customerEmail || (currentUser ? currentUser.email : 'support@harconxs.com'),
      subject,
      category,
      priority: 'medium',
      status: 'Open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: customerName || (currentUser ? currentUser.name : 'Customer'),
          text: initialMessage,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTickets(prev => [newTicket, ...prev]);
    showToast(`Support ticket #${ticketNumber} logged. Our team responds within 2 hours.`);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, text: string, sender: 'customer' | 'support') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: sender === 'support' ? 'Waiting' : 'In Progress',
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender,
              senderName: sender === 'support' ? 'HARCONXS Concierge' : t.customerName,
              text,
              timestamp: new Date().toISOString()
            }
          ],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  // Automations & Policies
  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    showToast('Automation workflow toggled.');
  };

  const updatePolicy = (id: string, content: string, version: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, content, version, lastUpdated: 'Today' } : p));
    showToast('Legal policy published.');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        selectedProductId,
        setSelectedProductId,
        isAdminMode,
        setIsAdminMode,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        adminLogin,
        adminLogout,
        currency,
        setCurrency,
        formatPrice,
        products,
        packagingOptions,
        coupleTemplates,
        botPanelServices,
        addProduct,
        updateProduct,
        deleteProduct,
        reviews,
        addProductReview,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartPackagingTotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        themeMode,
        toggleThemeMode,
        themeConfig,
        updateThemeConfig,
        comparisonProductIds,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        browsingHistory,
        recordProductView,
        invoices,
        addBillingInvoice,
        orders,
        createOrder,
        updateOrderStatus,
        customOrders,
        createCustomOrderRequest,
        sendCustomOrderMessage,
        provideCustomOrderQuote,
        respondToQuote,
        coupleWebsites,
        createCoupleWebsite,
        updateCoupleWebsite,
        apiKeys,
        createApiKey,
        revokeApiKey,
        tickets,
        createTicket,
        replyToTicket,
        automations,
        toggleAutomation,
        policies,
        updatePolicy,
        currentUser,
        isUserLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openAuthModalWithAction,
        userLogin,
        userRegister,
        userGoogleLogin,
        userOtpLogin,
        userLogout,
        updateUser,
        redeemLoyaltyPoints,
        emailNotifications,
        addEmailNotification,
        selectedTrackingOrderId,
        setSelectedTrackingOrderId,
        supabaseStatus,
        syncDatabase,
        popupBanner,
        updatePopupBanner,
        isPopupBannerDismissed,
        dismissPopupBanner,
        billingPortal,
        updateBillingPortal,
        redirectToBillingPortal,
        youtubeVideos,
        socialLinks,
        addYouTubeVideo,
        deleteYouTubeVideo,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        isPolicyModalOpen,
        setIsPolicyModalOpen,
        activePolicySlug,
        setActivePolicySlug,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
