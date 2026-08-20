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
  CustomOrderStatus,
  CustomOrderTrackingEvent,
  CustomOrderMessage,
  CustomOrderAttachment,
  CustomOrderConversationStatus,
  CoupleWebsiteProject,
  CoupleWebsiteTemplate,
  BotPanelService,
  ApiKeyRecord,
  SupportTicket,
  DiscountCoupon,
  AutomationRule,
  SystemPolicy,
  PolicyRecord,
  PolicyVersion,
  PolicySection,
  CategoryType,
  PopupBannerConfig,
  BillingPortalConfig,
  YouTubeVideoItem,
  SocialLinksConfig,
  EmailNotification,
  AppNotification,
  NotificationType,
  NotificationCategory,
  SupabaseConfigStatus,
  BillingInvoice,
  ThemeConfig,
  ThemeRevision,
  PageRecord,
  PageRevision,
  PageSection,
  PageSectionType,
  PaymentMethodsConfig
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
  INITIAL_NOTIFICATIONS,
  INITIAL_BILLING_INVOICES,
  INITIAL_THEME_CONFIG,
  INITIAL_PAYMENT_METHODS_CONFIG
} from '../data/initialData';
import {
  triggerNotification,
  TriggerNotificationParams,
  fetchNotificationsFromSupabase,
  upsertNotificationInSupabase,
  markNotificationReadInSupabase,
  markAllNotificationsReadInSupabase,
  deleteNotificationFromSupabase
} from '../services/notificationService';
import {
  generateAccountCreatedEmail,
  generateOrderConfirmedEmail,
  generateShippingUpdateEmail,
  dispatchEmailNotification
} from '../services/emailService';
import {
  supabase,
  isSupabaseConfigured,
  checkSupabaseConnection,
  syncStoreWithSupabase,
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignInWithGoogle,
  supabaseSignOut,
  supabaseVerifyAdminRole,
  supabaseAdminSignIn,
  supabaseAdminSignOut
} from '../lib/supabase';
import {
  fetchProductsFromSupabase,
  upsertProductInSupabase,
  deleteProductInSupabase,
  updateInventoryInSupabase,
  fetchUserCartFromSupabase,
  syncCartToSupabase,
  clearCartInSupabase,
  fetchWishlistFromSupabase,
  addToWishlistInSupabase,
  removeFromWishlistInSupabase,
  clearWishlistInSupabase,
  fetchPackagingOptionsFromSupabase,
  fetchOrdersFromSupabase,
  insertOrderInSupabase,
  updateOrderStatusInSupabase,
  verifyAndCalculateOrderTotals,
  executeServerOrderCreation,
  processOrderRefundInSupabase,
  updateOrderLogisticsInSupabase,
  ServerPriceBreakdown,
  ServerOrderQuoteRequest,
  CreateOrderParams,
  fetchCustomOrdersFromSupabase,
  upsertCustomOrderInSupabase,
  uploadCustomOrderFileToSupabase,
  subscribeToCustomOrderRealtime,
  broadcastCustomOrderMessage,
  markCustomOrderMessagesAsReadInSupabase,
  assignCustomOrderStaffInSupabase,
  updateCustomOrderConversationStatusInSupabase,
  fetchCoupleWebsitesFromSupabase,
  upsertCoupleWebsiteInSupabase,
  deleteCoupleWebsiteFromSupabase,
  fetchCoupleTemplatesFromSupabase,
  upsertCoupleTemplateInSupabase,
  deleteCoupleTemplateFromSupabase,
  fetchReviewsFromSupabase,
  insertReviewInSupabase,
  updateReviewInSupabase,
  deleteReviewFromSupabase,
  toggleReviewHelpfulInSupabase,
  reportReviewInSupabase,
  fetchSupportTicketsFromSupabase,
  upsertSupportTicketInSupabase,
  fetchApiKeysFromSupabase,
  upsertApiKeyInSupabase,
  fetchInvoicesFromSupabase,
  insertInvoiceInSupabase,
  fetchThemeConfigFromSupabase,
  fetchThemeDraftFromSupabase,
  saveThemeDraftInSupabase,
  saveThemeConfigInSupabase,
  publishThemeConfigInSupabase,
  fetchThemeRevisionsFromSupabase,
  createThemeRevisionSnapshot,
  restoreThemeRevisionFromSupabase,
  deleteThemeRevisionFromSupabase,
  recordAuditLog,
  trackAnalyticsEvent,
  fetchAllPagesFromSupabase,
  createPageInSupabase,
  updatePageMetadataInSupabase,
  duplicatePageInSupabase,
  deletePageFromSupabase,
  fetchPageWithSectionsFromSupabase,
  savePageDraftInSupabase,
  publishPageInSupabase,
  fetchPageRevisionsFromSupabase,
  createPageRevisionInSupabase,
  deletePageSectionFromSupabase,
  fetchPoliciesFromSupabase,
  upsertPolicyInSupabase,
  createPolicyVersionInSupabase,
  approveAndPublishPolicyInSupabase
} from '../services/supabaseService';
import { Analytics } from '../services/analyticsService';
import {
  INITIAL_HOME_PAGE_RECORD,
  INITIAL_HOME_PAGE_SECTIONS,
  INITIAL_PAGES_LIST
} from '../data/defaultPageData';
import { normalizeThemeConfig } from '../utils/themeUtils';
import { useAuth } from './AuthContext';

export type CurrencyCode = 'INR';

export interface UserAddress {
  id?: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  addressType?: 'shipping' | 'billing';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  loyaltyTier?: string;
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
  adminLogin: (u: string, p: string) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => Promise<void>;

  // Currency & Localisation (Strictly INR)
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amount: number) => string;

  // Catalog, Inventory & Reviews
  products: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;
  refetchProducts: () => Promise<void>;
  updateProductInventory: (
    productId: string,
    variantId?: string,
    quantityChanged?: number,
    newInventoryCount?: number,
    changeType?: 'order_sale' | 'restock' | 'damaged' | 'adjustment' | 'return',
    referenceId?: string,
    notes?: string
  ) => Promise<boolean>;
  packagingOptions: PackagingOption[];
  botPanelServices: BotPanelService[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  bulkAddProducts: (productsList: Product[]) => Promise<{ success: boolean; count: number; error?: string }>;
  bulkDeleteProducts: (productIds: string[]) => Promise<{ success: boolean; count: number; error?: string }>;
  reviews: ProductReview[];
  addProductReview: (review: Partial<ProductReview>) => Promise<{ success: boolean; message: string; review?: ProductReview }>;
  updateProductReview: (reviewId: string, review: Partial<ProductReview>) => Promise<boolean>;
  deleteProductReview: (reviewId: string) => Promise<boolean>;
  toggleReviewHelpful: (reviewId: string) => Promise<boolean>;
  reportProductReview: (reviewId: string, reason: string, details?: string) => Promise<boolean>;
  moderateReview: (reviewId: string, action: 'approve' | 'reject' | 'hide' | 'feature' | 'delete', notes?: string) => Promise<boolean>;
  checkUserProductPurchase: (productId: string) => { hasPurchased: boolean; eligibleOrders: Order[]; existingReview?: ProductReview };

  // Cart
  cart: CartItem[];
  isLoadingCart: boolean;
  cartError: string | null;
  addToCart: (product: Product, quantity?: number, variantId?: string, packaging?: PackagingOption, personalization?: PersonalizationConfig, customPrice?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
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
  isLoadingWishlist: boolean;
  wishlistError: string | null;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;

  // Theme Mode (Dark / Light)
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;

  // Store Theme Branding, Drafts, Publishing & Snapshots (Supabase Backed)
  themeConfig: ThemeConfig;
  setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  themeDraft: ThemeConfig;
  setThemeDraft: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  themeRevisions: ThemeRevision[];
  isLoadingTheme: boolean;
  updateThemeDraft: (cfg: Partial<ThemeConfig>) => void;
  saveThemeDraft: (draft?: ThemeConfig) => Promise<{ success: boolean; error?: string }>;
  publishTheme: (config?: ThemeConfig, revisionName?: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  discardThemeChanges: () => Promise<void>;
  resetThemeToDefaults: () => void;
  createThemeSnapshot: (name: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  restoreThemeSnapshot: (revisionId: string) => Promise<{ success: boolean; error?: string }>;
  deleteThemeSnapshot: (revisionId: string) => Promise<boolean>;
  refetchThemeConfig: () => Promise<void>;
  updateThemeConfig: (cfg: Partial<ThemeConfig>) => void;

  // Product Comparison (Up to 3 items)
  comparisonProductIds: string[];
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;

  // Browsing History (Local recommendations)
  browsingHistory: string[];
  recordProductView: (productId: string) => void;

  // Invoices & Billing
  invoices: BillingInvoice[];
  addBillingInvoice: (invoice: BillingInvoice) => void;

  // Orders & Fulfillment
  orders: Order[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  refetchOrders: () => Promise<void>;
  calculateServerOrderQuote: (request: ServerOrderQuoteRequest) => Promise<ServerPriceBreakdown>;
  placeServerVerifiedOrder: (params: CreateOrderParams) => Promise<{ success: boolean; order?: Order; invoice?: BillingInvoice; error?: string }>;
  processOrderRefund: (orderId: string, amount: number, reason: string, restockInventory?: boolean) => Promise<{ success: boolean; error?: string }>;
  updateOrderLogistics: (orderId: string, carrier: string, trackingNumber: string, trackingUrl?: string, deliveryDate?: string, status?: Order['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], carrier?: string, trackingNumber?: string) => void;
  selectedTrackingOrderId: string;
  setSelectedTrackingOrderId: (id: string) => void;

  // Custom Bespoke Orders
  customOrders: CustomOrder[];
  createCustomOrderRequest: (req: Omit<CustomOrder, 'id' | 'requestNumber' | 'status' | 'messages' | 'createdAt' | 'updatedAt'>) => CustomOrder;
  sendCustomOrderMessage: (
    customOrderId: string,
    text: string,
    sender: 'customer' | 'admin',
    options?: {
      attachments?: string[];
      fileAttachments?: CustomOrderAttachment[];
      isAdminProof?: boolean;
      adminProofTitle?: string;
    }
  ) => Promise<void>;
  markCustomOrderMessagesAsRead: (customOrderId: string, readerRole: 'customer' | 'admin') => Promise<void>;
  assignCustomOrderStaff: (customOrderId: string, adminId: string, adminName: string, adminRole?: string) => Promise<void>;
  updateCustomOrderConversationStatus: (customOrderId: string, status: CustomOrderConversationStatus) => Promise<void>;
  provideCustomOrderQuote: (customOrderId: string, quote: Omit<CustomOrderQuote, 'id'>) => Promise<void>;
  respondToQuote: (customOrderId: string, accept: boolean, revisionReason?: string) => Promise<void>;
  updateCustomOrderStatus: (customOrderId: string, status: CustomOrderStatus, trackingDetails?: { carrier?: string; trackingNumber?: string; trackingUrl?: string; designProofUrl?: string; notes?: string }) => Promise<void>;
  uploadCustomOrderFile: (file: File, customOrderId?: string) => Promise<{ success: boolean; url: string; fileName: string; fileSize?: number; error?: string }>;
  subscribeToCustomOrder: (customOrderId: string, callback: (order: Partial<CustomOrder>) => void) => () => void;

  // Couple Websites & Templates
  coupleTemplates: CoupleWebsiteTemplate[];
  addCoupleTemplate: (template: Omit<CoupleWebsiteTemplate, 'id'>) => Promise<boolean>;
  updateCoupleTemplate: (template: CoupleWebsiteTemplate) => Promise<boolean>;
  deleteCoupleTemplate: (templateId: string) => Promise<boolean>;
  toggleCoupleTemplateActive: (templateId: string) => Promise<boolean>;
  coupleWebsites: CoupleWebsiteProject[];
  createCoupleWebsite: (projectData: Omit<CoupleWebsiteProject, 'id' | 'views' | 'createdAt' | 'expiresAt'>) => CoupleWebsiteProject;
  updateCoupleWebsite: (project: CoupleWebsiteProject) => Promise<boolean>;
  deleteCoupleWebsite: (projectId: string) => Promise<boolean>;
  publishCoupleWebsite: (projectId: string, isPublished: boolean) => Promise<boolean>;
  addGuestbookEntry: (projectId: string, author: string, message: string) => Promise<boolean>;
  likeCoupleWebsite: (projectId: string) => Promise<boolean>;
  activeLivePreviewSubdomain: string | null;
  setActiveLivePreviewSubdomain: (subdomain: string | null) => void;
  selectedEditingProject: CoupleWebsiteProject | null;
  setSelectedEditingProject: (project: CoupleWebsiteProject | null) => void;

  // API Keys & Developer Tokens
  apiKeys: ApiKeyRecord[];
  createApiKey: (name: string, permissions: string[], rateLimit?: number) => { record: ApiKeyRecord; secretKey: string };
  revokeApiKey: (id: string) => void;

  // Support & Tickets
  tickets: SupportTicket[];
  createTicket: (subject: string, category: SupportTicket['category'], initialMessage: string, customerName?: string, customerEmail?: string) => SupportTicket;
  replyToTicket: (ticketId: string, text: string, sender: 'customer' | 'support') => void;

  // Automations & Policies CMS
  automations: AutomationRule[];
  toggleAutomation: (id: string) => void;
  policies: PolicyRecord[];
  updatePolicy: (id: string, content: string, version: string) => void;
  updatePolicyRecord: (policy: PolicyRecord) => Promise<boolean>;
  draftPolicyVersion: (
    policyId: string,
    versionData: {
      version: string;
      title: string;
      content: string;
      sections?: PolicySection[];
      changeSummary: string;
      createdBy: string;
      isAiDrafted?: boolean;
    }
  ) => Promise<PolicyVersion | null>;
  approveAndPublishPolicy: (policyId: string, versionId: string, approvedBy?: string) => Promise<{ success: boolean; message: string }>;
  schedulePolicy: (policyId: string, scheduledAt: string) => Promise<boolean>;

  // User Accounts & Authentication
  currentUser: UserProfile | null;
  isUserLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModalWithAction: (callback?: () => void) => void;
  userLogin: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message: string }>;
  userRegister: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message: string }>;
  userGoogleLogin: () => Promise<void>;
  userOtpLogin: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  userLogout: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => void;
  addUserAddress: (address: UserAddress) => void;
  updateUserAddress: (index: number, address: Partial<UserAddress>) => void;
  deleteUserAddress: (index: number) => void;
  setDefaultUserAddress: (index: number) => void;
  redeemLoyaltyPoints: (points: number) => boolean;

  // In-App Notification Center & Transactional Dispatch (Supabase Synced)
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notification: AppNotification) => void;
  dispatchNotification: (params: TriggerNotificationParams) => Promise<AppNotification>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllReadNotifications: () => Promise<void>;

  // Email Notifications Center
  emailNotifications: EmailNotification[];
  addEmailNotification: (notification: EmailNotification) => void;

  // Supabase Status & Sync
  supabaseStatus: SupabaseConfigStatus;
  syncDatabase: () => Promise<void>;

  // Pop-up Banner System
  popupBanner: PopupBannerConfig;
  updatePopupBanner: (cfg: PopupBannerConfig) => void;
  isPopupBannerDismissed: boolean;
  dismissPopupBanner: () => void;

  // Billing Portal & Subscriptions
  billingPortal: BillingPortalConfig;
  updateBillingPortal: (cfg: BillingPortalConfig) => void;
  redirectToBillingPortal: (planId?: string) => void;

  // Content Showcases
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

  // Private Website Editor State & Methods (Supabase Backed)
  allPages: PageRecord[];
  fetchAllPagesList: () => Promise<PageRecord[]>;
  createPage: (pageData: Partial<PageRecord>) => Promise<{ success: boolean; page?: PageRecord; message: string }>;
  updatePageMetadata: (pageId: string, updates: Partial<PageRecord>) => Promise<{ success: boolean; message: string }>;
  duplicatePage: (sourcePageId: string, newTitle: string, newSlug: string) => Promise<{ success: boolean; newPage?: PageRecord; message: string }>;
  deletePage: (pageId: string) => Promise<{ success: boolean; message: string }>;
  activePageRecord: PageRecord;
  setActivePageRecord: React.Dispatch<React.SetStateAction<PageRecord>>;
  pageRevisions: PageRevision[];
  isLoadingPageConfig: boolean;
  savePageDraft: (page: PageRecord) => Promise<{ success: boolean; message: string }>;
  publishPage: (page: PageRecord) => Promise<{ success: boolean; message: string }>;
  fetchPageRevisionsList: (pageId: string) => Promise<PageRevision[]>;
  createPageRevisionSnapshot: (pageId: string, revisionName: string, pageData: PageRecord) => Promise<PageRevision | null>;
  restorePageRevisionSnapshot: (revision: PageRevision) => Promise<boolean>;
  deletePageSectionItem: (sectionId: string) => Promise<boolean>;
  updateActivePageRecord: (updater: (prev: PageRecord) => PageRecord) => void;
  refetchPageConfig: (slugOrId?: string) => Promise<void>;

  // Payment Gateways & Settlement Configuration
  paymentSettings: PaymentMethodsConfig;
  updatePaymentSettings: (config: Partial<PaymentMethodsConfig>) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authoritative Supabase Auth & RBAC session from AuthContext
  const {
    user: authUser,
    isAdmin: authIsAdmin,
    role: authRole,
    login: authLogin,
    adminLogin: authAdminLogin,
    register: authRegister,
    logout: authLogout,
    loginWithGoogle: authGoogleLogin,
    resetPassword: authResetPassword,
    updatePassword: authUpdatePassword
  } = useAuth();

  // Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Admin Mode & Auth State (Authoritatively derived from Supabase Auth & verified roles)
  const isAdminAuthenticated = authIsAdmin;
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Currency (Default to INR for India audience)
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Products & Packaging State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [packagingOptions, setPackagingOptions] = useState<PackagingOption[]>(INITIAL_PACKAGING_OPTIONS);
  const [coupleTemplates, setCoupleTemplates] = useState<CoupleWebsiteTemplate[]>(INITIAL_COUPLE_TEMPLATES);
  const [activeLivePreviewSubdomain, setActiveLivePreviewSubdomain] = useState<string | null>(null);
  const [selectedEditingProject, setSelectedEditingProject] = useState<CoupleWebsiteProject | null>(null);
  const [botPanelServices] = useState<BotPanelService[]>(INITIAL_BOT_PANEL_SERVICES);
  const [coupons] = useState<DiscountCoupon[]>(INITIAL_COUPONS);

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);

  const [wishlist, setWishlist] = useState<string[]>(['prod-couple-1', 'prod-couple-2']);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState<boolean>(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  // Private Website Visual Editor State (Supabase Backed)
  const [allPages, setAllPages] = useState<PageRecord[]>(INITIAL_PAGES_LIST);
  const [activePageRecord, setActivePageRecord] = useState<PageRecord>(INITIAL_HOME_PAGE_RECORD);
  const [pageRevisions, setPageRevisions] = useState<PageRevision[]>([]);
  const [isLoadingPageConfig, setIsLoadingPageConfig] = useState<boolean>(false);

  // Cart session identifier for guests or authenticated users
  const getCartSessionId = (userId?: string) => {
    if (userId) return `cart_user_${userId}`;
    let anonId = sessionStorage.getItem('hx_anon_cart_id');
    if (!anonId) {
      anonId = `cart_anon_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('hx_anon_cart_id', anonId);
    }
    return anonId;
  };

  // Dark / Light Theme Mode
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

  // Dynamic Theme Config, Drafts, Snapshots & Branding (Supabase Backed)
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => normalizeThemeConfig(INITIAL_THEME_CONFIG));
  const [themeDraft, setThemeDraft] = useState<ThemeConfig>(() => normalizeThemeConfig(INITIAL_THEME_CONFIG));
  const [themeRevisions, setThemeRevisions] = useState<ThemeRevision[]>([]);
  const [isLoadingTheme, setIsLoadingTheme] = useState<boolean>(false);

  // Apply CSS variables to root document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const norm = normalizeThemeConfig(themeConfig);
      root.style.setProperty('--theme-primary', norm.colors.primaryColor);
      root.style.setProperty('--theme-accent', norm.colors.accentColor);
      root.style.setProperty('--theme-secondary', norm.colors.secondaryColor);
      root.style.setProperty('--theme-bg', norm.colors.backgroundColor);
      root.style.setProperty('--theme-surface', norm.colors.surfaceColor);
      root.style.setProperty('--theme-border', norm.colors.borderColor);
      root.style.setProperty('--theme-text', norm.colors.textColor);
      root.style.setProperty('--theme-text-muted', norm.colors.textMutedColor);
    }
  }, [themeConfig]);

  // Immediate preview updater
  const updateThemeDraft = (cfg: Partial<ThemeConfig>) => {
    setThemeDraft(prev => normalizeThemeConfig({ ...prev, ...cfg }));
  };

  // Legacy backwards-compatible alias
  const updateThemeConfig = (cfg: Partial<ThemeConfig>) => {
    updateThemeDraft(cfg);
  };

  // Refetch theme config from Supabase
  const refetchThemeConfig = async () => {
    setIsLoadingTheme(true);
    try {
      const [pubConfig, draftConfig, revisions] = await Promise.all([
        fetchThemeConfigFromSupabase('published'),
        fetchThemeConfigFromSupabase('draft'),
        fetchThemeRevisionsFromSupabase()
      ]);

      if (pubConfig) setThemeConfig(normalizeThemeConfig(pubConfig));
      if (draftConfig) setThemeDraft(normalizeThemeConfig(draftConfig));
      else if (pubConfig) setThemeDraft(normalizeThemeConfig(pubConfig));
      if (revisions) setThemeRevisions(revisions);
    } catch (err) {
      console.error('Error refreshing theme config from Supabase:', err);
    } finally {
      setIsLoadingTheme(false);
    }
  };

  // Save draft to database (Never display "saved" if operation fails!)
  const saveThemeDraft = async (draftToSave?: ThemeConfig): Promise<{ success: boolean; error?: string }> => {
    setIsLoadingTheme(true);
    try {
      const targetDraft = normalizeThemeConfig(draftToSave || themeDraft);
      const res = await saveThemeDraftInSupabase(targetDraft);
      if (!res.success) {
        showToast(`Save failed: ${res.error || 'Could not write to Supabase'}`);
        return { success: false, error: res.error || 'Database write error' };
      }
      setThemeDraft(targetDraft);
      showToast('Theme draft saved to database.');
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Database connection error';
      showToast(`Save failed: ${errMsg}`);
      return { success: false, error: errMsg };
    } finally {
      setIsLoadingTheme(false);
    }
  };

  // Publish theme to database (Updates storefront & creates snapshot)
  const publishTheme = async (
    configToPublish?: ThemeConfig,
    revisionName?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoadingTheme(true);
    try {
      const targetConfig = normalizeThemeConfig(configToPublish || themeDraft);
      const res = await publishThemeConfigInSupabase(targetConfig, revisionName, notes);
      if (!res.success) {
        showToast(`Publish failed: ${res.error || 'Database operation failed'}`);
        return { success: false, error: res.error || 'Publish failed' };
      }
      setThemeConfig(targetConfig);
      setThemeDraft(targetConfig);
      
      // Refresh revisions list
      const revs = await fetchThemeRevisionsFromSupabase();
      setThemeRevisions(revs);

      showToast('Theme published live to HARCONXS storefront!');
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Publication error';
      showToast(`Publish failed: ${errMsg}`);
      return { success: false, error: errMsg };
    } finally {
      setIsLoadingTheme(false);
    }
  };

  // Discard draft changes and reload published version from database
  const discardThemeChanges = async (): Promise<void> => {
    setIsLoadingTheme(true);
    try {
      const pubConfig = await fetchThemeConfigFromSupabase('published');
      const base = pubConfig ? normalizeThemeConfig(pubConfig) : normalizeThemeConfig(themeConfig);
      setThemeDraft(base);
      showToast('Draft changes discarded. Reverted to published version.');
    } catch {
      setThemeDraft(normalizeThemeConfig(themeConfig));
      showToast('Reverted to current published theme.');
    } finally {
      setIsLoadingTheme(false);
    }
  };

  // Reset theme to factory atelier defaults
  const resetThemeToDefaults = () => {
    const factoryDefaults = normalizeThemeConfig(INITIAL_THEME_CONFIG);
    setThemeDraft(factoryDefaults);
    showToast('Theme reset to atelier factory defaults. Click "Save Draft" or "Publish" to persist.');
  };

  // Create manual revision snapshot
  const createThemeSnapshot = async (name: string, notes?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoadingTheme(true);
    try {
      const res = await createThemeRevisionSnapshot(themeDraft, name, notes);
      if (!res.success) {
        showToast(`Snapshot error: ${res.error || 'Database error'}`);
        return { success: false, error: res.error };
      }
      const revs = await fetchThemeRevisionsFromSupabase();
      setThemeRevisions(revs);
      showToast(`Revision snapshot "${name}" saved to database.`);
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Snapshot error';
      showToast(`Snapshot error: ${errMsg}`);
      return { success: false, error: errMsg };
    } finally {
      setIsLoadingTheme(false);
    }
  };

  // Restore revision snapshot
  const restoreThemeSnapshot = async (revisionId: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoadingTheme(true);
    try {
      const res = await restoreThemeRevisionFromSupabase(revisionId);
      if (!res.success || !res.config) {
        showToast(`Restore error: ${res.error || 'Could not load snapshot'}`);
        return { success: false, error: res.error };
      }
      setThemeDraft(normalizeThemeConfig(res.config));
      showToast('Revision snapshot restored into active editor draft.');
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to restore revision';
      showToast(`Restore error: ${errMsg}`);
      return { success: false, error: errMsg };
    } finally {
      setIsLoadingTheme(false);
    }
  };

  // Delete revision snapshot
  const deleteThemeSnapshot = async (revisionId: string): Promise<boolean> => {
    const ok = await deleteThemeRevisionFromSupabase(revisionId);
    if (ok) {
      setThemeRevisions(prev => prev.filter(r => r.id !== revisionId));
      showToast('Revision snapshot removed from database.');
    } else {
      showToast('Failed to delete snapshot.');
    }
    return ok;
  };

  // Side-by-Side Product Comparison (up to 3 products)
  const [comparisonProductIds, setComparisonProductIds] = useState<string[]>([]);

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
  const [browsingHistory, setBrowsingHistory] = useState<string[]>(['prod-couple-1', 'prod-couple-2', 'prod-men-1']);

  const recordProductView = (productId: string) => {
    setBrowsingHistory(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);

  // Invoices & Billing State
  const [invoices, setInvoices] = useState<BillingInvoice[]>(INITIAL_BILLING_INVOICES);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Custom Orders State
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(INITIAL_SAMPLE_CUSTOM_ORDERS);

  // Couple Websites State
  const [coupleWebsites, setCoupleWebsites] = useState<CoupleWebsiteProject[]>(INITIAL_SAMPLE_COUPLE_WEBSITES);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(INITIAL_API_KEYS);

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);

  // Automations & Policies
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [policies, setPolicies] = useState<SystemPolicy[]>(INITIAL_SYSTEM_POLICIES);

  // Email Notifications State
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>(INITIAL_EMAIL_NOTIFICATIONS);

  // In-App Notifications State (Supabase Persisted)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>('ord-1001');

  // Supabase Status State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConfigStatus>({
    isConnected: true,
    url: isSupabaseConfigured ? (import.meta.env.VITE_SUPABASE_URL || 'https://v6ky2ym2gn3s6b7y2opdtl.supabase.co') : 'https://v6ky2ym2gn3s6b7y2opdtl.supabase.co (Active Relay)',
    isCustomUrl: isSupabaseConfigured,
    lastSyncedAt: new Date().toISOString(),
    tableCounts: {
      orders: INITIAL_SAMPLE_ORDERS.length,
      products: INITIAL_PRODUCTS.length,
      customOrders: INITIAL_SAMPLE_CUSTOM_ORDERS.length,
      coupleWebsites: INITIAL_SAMPLE_COUPLE_WEBSITES.length,
      emailLogs: INITIAL_EMAIL_NOTIFICATIONS.length
    }
  });

  // User Profile & Authentication State (Synced with authoritative Supabase Auth)
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({});

  const currentUser: UserProfile | null = authUser ? {
    id: authUser.id,
    name: profileData.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Member',
    email: authUser.email || '',
    phone: profileData.phone || authUser.user_metadata?.phone || '',
    loyaltyPoints: profileData.loyaltyPoints ?? 150,
    storeCredit: profileData.storeCredit ?? 0,
    isAffiliate: profileData.isAffiliate ?? false,
    affiliateCode: profileData.affiliateCode || `HX${authUser.id.substring(0, 4).toUpperCase()}`,
    affiliateCommissionEarned: profileData.affiliateCommissionEarned ?? 0,
    addresses: profileData.addresses || []
  } : null;

  const isUserLoggedIn = !!authUser;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthCallback, setPendingAuthCallback] = useState<(() => void) | null>(null);

  // Pop-up Banner State
  const [popupBanner, setPopupBanner] = useState<PopupBannerConfig>(INITIAL_POPUP_BANNER);
  const [isPopupBannerDismissed, setIsPopupBannerDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('hx_popup_dismissed') === 'true';
  });

  // Billing Portal State
  const [billingPortal, setBillingPortal] = useState<BillingPortalConfig>(INITIAL_BILLING_PORTAL);

  // YouTube Videos & Social Links
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoItem[]>(INITIAL_YOUTUBE_VIDEOS);
  const [socialLinks] = useState<SocialLinksConfig>(INITIAL_SOCIAL_LINKS);

  // Payment Gateways & Methods Config
  const [paymentSettings, setPaymentSettings] = useState<PaymentMethodsConfig>(() => {
    try {
      const saved = localStorage.getItem('hx_payment_methods_config');
      if (saved) {
        return { ...INITIAL_PAYMENT_METHODS_CONFIG, ...JSON.parse(saved) };
      }
    } catch {}
    return INITIAL_PAYMENT_METHODS_CONFIG;
  });

  const updatePaymentSettings = async (partialConfig: Partial<PaymentMethodsConfig>): Promise<boolean> => {
    try {
      const merged: PaymentMethodsConfig = {
        ...paymentSettings,
        ...partialConfig,
        updatedAt: new Date().toISOString()
      };
      setPaymentSettings(merged);
      localStorage.setItem('hx_payment_methods_config', JSON.stringify(merged));

      // Attempt to sync to Supabase settings table if accessible
      if (isSupabaseConfigured) {
        try {
          await supabase.from('settings').upsert({
            key: 'payment_methods_config',
            value: merged,
            updated_at: new Date().toISOString()
          });
        } catch {}
      }

      showToast('Payment gateways & settlement configuration saved.');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update payment settings.');
      return false;
    }
  };

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

  // INITIAL SUPABASE DATABASE HYDRATION ON MOUNT
  useEffect(() => {
    let isMounted = true;

    async function loadSupabaseInitialData() {
      setIsLoadingProducts(true);
      setProductsError(null);
      try {
        const [
          dbProducts,
          dbOrders,
          dbCustomOrders,
          dbCoupleWebsites,
          dbCoupleTemplates,
          dbReviews,
          dbTickets,
          dbApiKeys,
          dbInvoices,
          dbThemeConfig,
          dbThemeDraft,
          dbThemeRevisions,
          dbPackaging,
          dbPageRecord,
          dbRevisions,
          dbPolicies
        ] = await Promise.allSettled([
          fetchProductsFromSupabase(),
          fetchOrdersFromSupabase(),
          fetchCustomOrdersFromSupabase(),
          fetchCoupleWebsitesFromSupabase(),
          fetchCoupleTemplatesFromSupabase(),
          fetchReviewsFromSupabase(),
          fetchSupportTicketsFromSupabase(),
          fetchApiKeysFromSupabase(),
          fetchInvoicesFromSupabase(),
          fetchThemeConfigFromSupabase('published'),
          fetchThemeDraftFromSupabase(),
          fetchThemeRevisionsFromSupabase(),
          fetchPackagingOptionsFromSupabase(),
          fetchPageWithSectionsFromSupabase('home'),
          fetchPageRevisionsFromSupabase('page_home'),
          fetchPoliciesFromSupabase()
        ]);

        if (!isMounted) return;

        if (dbProducts.status === 'fulfilled' && dbProducts.value && dbProducts.value.length > 0) {
          setProducts(dbProducts.value);
        }
        if (dbPolicies.status === 'fulfilled' && dbPolicies.value && dbPolicies.value.length > 0) {
          setPolicies(dbPolicies.value);
        }
        if (dbPackaging.status === 'fulfilled' && dbPackaging.value && dbPackaging.value.length > 0) {
          setPackagingOptions(dbPackaging.value);
        }
        if (dbOrders.status === 'fulfilled' && dbOrders.value && dbOrders.value.length > 0) {
          setOrders(dbOrders.value);
        }
        if (dbCustomOrders.status === 'fulfilled' && dbCustomOrders.value && dbCustomOrders.value.length > 0) {
          setCustomOrders(dbCustomOrders.value);
        }
        if (dbCoupleWebsites.status === 'fulfilled' && dbCoupleWebsites.value && dbCoupleWebsites.value.length > 0) {
          setCoupleWebsites(dbCoupleWebsites.value);
        }
        if (dbCoupleTemplates.status === 'fulfilled' && dbCoupleTemplates.value && dbCoupleTemplates.value.length > 0) {
          setCoupleTemplates(dbCoupleTemplates.value);
        }
        if (dbReviews.status === 'fulfilled' && dbReviews.value && dbReviews.value.length > 0) {
          setReviews(dbReviews.value);
        }
        if (dbTickets.status === 'fulfilled' && dbTickets.value && dbTickets.value.length > 0) {
          setTickets(dbTickets.value);
        }
        if (dbApiKeys.status === 'fulfilled' && dbApiKeys.value && dbApiKeys.value.length > 0) {
          setApiKeys(dbApiKeys.value);
        }
        if (dbInvoices.status === 'fulfilled' && dbInvoices.value && dbInvoices.value.length > 0) {
          setInvoices(dbInvoices.value);
        }
        if (dbThemeConfig.status === 'fulfilled' && dbThemeConfig.value) {
          const normPub = normalizeThemeConfig(dbThemeConfig.value);
          setThemeConfig(normPub);
          setThemeDraft(normPub);
        }
        if (dbThemeDraft.status === 'fulfilled' && dbThemeDraft.value) {
          setThemeDraft(normalizeThemeConfig(dbThemeDraft.value));
        }
        if (dbThemeRevisions.status === 'fulfilled' && dbThemeRevisions.value) {
          setThemeRevisions(dbThemeRevisions.value);
        }
        if (dbPageRecord.status === 'fulfilled' && dbPageRecord.value && dbPageRecord.value.sections && dbPageRecord.value.sections.length > 0) {
          setActivePageRecord(dbPageRecord.value);
        }
        if (dbRevisions.status === 'fulfilled' && dbRevisions.value) {
          setPageRevisions(dbRevisions.value);
        }

        // Check health
        const health = await checkSupabaseConnection();
        setSupabaseStatus(prev => ({
          ...prev,
          isConnected: health.connected,
          lastSyncedAt: new Date().toISOString()
        }));
      } catch (err: any) {
        setProductsError(err?.message || 'Could not load store data from Supabase.');
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    }

    loadSupabaseInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync user profile data and cart/wishlist whenever authoritative authUser changes
  useEffect(() => {
    let isMounted = true;

    if (authUser) {
      if (authIsAdmin) {
        setIsAdminMode(true);
      }

      // Fetch user profile from Supabase profiles table
      supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()
        .then(({ data }) => {
          if (isMounted && data) {
            setProfileData({
              name: data.full_name || authUser.user_metadata?.full_name,
              phone: data.phone || authUser.user_metadata?.phone,
              loyaltyPoints: data.loyalty_points ?? 150,
              storeCredit: data.store_credit ?? 0,
              isAffiliate: data.is_affiliate ?? false,
              affiliateCode: data.affiliate_code,
              affiliateCommissionEarned: data.affiliate_commission_earned ?? 0,
              addresses: (data.addresses as any) || []
            });
          }
        });

      // Fetch user's wishlist and cart from Supabase
      setIsLoadingWishlist(true);
      Promise.allSettled([
        fetchWishlistFromSupabase(authUser.id),
        fetchUserCartFromSupabase(`cart_user_${authUser.id}`)
      ]).then(([userWishlist, userCart]) => {
        if (!isMounted) return;
        if (userWishlist.status === 'fulfilled' && userWishlist.value && userWishlist.value.length > 0) {
          setWishlist(userWishlist.value);
        }
        if (userCart.status === 'fulfilled' && userCart.value && userCart.value.length > 0) {
          setCart(userCart.value);
        }
      }).finally(() => {
        if (isMounted) setIsLoadingWishlist(false);
      });
    } else {
      setProfileData({});
      setIsAdminMode(false);
    }

    return () => {
      isMounted = false;
    };
  }, [authUser, authIsAdmin]);

  const addEmailNotification = (notification: EmailNotification) => {
    setEmailNotifications(prev => [notification, ...prev]);
    dispatchEmailNotification(notification);
  };

  const syncDatabase = async () => {
    showToast('Synchronizing all Atelier catalog & order records with Supabase...');
    const result = await syncStoreWithSupabase({
      orders,
      products,
      customOrders,
      emailLogs: emailNotifications,
      reviews,
      invoices
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

  // ADMIN AUTHENTICATION (DELEGATED TO USEAUTH)
  const adminLogin = async (identifier: string, p: string) => {
    const res = await authAdminLogin(identifier, p);
    if (res.success) {
      setIsAdminMode(true);
      setIsAdminLoginModalOpen(false);
      setCurrentView('admin');
      recordAuditLog(identifier, 'admin_login', 'admin_session');
      showToast('Admin Atelier Console unlocked with verified Supabase credentials.');
      return { success: true, message: 'Authentication successful.' };
    }
    return { success: false, message: res.message || 'Admin authentication failed.' };
  };

  const adminLogout = async () => {
    await authLogout();
    setIsAdminMode(false);
    setCurrentView('home');
    showToast('Admin logged out securely.');
  };

  // USER AUTHENTICATION (DELEGATED TO USEAUTH)
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

  const userLogin = async (emailOrPhone: string, password?: string) => {
    const res = await authLogin(emailOrPhone, password || '');
    if (res.success) {
      setIsAuthModalOpen(false);
      showToast(`Welcome back!`);
      executePendingAuth();
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const userRegister = async (name: string, email: string, phone: string, password?: string) => {
    const res = await authRegister(email, password || '', { full_name: name, phone });
    if (res.success) {
      setIsAuthModalOpen(false);
      showToast(`Account created! Please check your email for verification.`);
      executePendingAuth();

      // Trigger Account Created In-App Notification & Server Email
      dispatchNotification({
        type: 'ACCOUNT_CREATED',
        recipientEmail: email.trim(),
        recipientName: name.trim(),
        userId: authUser?.id || '',
        data: { loyaltyPoints: 150 },
        priority: 'high'
      });

      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const userGoogleLogin = async () => {
    await authGoogleLogin();
  };

  const userOtpLogin = async (phone: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.trim(),
        token: otp.trim(),
        type: 'sms'
      });
      if (error || !data.user) {
        return { success: false, message: error?.message || 'Invalid verification OTP.' };
      }

      setIsAuthModalOpen(false);
      showToast('Mobile verified successfully. Welcome!');
      executePendingAuth();
      return { success: true, message: 'OTP verified successfully.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'OTP verification failed.' };
    }
  };

  const userLogout = async () => {
    await authLogout();
    setIsAdminMode(false);
    showToast('Signed out of your account.');
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setProfileData(prev => ({ ...prev, ...data }));
    if (authUser) {
      supabase.from('profiles').update({
        full_name: data.name,
        phone: data.phone,
        updated_at: new Date().toISOString()
      }).eq('id', authUser.id).then(() => {});
    }
    showToast('Profile updated.');
  };

  const addUserAddress = (newAddress: UserAddress) => {
    const addressWithId = {
      ...newAddress,
      id: newAddress.id || `addr-${Date.now()}`
    };
    const currentAddrs = currentUser?.addresses || [];
    const isFirst = currentAddrs.length === 0;
    const updatedAddresses = isFirst || addressWithId.isDefault
      ? [
          { ...addressWithId, isDefault: true },
          ...currentAddrs.map(a => ({ ...a, isDefault: false }))
        ]
      : [...currentAddrs, addressWithId];

    setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
    if (authUser) {
      supabase.from('profiles').update({
        addresses: updatedAddresses,
        updated_at: new Date().toISOString()
      }).eq('id', authUser.id).then(() => {});
    }
    showToast('Address added to your address book.');
  };

  const updateUserAddress = (index: number, updatedFields: Partial<UserAddress>) => {
    if (!currentUser || !currentUser.addresses[index]) return;
    const isSettingDefault = updatedFields.isDefault === true;
    const updatedAddresses = currentUser.addresses.map((addr, idx) => {
      if (idx === index) {
        return { ...addr, ...updatedFields };
      }
      if (isSettingDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
    if (authUser) {
      supabase.from('profiles').update({
        addresses: updatedAddresses,
        updated_at: new Date().toISOString()
      }).eq('id', authUser.id).then(() => {});
    }
    showToast('Address updated.');
  };

  const deleteUserAddress = (index: number) => {
    if (!currentUser || !currentUser.addresses[index]) return;
    const wasDefault = currentUser.addresses[index].isDefault;
    const updatedAddresses = currentUser.addresses.filter((_, idx) => idx !== index);
    if (wasDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
    if (authUser) {
      supabase.from('profiles').update({
        addresses: updatedAddresses,
        updated_at: new Date().toISOString()
      }).eq('id', authUser.id).then(() => {});
    }
    showToast('Address removed from address book.');
  };

  const setDefaultUserAddress = (index: number) => {
    if (!currentUser || !currentUser.addresses[index]) return;
    const updatedAddresses = currentUser.addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index
    }));

    setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
    if (authUser) {
      supabase.from('profiles').update({
        addresses: updatedAddresses,
        updated_at: new Date().toISOString()
      }).eq('id', authUser.id).then(() => {});
    }
    showToast('Default shipping address updated.');
  };

  const redeemLoyaltyPoints = (pointsToRedeem: number): boolean => {
    if (!currentUser || currentUser.loyaltyPoints < pointsToRedeem) {
      showToast('Insufficient loyalty points balance.');
      return false;
    }
    const creditEarned = Math.floor(pointsToRedeem / 10);
    const newPoints = currentUser.loyaltyPoints - pointsToRedeem;
    const newCredit = (currentUser.storeCredit || 0) + creditEarned;

    setProfileData(prev => ({
      ...prev,
      loyaltyPoints: newPoints,
      storeCredit: newCredit
    }));

    if (authUser) {
      supabase.from('profiles').update({
        loyalty_points: newPoints,
        store_credit: newCredit,
        updated_at: new Date().toISOString()
      }).eq('id', authUser.id).then(() => {});
    }

    showToast(`Redeemed ${pointsToRedeem} points for ₹${creditEarned * 86.5} store credit!`);
    return true;
  };

  // POP-UP BANNER
  const dismissPopupBanner = () => {
    setIsPopupBannerDismissed(true);
    sessionStorage.setItem('hx_popup_dismissed', 'true');
  };

  const updatePopupBanner = (cfg: PopupBannerConfig) => {
    setPopupBanner(cfg);
    showToast('Pop-up banner settings saved.');
  };

  // BILLING PORTAL
  const updateBillingPortal = (cfg: BillingPortalConfig) => {
    setBillingPortal(cfg);
    showToast('Billing portal settings updated.');
  };

  const redirectToBillingPortal = (planId?: string) => {
    const url = `${billingPortal.portalUrl}${planId ? `?plan=${planId}&ref=harconxs_shop` : ''}`;
    Analytics.trackBillingRedirect({
      serviceName: 'Private Billing Platform',
      plan: planId || 'standard',
      billingUrl: billingPortal.portalUrl,
      source: 'storefront_redirect'
    });
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

  // Catalog Refetching & Inventory
  const refetchProducts = async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const dbProducts = await fetchProductsFromSupabase();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }
    } catch (err: any) {
      setProductsError(err?.message || 'Failed to refresh product catalog.');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const updateProductInventory = async (
    productId: string,
    variantId?: string,
    quantityChanged?: number,
    newInventoryCount?: number,
    changeType: 'order_sale' | 'restock' | 'damaged' | 'adjustment' | 'return' = 'adjustment',
    referenceId?: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      const isSuccess = await updateInventoryInSupabase(
        productId,
        variantId,
        quantityChanged,
        newInventoryCount,
        changeType,
        referenceId,
        notes
      );
      if (isSuccess) {
        setProducts(prev => prev.map(p => {
          if (p.id === productId) {
            if (variantId && p.variants) {
              const updatedVariants = p.variants.map(v => {
                if (v.id === variantId) {
                  const updatedQty = newInventoryCount !== undefined ? newInventoryCount : Math.max(0, v.inventory + (quantityChanged || 0));
                  return { ...v, inventory: updatedQty };
                }
                return v;
              });
              const totalStock = updatedVariants.reduce((sum, v) => sum + v.inventory, 0);
              return { ...p, variants: updatedVariants, inventory: totalStock };
            } else {
              const updatedQty = newInventoryCount !== undefined ? newInventoryCount : Math.max(0, p.inventory + (quantityChanged || 0));
              return { ...p, inventory: updatedQty };
            }
          }
          return p;
        }));
        showToast('Inventory updated in database.');
        return true;
      } else {
        showToast('Failed to update inventory in database.');
        return false;
      }
    } catch (err: any) {
      showToast(`Inventory error: ${err?.message || 'Failed to update'}`);
      return false;
    }
  };

  // Cart operations with Supabase Sync
  const addToCart = async (
    product: Product,
    quantity = 1,
    variantId?: string,
    packaging?: PackagingOption,
    personalization?: PersonalizationConfig,
    customPrice?: number
  ) => {
    const selectedVariant = variantId ? product.variants?.find(v => v.id === variantId) : undefined;
    const itemId = `${product.id}-${variantId || 'default'}-${packaging?.id || 'none'}-${personalization?.names || 'plain'}`;

    let updatedCart: CartItem[] = [];
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        updatedCart = prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        updatedCart = [...prev, {
          id: itemId,
          product,
          variant: selectedVariant,
          quantity,
          packaging,
          personalization,
          customPrice
        }];
      }
      return updatedCart;
    });

    Analytics.trackAddToCart({
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: customPrice || (selectedVariant ? selectedVariant.price : product.price),
      quantity,
      variantId,
      hasPackaging: Boolean(packaging),
      isPersonalized: Boolean(personalization)
    });
    trackAnalyticsEvent('add_to_cart', { productId: product.id, name: product.name, quantity });
    showToast(`Added "${product.name}" to bag.`);
    setIsCartOpen(true);

    const cartId = getCartSessionId(currentUser?.id);
    setIsLoadingCart(true);
    setCartError(null);
    try {
      await syncCartToSupabase(cartId, updatedCart, appliedCoupon?.code);
    } catch (err: any) {
      setCartError(err?.message || 'Database sync pending');
    } finally {
      setIsLoadingCart(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    const targetItem = cart.find(i => i.id === itemId);
    if (targetItem) {
      Analytics.trackRemoveFromCart({
        productId: targetItem.product.id,
        productName: targetItem.product.name,
        price: targetItem.customPrice || (targetItem.variant ? targetItem.variant.price : targetItem.product.price),
        quantity: targetItem.quantity
      });
    }

    let updatedCart: CartItem[] = [];
    setCart(prev => {
      updatedCart = prev.filter(i => i.id !== itemId);
      return updatedCart;
    });

    const cartId = getCartSessionId(currentUser?.id);
    try {
      await syncCartToSupabase(cartId, updatedCart, appliedCoupon?.code);
    } catch (err: any) {
      setCartError(err?.message || 'Error syncing bag update.');
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    let updatedCart: CartItem[] = [];
    setCart(prev => {
      updatedCart = prev.map(i => i.id === itemId ? { ...i, quantity } : i);
      return updatedCart;
    });

    const cartId = getCartSessionId(currentUser?.id);
    try {
      await syncCartToSupabase(cartId, updatedCart, appliedCoupon?.code);
    } catch (err: any) {
      setCartError(err?.message || 'Error syncing bag update.');
    }
  };

  const clearCart = async () => {
    setCart([]);
    setAppliedCoupon(null);
    const cartId = getCartSessionId(currentUser?.id);
    try {
      await clearCartInSupabase(cartId);
    } catch {
      // Cleared locally
    }
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

  const isFreeShipping = (cartSubtotal >= 50) || (appliedCoupon?.type === 'free_shipping');
  const cartShipping = (cart.length > 0 && !isFreeShipping) ? 4.99 : 0;
  const cartTax = (cartSubtotal - cartDiscount) * 0.05;
  const cartTotal = Math.max(0, cartSubtotal + cartPackagingTotal - cartDiscount + cartShipping + cartTax);

  // Wishlist operations with Supabase Sync
  const toggleWishlist = async (productId: string) => {
    const exists = wishlist.includes(productId);
    const updated = exists ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    setWishlist(updated);
    showToast(exists ? 'Removed from wishlist.' : 'Saved to wishlist.');

    if (currentUser?.id) {
      setIsLoadingWishlist(true);
      setWishlistError(null);
      try {
        if (exists) {
          await removeFromWishlistInSupabase(currentUser.id, productId);
        } else {
          await addToWishlistInSupabase(currentUser.id, productId);
        }
      } catch (err: any) {
        setWishlistError(err?.message || 'Failed to sync wishlist to Supabase.');
      } finally {
        setIsLoadingWishlist(false);
      }
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = async () => {
    setWishlist([]);
    showToast('Wishlist cleared.');
    if (currentUser?.id) {
      try {
        await clearWishlistInSupabase(currentUser.id);
      } catch {
        // Handled
      }
    }
  };

  // Helper: Check if user has purchased a product and get review status
  const checkUserProductPurchase = (productId: string): { hasPurchased: boolean; eligibleOrders: Order[]; existingReview?: ProductReview } => {
    // 1. Look for matching orders for this user by userId or email
    const eligibleOrders = orders.filter(o => {
      const isUserOrder = (currentUser?.id && (o.customerId === currentUser.id || o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase())) ||
        (currentUser?.email && o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase());
      
      const containsProduct = o.items.some(item => item.product.id === productId);
      const isPaidOrFulfilled = ['Paid', 'Processing', 'Production', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(o.status);

      return isUserOrder && containsProduct && isPaidOrFulfilled;
    });

    const hasPurchased = eligibleOrders.length > 0;

    // Check if the user already submitted a review for this product
    const existingReview = reviews.find(r => 
      r.productId === productId && 
      ((currentUser?.id && r.userId === currentUser.id) || (currentUser?.email && r.userEmail?.toLowerCase() === currentUser.email.toLowerCase()))
    );

    return {
      hasPurchased,
      eligibleOrders,
      existingReview
    };
  };

  // Product Reviews: Add Verified Review
  const addProductReview = async (
    reviewData: Partial<ProductReview>
  ): Promise<{ success: boolean; message: string; review?: ProductReview }> => {
    if (!reviewData.productId) {
      return { success: false, message: 'Product ID is missing.' };
    }

    const productId = reviewData.productId;
    const { hasPurchased, eligibleOrders, existingReview } = checkUserProductPurchase(productId);

    // If user has already reviewed this product, prevent duplicate unless editing
    if (existingReview) {
      return {
        success: false,
        message: 'You have already submitted a review for this product. You can edit your existing review.',
        review: existingReview
      };
    }

    // Purchase Verification Check
    const isVerifiedPurchase = hasPurchased || reviewData.verifiedPurchase === true || reviewData.verified === true;

    const matchedOrderId = reviewData.orderId || (eligibleOrders.length > 0 ? eligibleOrders[0].id : undefined);
    const userId = currentUser?.id || `user-anon-${Math.random().toString(36).substring(2, 8)}`;
    const userName = reviewData.userName?.trim() || currentUser?.name || 'Verified Buyer';
    const userEmail = currentUser?.email || reviewData.userEmail;

    const newReview: ProductReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId,
      orderId: matchedOrderId,
      orderItemId: reviewData.orderItemId,
      userId,
      userName,
      userEmail,
      userAvatar: currentUser?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=18181b&color=f59e0b` : undefined,
      rating: Math.min(5, Math.max(1, reviewData.rating || 5)),
      title: reviewData.title?.trim() || 'Verified Experience',
      comment: reviewData.comment?.trim() || reviewData.review?.trim() || '',
      review: reviewData.comment?.trim() || reviewData.review?.trim() || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: isVerifiedPurchase,
      verifiedPurchase: isVerifiedPurchase,
      likes: 0,
      helpfulVotes: 0,
      helpfulUserIds: [],
      images: reviewData.images || reviewData.customerImages || [],
      customerImages: reviewData.images || reviewData.customerImages || [],
      status: 'approved',
      isFeatured: false,
      reported: false,
      reportCount: 0
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average rating & review count for the product
    const approvedProductReviews = updatedReviews.filter(r => r.productId === productId && r.status === 'approved');
    const avgRating = Number((approvedProductReviews.reduce((sum, r) => sum + r.rating, 0) / (approvedProductReviews.length || 1)).toFixed(1));
    
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const updatedProd = {
            ...p,
            rating: avgRating,
            reviewCount: approvedProductReviews.length
          };
          upsertProductInSupabase(updatedProd);
          return updatedProd;
        }
        return p;
      })
    );

    // Persist to Supabase with RLS
    await insertReviewInSupabase(newReview);
    showToast('✨ Thank you! Your verified product review is published.');
    return { success: true, message: 'Review successfully submitted.', review: newReview };
  };

  // Product Reviews: Edit / Update Existing Review
  const updateProductReview = async (
    reviewId: string,
    updates: Partial<ProductReview>
  ): Promise<boolean> => {
    const existing = reviews.find(r => r.id === reviewId);
    if (!existing) {
      showToast('Review not found.');
      return false;
    }

    // Security check: Only author or admin can edit
    const isAuthor = currentUser?.id && existing.userId === currentUser.id;
    if (!isAuthor && !isAdminAuthenticated) {
      showToast('Access denied: You can only edit your own reviews.');
      return false;
    }

    const updatedReview: ProductReview = {
      ...existing,
      rating: updates.rating !== undefined ? Math.min(5, Math.max(1, updates.rating)) : existing.rating,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      comment: updates.comment !== undefined ? updates.comment.trim() : existing.comment,
      review: updates.comment !== undefined ? updates.comment.trim() : existing.comment,
      images: updates.images !== undefined ? updates.images : (updates.customerImages || existing.images),
      customerImages: updates.images !== undefined ? updates.images : (updates.customerImages || existing.images),
      updatedAt: new Date().toISOString()
    };

    const updatedReviews = reviews.map(r => r.id === reviewId ? updatedReview : r);
    setReviews(updatedReviews);

    // Recalculate product rating
    const approvedProductReviews = updatedReviews.filter(r => r.productId === existing.productId && r.status === 'approved');
    const avgRating = Number((approvedProductReviews.reduce((sum, r) => sum + r.rating, 0) / (approvedProductReviews.length || 1)).toFixed(1));

    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === existing.productId) {
          const updatedProd = {
            ...p,
            rating: avgRating,
            reviewCount: approvedProductReviews.length
          };
          upsertProductInSupabase(updatedProd);
          return updatedProd;
        }
        return p;
      })
    );

    await updateReviewInSupabase(reviewId, updatedReview);
    showToast('Your review has been updated.');
    return true;
  };

  // Product Reviews: Delete Review
  const deleteProductReview = async (reviewId: string): Promise<boolean> => {
    const existing = reviews.find(r => r.id === reviewId);
    if (!existing) return false;

    // Security check: Author or admin
    const isAuthor = currentUser?.id && existing.userId === currentUser.id;
    if (!isAuthor && !isAdminAuthenticated) {
      showToast('Access denied: You can only delete your own reviews.');
      return false;
    }

    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);

    // Recalculate product rating
    const approvedProductReviews = updatedReviews.filter(r => r.productId === existing.productId && r.status === 'approved');
    const avgRating = approvedProductReviews.length > 0 
      ? Number((approvedProductReviews.reduce((sum, r) => sum + r.rating, 0) / approvedProductReviews.length).toFixed(1))
      : 5.0;

    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === existing.productId) {
          const updatedProd = {
            ...p,
            rating: avgRating,
            reviewCount: approvedProductReviews.length
          };
          upsertProductInSupabase(updatedProd);
          return updatedProd;
        }
        return p;
      })
    );

    await deleteReviewFromSupabase(reviewId);
    showToast('Review removed.');
    return true;
  };

  // Product Reviews: Toggle Helpful Vote
  const toggleReviewHelpful = async (reviewId: string): Promise<boolean> => {
    const userId = currentUser?.id || 'anon-session-voter';
    const target = reviews.find(r => r.id === reviewId);
    if (!target) return false;

    const currentVoters = target.helpfulUserIds || [];
    const hasVoted = currentVoters.includes(userId);
    const newVoters = hasVoted ? currentVoters.filter(id => id !== userId) : [...currentVoters, userId];
    const newCount = newVoters.length;

    const updatedReview: ProductReview = {
      ...target,
      helpfulVotes: newCount,
      likes: newCount,
      helpfulUserIds: newVoters
    };

    setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));
    await toggleReviewHelpfulInSupabase(reviewId, userId, hasVoted, newCount);

    showToast(hasVoted ? 'Helpful vote removed.' : 'Marked as helpful. Thank you for your feedback!');
    return true;
  };

  // Product Reviews: Report Review
  const reportProductReview = async (reviewId: string, reason: string, details?: string): Promise<boolean> => {
    const target = reviews.find(r => r.id === reviewId);
    if (!target) return false;

    const reportCount = (target.reportCount || 0) + 1;
    const updatedReview: ProductReview = {
      ...target,
      reported: true,
      reportReason: reason,
      reportCount
    };

    setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r));

    await reportReviewInSupabase({
      reviewId,
      reason: 'inappropriate',
      reasonText: reason,
      details,
      reportedBy: currentUser?.id,
      createdAt: new Date().toISOString()
    });

    showToast('Thank you. This review has been flagged for atelier moderation.');
    return true;
  };

  // Product Reviews: Admin Moderation Action
  const moderateReview = async (
    reviewId: string,
    action: 'approve' | 'reject' | 'hide' | 'feature' | 'delete',
    notes?: string
  ): Promise<boolean> => {
    if (!isAdminAuthenticated) {
      showToast('Admin privilege required for review moderation.');
      return false;
    }

    if (action === 'delete') {
      return await deleteProductReview(reviewId);
    }

    const target = reviews.find(r => r.id === reviewId);
    if (!target) return false;

    let updatedReview: ProductReview = { ...target };

    if (action === 'approve') {
      updatedReview.status = 'approved';
      updatedReview.reported = false;
    } else if (action === 'reject') {
      updatedReview.status = 'rejected';
    } else if (action === 'hide') {
      updatedReview.status = 'hidden';
    } else if (action === 'feature') {
      updatedReview.isFeatured = !target.isFeatured;
    }

    if (notes) {
      updatedReview.adminNotes = notes;
    }

    const updatedReviews = reviews.map(r => r.id === reviewId ? updatedReview : r);
    setReviews(updatedReviews);

    // Recalculate product rating if status changed
    const approvedProductReviews = updatedReviews.filter(r => r.productId === target.productId && r.status === 'approved');
    const avgRating = approvedProductReviews.length > 0
      ? Number((approvedProductReviews.reduce((sum, r) => sum + r.rating, 0) / approvedProductReviews.length).toFixed(1))
      : 5.0;

    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === target.productId) {
          const updatedProd = {
            ...p,
            rating: avgRating,
            reviewCount: approvedProductReviews.length
          };
          upsertProductInSupabase(updatedProd);
          return updatedProd;
        }
        return p;
      })
    );

    await updateReviewInSupabase(reviewId, updatedReview);
    showToast(`Review action "${action}" applied.`);
    return true;
  };

  // Billing & Invoices
  const addBillingInvoice = (invoice: BillingInvoice) => {
    setInvoices(prev => [invoice, ...prev]);
    insertInvoiceInSupabase(invoice);
  };

  // Product Catalog CRUD (Admin)
  const addProduct = async (prod: Product) => {
    setProducts(prev => [prod, ...prev]);
    const isSuccess = await upsertProductInSupabase(prod);
    if (isSuccess) {
      recordAuditLog('admin', 'create_product', 'product', prod.id, null, prod);
      showToast(`Product "${prod.name}" published to catalog.`);
    } else {
      showToast(`Product saved locally.`);
    }
  };

  const updateProduct = async (prod: Product) => {
    setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
    const isSuccess = await upsertProductInSupabase(prod);
    if (isSuccess) {
      recordAuditLog('admin', 'update_product', 'product', prod.id, null, prod);
      showToast(`Product "${prod.name}" updated.`);
    } else {
      showToast(`Product updated locally.`);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    const isSuccess = await deleteProductInSupabase(id);
    if (isSuccess) {
      recordAuditLog('admin', 'delete_product', 'product', id);
      showToast('Product removed from catalog.');
    } else {
      showToast('Product removed from catalog.');
    }
  };

  const bulkAddProducts = async (productsList: Product[]): Promise<{ success: boolean; count: number; error?: string }> => {
    if (!productsList || productsList.length === 0) {
      return { success: false, count: 0, error: 'No products provided for import.' };
    }

    try {
      setProducts(prev => [...productsList, ...prev]);
      for (const prod of productsList) {
        await upsertProductInSupabase(prod);
      }
      recordAuditLog('admin', 'bulk_import_products', 'catalog', `Imported ${productsList.length} products`);
      showToast(`Successfully imported ${productsList.length} products to catalog!`);
      return { success: true, count: productsList.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Bulk product creation failed.' };
    }
  };

  const bulkDeleteProducts = async (productIds: string[]): Promise<{ success: boolean; count: number; error?: string }> => {
    if (!productIds || productIds.length === 0) {
      return { success: false, count: 0, error: 'No product IDs selected for deletion.' };
    }

    try {
      setProducts(prev => prev.filter(p => !productIds.includes(p.id)));
      for (const id of productIds) {
        await deleteProductInSupabase(id);
      }
      recordAuditLog('admin', 'bulk_delete_products', 'catalog', `Deleted ${productIds.length} products`);
      showToast(`Removed ${productIds.length} products from catalog.`);
      return { success: true, count: productIds.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Bulk deletion failed.' };
    }
  };

  // Orders, Verification & Fulfillment
  const refetchOrders = async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const dbOrders = await fetchOrdersFromSupabase();
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      }
    } catch (err: any) {
      setOrdersError(err?.message || 'Failed to refresh orders.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const calculateServerOrderQuote = async (request: ServerOrderQuoteRequest): Promise<ServerPriceBreakdown> => {
    return await verifyAndCalculateOrderTotals(request);
  };

  const placeServerVerifiedOrder = async (
    params: CreateOrderParams
  ): Promise<{ success: boolean; order?: Order; invoice?: BillingInvoice; error?: string }> => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const result = await executeServerOrderCreation(params);
      if (!result.success || !result.order) {
        const errMsg = result.error || 'Server rejected order verification.';
        setOrdersError(errMsg);
        showToast(`Checkout validation failed: ${errMsg}`);
        return { success: false, error: errMsg };
      }

      // Prepend order & invoice to local state
      setOrders(prev => [result.order!, ...prev]);
      if (result.invoice) {
        setInvoices(prev => [result.invoice!, ...prev]);
      }

      // Synchronize locally decremented inventory
      setProducts(prev =>
        prev.map(p => {
          const item = params.items.find(i => i.product.id === p.id);
          if (item) {
            const updatedStock = Math.max(0, p.inventory - item.quantity);
            return { ...p, inventory: updatedStock };
          }
          return p;
        })
      );

      // Clear Cart
      setCart([]);
      setAppliedCoupon(null);

      // Trigger In-App Notifications & Server Email Dispatches
      dispatchNotification({
        type: 'ORDER_CREATED',
        recipientEmail: result.order.customerEmail,
        recipientName: result.order.customerName,
        userId: result.order.customerId,
        data: {
          orderNumber: result.order.orderNumber,
          total: result.order.total,
          itemsCount: result.order.items.length
        },
        priority: 'high'
      });

      dispatchNotification({
        type: 'PAYMENT_SUCCESSFUL',
        recipientEmail: result.order.customerEmail,
        recipientName: result.order.customerName,
        userId: result.order.customerId,
        data: {
          orderNumber: result.order.orderNumber,
          amount: result.order.total,
          paymentMethod: result.order.paymentMethod
        },
        priority: 'high'
      });

      Analytics.trackPurchase({
        orderNumber: result.order.orderNumber,
        total: result.order.total,
        itemsCount: result.order.items.length,
        paymentMethod: result.order.paymentMethod,
        currency: 'INR'
      }, result.order.customerId);

      trackAnalyticsEvent('purchase', {
        orderNumber: result.order.orderNumber,
        total: result.order.total,
        itemsCount: result.order.items.length
      });

      showToast(`✨ Order ${result.order.orderNumber} placed & inventory reserved in database!`);
      return { success: true, order: result.order, invoice: result.invoice };
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to place server-verified order.';
      setOrdersError(errMsg);
      showToast(`Order error: ${errMsg}`);
      return { success: false, error: errMsg };
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const processOrderRefund = async (
    orderId: string,
    amount: number,
    reason: string,
    restockInventory = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const targetOrder = orders.find(o => o.id === orderId);
      const res = await processOrderRefundInSupabase(
        orderId,
        amount,
        reason,
        restockInventory,
        targetOrder?.items
      );

      if (res.success) {
        setOrders(prev =>
          prev.map(ord => {
            if (ord.id === orderId) {
              const newTimeline = [
                ...ord.timeline,
                {
                  status: 'Refunded' as Order['status'],
                  timestamp: new Date().toISOString(),
                  description: `Refund of ₹${(amount * 86.5).toLocaleString('en-IN')} processed. Reason: ${reason}`,
                  location: 'Finance & Accounts Settlement'
                }
              ];
              return {
                ...ord,
                status: 'Refunded',
                paymentStatus: 'refunded',
                timeline: newTimeline
              };
            }
            return ord;
          })
        );

        if (restockInventory && targetOrder?.items) {
          setProducts(prev =>
            prev.map(p => {
              const item = targetOrder.items.find(i => i.product.id === p.id);
              if (item) {
                return { ...p, inventory: p.inventory + item.quantity };
              }
              return p;
            })
          );
        }

        recordAuditLog('admin', 'process_refund', 'order', orderId, null, { amount, reason, restockInventory });

        // Trigger Refund Processed Notification & Server Email
        if (targetOrder) {
          dispatchNotification({
            type: 'REFUND_PROCESSED',
            recipientEmail: targetOrder.customerEmail,
            recipientName: targetOrder.customerName,
            userId: targetOrder.customerId,
            data: {
              orderNumber: targetOrder.orderNumber,
              refundAmount: amount,
              reason: reason
            },
            priority: 'urgent'
          });
        }

        showToast(`Refund processed for order ${targetOrder?.orderNumber || orderId}.`);
        return { success: true };
      } else {
        showToast(`Refund error: ${res.error || 'Failed to process refund'}`);
        return { success: false, error: res.error };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Refund error' };
    }
  };

  const updateOrderLogistics = async (
    orderId: string,
    carrier: string,
    trackingNumber: string,
    trackingUrl?: string,
    deliveryDate?: string,
    status: Order['status'] = 'Shipped',
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await updateOrderLogisticsInSupabase(
        orderId,
        carrier,
        trackingNumber,
        trackingUrl,
        deliveryDate,
        status,
        notes
      );

      if (res.success) {
        let updatedOrderObj: Order | null = null;
        setOrders(prev =>
          prev.map(ord => {
            if (ord.id === orderId) {
              const newTimeline = [
                ...ord.timeline,
                {
                  status,
                  timestamp: new Date().toISOString(),
                  description: notes || `Dispatched via ${carrier}. AWB Waybill #${trackingNumber}`,
                  location: `${carrier} Sorting Hub`
                }
              ];
              const updated = {
                ...ord,
                status,
                carrier,
                trackingNumber,
                trackingUrl: trackingUrl || ord.trackingUrl,
                deliveryDate: deliveryDate || ord.deliveryDate,
                timeline: newTimeline
              };
              updatedOrderObj = updated;
              return updated;
            }
            return ord;
          })
        );

        if (updatedOrderObj) {
          const typedOrder = updatedOrderObj as Order;
          const shippingEmail = generateShippingUpdateEmail(
            typedOrder,
            status,
            carrier,
            trackingNumber
          );
          addEmailNotification(shippingEmail);

          const notifType: NotificationType = status === 'Delivered' 
            ? 'ORDER_DELIVERED' 
            : status === 'Shipped' || status === 'Out for Delivery'
            ? 'ORDER_SHIPPED'
            : 'ORDER_PROCESSING';

          dispatchNotification({
            type: notifType,
            recipientEmail: typedOrder.customerEmail,
            recipientName: typedOrder.customerName,
            userId: typedOrder.customerId,
            data: {
              orderNumber: typedOrder.orderNumber,
              carrier,
              trackingNumber,
              trackingUrl,
              deliveryDate,
              status
            },
            priority: status === 'Delivered' ? 'high' : 'normal'
          });
        }

        recordAuditLog('admin', 'update_logistics', 'order', orderId, null, { carrier, trackingNumber, status });
        showToast(`Logistics updated: ${carrier} #${trackingNumber}`);
        return { success: true };
      } else {
        showToast(`Logistics update failed: ${res.error}`);
        return { success: false, error: res.error };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update logistics' };
    }
  };

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
    insertOrderInSupabase(newOrder);
    trackAnalyticsEvent('purchase', { orderNumber, total: newOrder.total, itemsCount: newOrder.items.length });
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
    insertInvoiceInSupabase(newInvoice);

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

    if (updatedOrderObj) {
      const typedOrder = updatedOrderObj as Order;
      updateOrderStatusInSupabase(orderId, status, carrier, trackingNumber, typedOrder.timeline);
      recordAuditLog('admin', 'update_order_status', 'order', orderId, null, { status, carrier, trackingNumber });
      
      const shippingEmail = generateShippingUpdateEmail(
        typedOrder,
        status,
        carrier,
        trackingNumber
      );
      addEmailNotification(shippingEmail);

      const notifType: NotificationType = status === 'Delivered'
        ? 'ORDER_DELIVERED'
        : status === 'Shipped' || status === 'Out for Delivery'
        ? 'ORDER_SHIPPED'
        : 'ORDER_PROCESSING';

      dispatchNotification({
        type: notifType,
        recipientEmail: typedOrder.customerEmail,
        recipientName: typedOrder.customerName,
        userId: typedOrder.customerId,
        data: {
          orderNumber: typedOrder.orderNumber,
          carrier: carrier || typedOrder.carrier,
          trackingNumber: trackingNumber || typedOrder.trackingNumber,
          status
        },
        priority: status === 'Delivered' ? 'high' : 'normal'
      });
    }

    showToast(`Order status updated to ${status}. Email update dispatched!`);
  };

  // Custom Orders & Bespoke Commissions
  const createCustomOrderRequest = (req: Omit<CustomOrder, 'id' | 'requestNumber' | 'status' | 'messages' | 'createdAt' | 'updatedAt' | 'timeline'>): CustomOrder => {
    const requestNumber = `CO-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();
    const initialFiles = req.uploadedFiles || [];

    const newCustom: CustomOrder = {
      ...req,
      id: `co-${Date.now()}`,
      requestNumber,
      status: 'REQUESTED',
      selectedColors: req.selectedColors || req.preferredColors || [],
      uploadedFiles: initialFiles,
      uploadedImages: req.uploadedImages || [],
      referenceImages: req.referenceImages || [],
      timeline: [
        {
          status: 'REQUESTED',
          timestamp: nowIso,
          description: `Custom commission brief for ${req.recipient || 'recipient'} (${req.relationship || 'custom'}) submitted to HARCONXS Atelier.`,
          actor: 'customer'
        }
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: req.customerName || 'Customer',
          text: req.description || `Submitted custom order request for ${req.productType}.`,
          timestamp: nowIso,
          attachments: initialFiles.length > 0 ? initialFiles : undefined
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    Analytics.trackCustomOrderSubmitted({
      requestNumber,
      recipient: req.recipient,
      relationship: req.relationship,
      occasion: req.occasion,
      budget: req.budgetRange ? parseFloat(req.budgetRange.replace(/[^0-9.]/g, '')) || undefined : undefined,
      productType: req.productType
    }, currentUser?.id);

    setCustomOrders(prev => [newCustom, ...prev]);
    upsertCustomOrderInSupabase(newCustom);
    trackAnalyticsEvent('create_custom_order', { requestNumber, recipient: req.recipient, relationship: req.relationship });
    showToast(`Custom order request ${requestNumber} submitted to Atelier!`);
    return newCustom;
  };

  const sendCustomOrderMessage = async (
    customOrderId: string,
    text: string,
    sender: 'customer' | 'admin',
    options?: {
      attachments?: string[];
      fileAttachments?: CustomOrderAttachment[];
      isAdminProof?: boolean;
      adminProofTitle?: string;
    }
  ): Promise<void> => {
    const targetOrder = customOrders.find(co => co.id === customOrderId);
    const nowIso = new Date().toISOString();
    const newMsg: CustomOrderMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender,
      senderName: sender === 'admin' ? (targetOrder?.assignedAdminName || 'HARCONXS Master Artisan') : (targetOrder?.customerName || 'Customer'),
      text,
      attachments: options?.attachments && options.attachments.length > 0 ? options.attachments : undefined,
      fileAttachments: options?.fileAttachments && options.fileAttachments.length > 0 ? options.fileAttachments : undefined,
      isAdminProof: options?.isAdminProof,
      adminProofTitle: options?.adminProofTitle,
      timestamp: nowIso,
      status: 'sent',
      isRead: false
    };

    let updatedAllMessages: CustomOrderMessage[] = [];
    const isFromAdmin = sender === 'admin';
    const newConvStatus: CustomOrderConversationStatus = isFromAdmin ? 'waiting_on_customer' : 'waiting_on_artisan';

    setCustomOrders(prev =>
      prev.map(co => {
        if (co.id === customOrderId) {
          const updatedMessages = [...co.messages, newMsg];
          updatedAllMessages = updatedMessages;
          const updated: CustomOrder = {
            ...co,
            messages: updatedMessages,
            conversationStatus: newConvStatus,
            unreadCountCustomer: isFromAdmin ? ((co.unreadCountCustomer || 0) + 1) : co.unreadCountCustomer,
            unreadCountAdmin: !isFromAdmin ? ((co.unreadCountAdmin || 0) + 1) : co.unreadCountAdmin,
            updatedAt: nowIso
          };
          upsertCustomOrderInSupabase(updated);
          return updated;
        }
        return co;
      })
    );

    // Broadcast to Supabase Realtime channel for instant sub-second delivery
    await broadcastCustomOrderMessage(customOrderId, newMsg, updatedAllMessages, targetOrder);

    // Trigger In-App Notification & Server Email if message is from artisan/admin to customer
    if (isFromAdmin && targetOrder) {
      dispatchNotification({
        type: 'CUSTOM_ORDER_MESSAGE',
        recipientEmail: targetOrder.customerEmail,
        recipientName: targetOrder.customerName,
        userId: targetOrder.customerId,
        data: {
          requestNumber: targetOrder.requestNumber,
          senderName: newMsg.senderName,
          messagePreview: text.substring(0, 100),
          customOrderId: targetOrder.id
        },
        priority: 'high'
      });
    }
  };

  const markCustomOrderMessagesAsRead = async (
    customOrderId: string,
    readerRole: 'customer' | 'admin'
  ): Promise<void> => {
    const target = customOrders.find(co => co.id === customOrderId);
    if (!target) return;

    const result = await markCustomOrderMessagesAsReadInSupabase(customOrderId, readerRole, target.messages);
    if (result.success) {
      setCustomOrders(prev =>
        prev.map(co => {
          if (co.id === customOrderId) {
            return {
              ...co,
              messages: result.messages,
              unreadCountCustomer: readerRole === 'customer' ? 0 : co.unreadCountCustomer,
              unreadCountAdmin: readerRole === 'admin' ? 0 : co.unreadCountAdmin
            };
          }
          return co;
        })
      );
    }
  };

  const assignCustomOrderStaff = async (
    customOrderId: string,
    adminId: string,
    adminName: string,
    adminRole?: string
  ): Promise<void> => {
    const success = await assignCustomOrderStaffInSupabase(customOrderId, adminId, adminName, adminRole);
    if (success) {
      setCustomOrders(prev =>
        prev.map(co => {
          if (co.id === customOrderId) {
            return {
              ...co,
              assignedAdminId: adminId,
              assignedAdminName: adminName,
              assignedAdminRole: adminRole || 'Lead Custom Artisan'
            };
          }
          return co;
        })
      );
      recordAuditLog(adminName, 'Assigned Artisan to Custom Order', 'custom_orders', customOrderId);
      showToast(`Assigned ${adminName} to custom order.`);
    }
  };

  const updateCustomOrderConversationStatus = async (
    customOrderId: string,
    status: CustomOrderConversationStatus
  ): Promise<void> => {
    const success = await updateCustomOrderConversationStatusInSupabase(customOrderId, status);
    if (success) {
      setCustomOrders(prev =>
        prev.map(co => (co.id === customOrderId ? { ...co, conversationStatus: status } : co))
      );
      showToast(`Conversation marked as ${status.replace(/_/g, ' ')}.`);
    }
  };

  const provideCustomOrderQuote = async (customOrderId: string, quoteData: Omit<CustomOrderQuote, 'id'>): Promise<void> => {
    const quote: CustomOrderQuote = {
      ...quoteData,
      id: `q-${Date.now()}`
    };

    const nowIso = new Date().toISOString();
    const newEvent: CustomOrderTrackingEvent = {
      status: 'QUOTED',
      timestamp: nowIso,
      description: `Official Atelier Quotation issued (${quoteData.amount.toFixed(2)}) with ${quoteData.turnaroundDays}-day turnaround.`,
      actor: 'artisan'
    };

    setCustomOrders(prev =>
      prev.map(co => {
        if (co.id === customOrderId) {
          const updatedTimeline = [...(co.timeline || []), newEvent];
          const updated = {
            ...co,
            status: 'QUOTED' as CustomOrderStatus,
            quote,
            timeline: updatedTimeline,
            designProofUrl: quoteData.designProofUrl || co.designProofUrl,
            updatedAt: nowIso
          };
          upsertCustomOrderInSupabase(updated);

          // Dispatch notification to customer
          dispatchNotification({
            type: 'CUSTOM_QUOTE_ISSUED',
            recipientEmail: co.customerEmail,
            recipientName: co.customerName,
            userId: co.customerId,
            data: {
              requestNumber: co.requestNumber,
              quoteAmount: quoteData.amount,
              turnaroundDays: quoteData.turnaroundDays,
              customOrderId: co.id
            },
            priority: 'urgent'
          });

          return updated;
        }
        return co;
      })
    );
    showToast('Official quotation and fabrication specifications dispatched to customer.');
  };

  const respondToQuote = async (customOrderId: string, accept: boolean, revisionReason?: string): Promise<void> => {
    const nowIso = new Date().toISOString();
    const newStatus: CustomOrderStatus = accept ? 'QUOTE_ACCEPTED' : 'UNDER_REVIEW';
    const newEvent: CustomOrderTrackingEvent = {
      status: newStatus,
      timestamp: nowIso,
      description: accept 
        ? 'Customer accepted the quotation. Materials and artisan bench reserved.'
        : `Customer requested revision: "${revisionReason || 'Adjustments requested'}"`,
      actor: 'customer'
    };

    setCustomOrders(prev =>
      prev.map(co => {
        if (co.id === customOrderId && co.quote) {
          const updatedTimeline = [...(co.timeline || []), newEvent];
          const updated = {
            ...co,
            status: newStatus,
            timeline: updatedTimeline,
            quote: {
              ...co.quote,
              status: (accept ? 'accepted' : 'revised') as any,
              revisedReason: !accept ? revisionReason : undefined
            },
            updatedAt: nowIso
          };
          upsertCustomOrderInSupabase(updated);

          if (accept) {
            dispatchNotification({
              type: 'QUOTE_ACCEPTED',
              recipientEmail: co.customerEmail,
              recipientName: co.customerName,
              userId: co.customerId,
              data: {
                requestNumber: co.requestNumber,
                quoteAmount: co.quote.amount,
                customOrderId: co.id
              },
              priority: 'high'
            });
          }

          return updated;
        }
        return co;
      })
    );

    if (accept) {
      showToast('🎉 Quote accepted! Project queued for atelier design & fabrication.');
    } else {
      if (revisionReason) {
        await sendCustomOrderMessage(
          customOrderId,
          `Revision Requested: "${revisionReason}"`,
          'customer'
        );
      }
      showToast('Revision notes sent to master artisan.');
    }
  };

  const updateCustomOrderStatus = async (
    customOrderId: string,
    status: CustomOrderStatus,
    trackingDetails?: {
      carrier?: string;
      trackingNumber?: string;
      trackingUrl?: string;
      designProofUrl?: string;
      notes?: string;
    }
  ): Promise<void> => {
    const nowIso = new Date().toISOString();
    const newEvent: CustomOrderTrackingEvent = {
      status,
      timestamp: nowIso,
      description: trackingDetails?.notes || `Project transitioned to ${status.replace(/_/g, ' ')}.`,
      actor: 'artisan'
    };

    setCustomOrders(prev =>
      prev.map(co => {
        if (co.id === customOrderId) {
          const updatedTimeline = [...(co.timeline || []), newEvent];
          const updated = {
            ...co,
            status,
            carrier: trackingDetails?.carrier || co.carrier,
            trackingNumber: trackingDetails?.trackingNumber || co.trackingNumber,
            trackingUrl: trackingDetails?.trackingUrl || co.trackingUrl,
            designProofUrl: trackingDetails?.designProofUrl || co.designProofUrl,
            timeline: updatedTimeline,
            updatedAt: nowIso
          };
          upsertCustomOrderInSupabase(updated);
          return updated;
        }
        return co;
      })
    );

    showToast(`Custom project status transitioned to "${status}".`);
  };

  const uploadCustomOrderFile = async (
    file: File,
    customOrderId?: string
  ): Promise<{ success: boolean; url: string; fileName: string; fileSize?: number; error?: string }> => {
    return await uploadCustomOrderFileToSupabase(file, customOrderId);
  };

  const subscribeToCustomOrder = (
    customOrderId: string,
    callback: (order: Partial<CustomOrder>) => void
  ): (() => void) => {
    return subscribeToCustomOrderRealtime(customOrderId, (updatedData) => {
      // Sync local context state when realtime change arrives
      setCustomOrders(prev =>
        prev.map(co => (co.id === customOrderId ? { ...co, ...updatedData } : co))
      );
      callback(updatedData);
    });
  };

  // Couple Websites & Templates
  const addCoupleTemplate = async (templateData: Omit<CoupleWebsiteTemplate, 'id'>): Promise<boolean> => {
    const newTemplate: CoupleWebsiteTemplate = {
      ...templateData,
      id: `tmpl-${Date.now()}`
    };
    setCoupleTemplates(prev => [newTemplate, ...prev]);
    const success = await upsertCoupleTemplateInSupabase(newTemplate);
    recordAuditLog('Admin', 'Created Template', 'couple_templates', newTemplate.name);
    showToast(`Template "${newTemplate.name}" created successfully.`);
    return success;
  };

  const updateCoupleTemplate = async (template: CoupleWebsiteTemplate): Promise<boolean> => {
    setCoupleTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    const success = await upsertCoupleTemplateInSupabase(template);
    recordAuditLog('Admin', 'Updated Template', 'couple_templates', template.name);
    showToast(`Template "${template.name}" updated successfully.`);
    return success;
  };

  const deleteCoupleTemplate = async (templateId: string): Promise<boolean> => {
    setCoupleTemplates(prev => prev.filter(t => t.id !== templateId));
    const success = await deleteCoupleTemplateFromSupabase(templateId);
    recordAuditLog('Admin', 'Deleted Template', 'couple_templates', templateId);
    showToast('Template removed from catalog.');
    return success;
  };

  const toggleCoupleTemplateActive = async (templateId: string): Promise<boolean> => {
    let updatedTmpl: CoupleWebsiteTemplate | null = null;
    setCoupleTemplates(prev => prev.map(t => {
      if (t.id === templateId) {
        updatedTmpl = { ...t, isActive: t.isActive === false ? true : false };
        return updatedTmpl;
      }
      return t;
    }));
    if (updatedTmpl) {
      await upsertCoupleTemplateInSupabase(updatedTmpl);
      showToast(`Template status toggled.`);
      return true;
    }
    return false;
  };

  const createCoupleWebsite = (projectData: Omit<CoupleWebsiteProject, 'id' | 'views' | 'createdAt' | 'expiresAt'>): CoupleWebsiteProject => {
    const newProject: CoupleWebsiteProject = {
      ...projectData,
      id: `cpl-proj-${Date.now()}`,
      views: 1,
      heartsGiven: 1,
      isPublished: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString()
    };

    Analytics.trackCoupleWebsitePurchased({
      templateId: newProject.templateId,
      subdomain: newProject.subdomain,
      websiteTitle: newProject.title
    }, newProject.ownerId);

    setCoupleWebsites(prev => [newProject, ...prev]);
    upsertCoupleWebsiteInSupabase(newProject);
    trackAnalyticsEvent('create_couple_website', { subdomain: newProject.subdomain });

    // Trigger In-App Notification & Server Email
    dispatchNotification({
      type: 'COUPLE_WEBSITE_PURCHASE',
      recipientEmail: newProject.ownerEmail || currentUser?.email,
      recipientName: `${newProject.partner1Name} & ${newProject.partner2Name}`,
      userId: newProject.ownerId || currentUser?.id,
      data: {
        websiteTitle: newProject.title,
        subdomain: newProject.subdomain,
        templateName: newProject.templateId
      },
      priority: 'high'
    });

    showToast(`Sanctuary website live: ${newProject.subdomain}.harconxsshop.com`);
    return newProject;
  };

  const updateCoupleWebsite = async (project: CoupleWebsiteProject): Promise<boolean> => {
    setCoupleWebsites(prev => prev.map(p => p.id === project.id ? project : p));
    const success = await upsertCoupleWebsiteInSupabase(project);
    showToast('Sanctuary customizations saved & published.');
    return success;
  };

  const deleteCoupleWebsite = async (projectId: string): Promise<boolean> => {
    setCoupleWebsites(prev => prev.filter(p => p.id !== projectId));
    const success = await deleteCoupleWebsiteFromSupabase(projectId);
    showToast('Sanctuary website deleted.');
    return success;
  };

  const publishCoupleWebsite = async (projectId: string, isPublished: boolean): Promise<boolean> => {
    let targetProject: CoupleWebsiteProject | null = null;
    setCoupleWebsites(prev => prev.map(p => {
      if (p.id === projectId) {
        targetProject = { ...p, isPublished, status: isPublished ? 'active' : 'draft' };
        return targetProject;
      }
      return p;
    }));
    if (targetProject) {
      await upsertCoupleWebsiteInSupabase(targetProject);

      if (isPublished) {
        dispatchNotification({
          type: 'WEBSITE_PUBLISHED',
          recipientEmail: (targetProject as CoupleWebsiteProject).ownerEmail || currentUser?.email,
          recipientName: `${(targetProject as CoupleWebsiteProject).partner1Name} & ${(targetProject as CoupleWebsiteProject).partner2Name}`,
          userId: (targetProject as CoupleWebsiteProject).ownerId || currentUser?.id,
          data: {
            websiteTitle: (targetProject as CoupleWebsiteProject).title,
            subdomain: (targetProject as CoupleWebsiteProject).subdomain,
            liveUrl: `https://${(targetProject as CoupleWebsiteProject).subdomain}.harconxsshop.com`
          },
          priority: 'high'
        });
      }

      showToast(isPublished ? 'Website published to live internet.' : 'Website unpublished (Draft mode).');
      return true;
    }
    return false;
  };

  const addGuestbookEntry = async (projectId: string, author: string, message: string): Promise<boolean> => {
    let updatedProj: CoupleWebsiteProject | null = null;
    const newEntry = {
      id: `gb-${Date.now()}`,
      author: author.trim() || 'Anonymous Friend',
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      heartsCount: 1,
      approved: true
    };

    setCoupleWebsites(prev => prev.map(p => {
      if (p.id === projectId) {
        const guestbook = [newEntry, ...(p.guestbook || [])];
        updatedProj = { ...p, guestbook };
        return updatedProj;
      }
      return p;
    }));

    if (updatedProj) {
      await upsertCoupleWebsiteInSupabase(updatedProj);
      showToast('💖 Guestbook note published to love wall!');
      return true;
    }
    return false;
  };

  const likeCoupleWebsite = async (projectId: string): Promise<boolean> => {
    let updatedProj: CoupleWebsiteProject | null = null;
    setCoupleWebsites(prev => prev.map(p => {
      if (p.id === projectId) {
        const heartsGiven = (p.heartsGiven || 0) + 1;
        updatedProj = { ...p, heartsGiven };
        return updatedProj;
      }
      return p;
    }));

    if (updatedProj) {
      await upsertCoupleWebsiteInSupabase(updatedProj);
      return true;
    }
    return false;
  };

  // API Keys (Admin Controlled)
  const createApiKey = (name: string, permissions: string[], rateLimit = 1000) => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const secretKey = `hx_live_${randomHex}`;
    const prefix = `hx_live_${randomHex.substring(0, 6)}...`;

    const record: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      clientId: 'cli_custom',
      clientName: name,
      name,
      keyPrefix: `hx_live_${randomHex.substring(0, 8)}`,
      keyHash: `hash_${randomHex}`,
      scopes: permissions,
      prefix,
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      rateLimit,
      requestCount: 0,
      usageCount: 0,
      permissions,
      status: 'active'
    };

    setApiKeys(prev => [record, ...prev]);
    upsertApiKeyInSupabase(record);
    recordAuditLog('admin', 'create_api_key', 'api_key', record.id);

    // Trigger API Key Created Notification & Email
    dispatchNotification({
      type: 'API_KEY_CREATED',
      recipientEmail: currentUser?.email || 'admin@hamza.harconxs.com',
      recipientName: currentUser?.name || 'Administrator',
      userId: currentUser?.id,
      data: {
        keyName: name,
        keyPrefix: prefix,
        scopes: permissions
      },
      priority: 'high'
    });

    showToast(`API token "${name}" generated.`);
    return { record, secretKey };
  };

  const revokeApiKey = (id: string) => {
    let targetKey: ApiKeyRecord | undefined;
    setApiKeys(prev => prev.map(k => {
      if (k.id === id) {
        targetKey = k;
        const updated = { ...k, status: 'revoked' as const };
        upsertApiKeyInSupabase(updated);
        return updated;
      }
      return k;
    }));
    recordAuditLog('admin', 'revoke_api_key', 'api_key', id);

    // Trigger API Key Revoked Notification & Email
    if (targetKey) {
      dispatchNotification({
        type: 'API_KEY_REVOKED',
        recipientEmail: currentUser?.email || 'admin@hamza.harconxs.com',
        recipientName: currentUser?.name || 'Administrator',
        userId: currentUser?.id,
        data: {
          keyName: targetKey.name,
          keyPrefix: targetKey.prefix
        },
        priority: 'urgent'
      });
    }

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

    Analytics.trackSupportStarted({
      category: newTicket.category,
      subject: newTicket.subject,
      source: 'support_tickets'
    });

    setTickets(prev => [newTicket, ...prev]);
    upsertSupportTicketInSupabase(newTicket);
    showToast(`Support ticket #${ticketNumber} logged. Our team responds within 2 hours.`);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, text: string, sender: 'customer' | 'support') => {
    let targetTicket: SupportTicket | undefined;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        targetTicket = t;
        const updated = {
          ...t,
          status: (sender === 'support' ? 'Waiting' : 'In Progress') as any,
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
        upsertSupportTicketInSupabase(updated);
        return updated;
      }
      return t;
    }));

    // Trigger Notification to customer if support replied
    if (sender === 'support' && targetTicket) {
      dispatchNotification({
        type: 'SUPPORT_REPLY',
        recipientEmail: targetTicket.customerEmail,
        recipientName: targetTicket.customerName,
        userId: targetTicket.customerId,
        data: {
          ticketNumber: targetTicket.ticketNumber,
          subject: targetTicket.subject,
          replyPreview: text.substring(0, 120),
          ticketId: targetTicket.id
        },
        priority: 'high'
      });
    }
  };

  // In-App Notification Center & Transactional Dispatch (Supabase Synced)
  const addNotification = (notif: AppNotification) => {
    setNotifications(prev => [notif, ...prev.filter(n => n.id !== notif.id)]);
    upsertNotificationInSupabase(notif);
  };

  const dispatchNotification = async (params: TriggerNotificationParams): Promise<AppNotification> => {
    const result = await triggerNotification({
      ...params,
      userId: params.userId || currentUser?.id,
      recipientEmail: params.recipientEmail || currentUser?.email,
      recipientName: params.recipientName || currentUser?.name
    });

    setNotifications(prev => [result.notification, ...prev.filter(n => n.id !== result.notification.id)]);
    return result.notification;
  };

  const markNotificationAsRead = async (id: string): Promise<void> => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n));
    await markNotificationReadInSupabase(id);
  };

  const markAllNotificationsAsRead = async (): Promise<void> => {
    const now = new Date().toISOString();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: n.readAt || now })));
    await markAllNotificationsReadInSupabase(currentUser?.id);
    showToast('All notifications marked as read.');
  };

  const deleteNotification = async (id: string): Promise<void> => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await deleteNotificationFromSupabase(id);
    showToast('Notification removed.');
  };

  const clearAllReadNotifications = async (): Promise<void> => {
    const readIds = notifications.filter(n => n.isRead).map(n => n.id);
    setNotifications(prev => prev.filter(n => !n.isRead));
    for (const id of readIds) {
      await deleteNotificationFromSupabase(id);
    }
    showToast('Read notifications cleared.');
  };

  // Automations & Policies CMS Governance Engine
  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    showToast('Automation workflow toggled.');
  };

  const updatePolicy = async (id: string, content: string, version: string) => {
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let updatedTarget: PolicyRecord | null = null;
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        updatedTarget = { ...p, content, version, lastUpdated: formattedDate, updatedAt: new Date().toISOString() };
        return updatedTarget;
      }
      return p;
    }));

    if (updatedTarget) {
      await upsertPolicyInSupabase(updatedTarget);
    }
    showToast('Legal policy published.');
  };

  const updatePolicyRecord = async (policy: PolicyRecord): Promise<boolean> => {
    setPolicies(prev => prev.map(p => p.id === policy.id ? policy : p));
    const ok = await upsertPolicyInSupabase(policy);
    if (ok) {
      recordAuditLog('admin', 'update_policy', 'policy', policy.id, null, policy);
      showToast(`Policy "${policy.title}" synchronized with Supabase.`);
      return true;
    }
    showToast(`Policy "${policy.title}" updated locally.`);
    return true;
  };

  const draftPolicyVersion = async (
    policyId: string,
    versionData: {
      version: string;
      title: string;
      content: string;
      sections?: PolicySection[];
      changeSummary: string;
      createdBy: string;
      isAiDrafted?: boolean;
    }
  ): Promise<PolicyVersion | null> => {
    const createdVer = await createPolicyVersionInSupabase(policyId, versionData);
    if (createdVer) {
      setPolicies(prev => prev.map(p => {
        if (p.id === policyId) {
          const versions = [createdVer, ...(p.versions || [])];
          return { ...p, versions };
        }
        return p;
      }));
      if (versionData.isAiDrafted) {
        showToast('🤖 AI Policy Draft saved as pending review. Administrator approval required to publish.');
      } else {
        showToast(`Draft version v${versionData.version} created for review.`);
      }
    }
    return createdVer;
  };

  const approveAndPublishPolicy = async (
    policyId: string,
    versionId: string,
    approvedBy: string = 'Super Administrator'
  ): Promise<{ success: boolean; message: string }> => {
    const res = await approveAndPublishPolicyInSupabase(policyId, versionId, approvedBy);
    if (res.success) {
      const dbPols = await fetchPoliciesFromSupabase();
      if (dbPols && dbPols.length > 0) {
        setPolicies(dbPols);
      } else {
        // Local state fallback update
        setPolicies(prev => prev.map(p => {
          if (p.id === policyId) {
            const ver = p.versions?.find(v => v.id === versionId);
            if (ver) {
              const updatedVersions = (p.versions || []).map(v => 
                v.id === versionId ? { ...v, status: 'published' as const, approvedBy, approvedAt: new Date().toISOString() } : { ...v, status: 'archived' as const }
              );
              return {
                ...p,
                title: ver.title,
                content: ver.content,
                sections: ver.sections,
                version: ver.version,
                status: 'published' as const,
                scheduledAt: null,
                approvedBy,
                approvedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                versions: updatedVersions
              };
            }
          }
          return p;
        }));
      }
      recordAuditLog(approvedBy, 'approve_publish_policy', 'policy', policyId, null, { versionId });
      showToast(res.message);
    } else {
      showToast(res.message);
    }
    return res;
  };

  const schedulePolicy = async (policyId: string, scheduledAt: string): Promise<boolean> => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        const updated = { ...p, status: 'scheduled' as const, scheduledAt, updatedAt: new Date().toISOString() };
        upsertPolicyInSupabase(updated);
        return updated;
      }
      return p;
    }));
    recordAuditLog('admin', 'schedule_policy_release', 'policy', policyId, null, { scheduledAt });
    showToast(`Policy scheduled for live publication at ${new Date(scheduledAt).toLocaleString()}`);
    return true;
  };

  // Private Website Visual Editor Methods (Supabase Persisted)
  const fetchAllPagesList = async (): Promise<PageRecord[]> => {
    try {
      const dbPages = await fetchAllPagesFromSupabase();
      if (dbPages && dbPages.length > 0) {
        setAllPages(dbPages);
        return dbPages;
      }
      return allPages;
    } catch {
      return allPages;
    }
  };

  const createPage = async (pageData: Partial<PageRecord>): Promise<{ success: boolean; page?: PageRecord; message: string }> => {
    setIsLoadingPageConfig(true);
    try {
      const pageId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const slug = pageData.slug || `page-${Date.now().toString(36)}`;
      const newPage: PageRecord = {
        id: pageId,
        slug,
        title: pageData.title || 'Untitled Page',
        status: pageData.status || 'draft',
        meta: pageData.meta || { description: '', keywords: '', ogImage: '' },
        sections: pageData.sections || [
          {
            id: `sec_${Date.now()}_hero`,
            pageId,
            sectionType: 'hero',
            sortOrder: 0,
            isHidden: false,
            settings: { paddingTop: 'lg', paddingBottom: 'lg', backgroundColor: '#09090b', containerWidth: 'wide' },
            content: {
              eyebrow: 'New Collection',
              title: pageData.title || 'Exclusive Atelier Preview',
              subtitle: 'Handcrafted luxury pieces designed for eternal memories.',
              primaryBtnText: 'Explore Catalog',
              primaryBtnLink: '/shop'
            }
          }
        ],
        publishedAt: pageData.status === 'published' ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await createPageInSupabase(newPage);
      if (res.success && res.page) {
        setAllPages(prev => [...prev.filter(p => p.id !== res.page!.id), res.page!]);
        setActivePageRecord(res.page);
        recordAuditLog(currentUser?.email || 'admin', 'create_page', 'page', res.page.id);
        showToast(`Page "${newPage.title}" created successfully.`);
        return { success: true, page: res.page, message: 'Page created successfully.' };
      }
      return { success: false, message: res.message || 'Failed to create page.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Error creating page.' };
    } finally {
      setIsLoadingPageConfig(false);
    }
  };

  const updatePageMetadata = async (pageId: string, updates: Partial<PageRecord>): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await updatePageMetadataInSupabase(pageId, updates);
      if (res.success) {
        setAllPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
        if (activePageRecord.id === pageId) {
          setActivePageRecord(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
        }
        showToast('Page settings updated.');
        return { success: true, message: 'Page updated.' };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to update page metadata.' };
    }
  };

  const duplicatePage = async (sourcePageId: string, newTitle: string, newSlug: string): Promise<{ success: boolean; newPage?: PageRecord; message: string }> => {
    setIsLoadingPageConfig(true);
    try {
      const res = await duplicatePageInSupabase(sourcePageId, newTitle, newSlug);
      if (res.success && res.newPage) {
        setAllPages(prev => [...prev, res.newPage!]);
        setActivePageRecord(res.newPage);
        recordAuditLog(currentUser?.email || 'admin', 'duplicate_page', 'page', res.newPage.id);
        showToast(`Page "${newTitle}" duplicated.`);
        return { success: true, newPage: res.newPage, message: 'Page duplicated.' };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to duplicate page.' };
    } finally {
      setIsLoadingPageConfig(false);
    }
  };

  const deletePage = async (pageId: string): Promise<{ success: boolean; message: string }> => {
    if (pageId === 'page_home' || pageId === 'home') {
      return { success: false, message: 'The primary Home storefront page cannot be deleted.' };
    }
    setIsLoadingPageConfig(true);
    try {
      const res = await deletePageFromSupabase(pageId);
      if (res.success) {
        setAllPages(prev => prev.filter(p => p.id !== pageId));
        if (activePageRecord.id === pageId) {
          // Switch to home page
          refetchPageConfig('home');
        }
        recordAuditLog(currentUser?.email || 'admin', 'delete_page', 'page', pageId);
        showToast('Page deleted from Supabase.');
        return { success: true, message: 'Page deleted.' };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to delete page.' };
    } finally {
      setIsLoadingPageConfig(false);
    }
  };

  const savePageDraft = async (page: PageRecord): Promise<{ success: boolean; message: string }> => {
    setIsLoadingPageConfig(true);
    try {
      const updatedPage = { ...page, status: 'draft' as const, updatedAt: new Date().toISOString() };
      setActivePageRecord(updatedPage);
      const res = await savePageDraftInSupabase(updatedPage);
      if (res.success) {
        recordAuditLog(currentUser?.email || 'admin', 'save_page_draft', 'page', updatedPage.id);
        showToast('Page draft saved securely to Supabase.');
        return { success: true, message: 'Draft saved.' };
      }
      return { success: false, message: res.message || 'Failed to save draft.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Error saving page draft.' };
    } finally {
      setIsLoadingPageConfig(false);
    }
  };

  const publishPage = async (page: PageRecord): Promise<{ success: boolean; message: string }> => {
    setIsLoadingPageConfig(true);
    try {
      const publishedPage = { ...page, status: 'published' as const, publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setActivePageRecord(publishedPage);
      const res = await publishPageInSupabase(publishedPage);
      if (res.success) {
        const revs = await fetchPageRevisionsFromSupabase(page.id);
        setPageRevisions(revs);
        recordAuditLog(currentUser?.email || 'admin', 'publish_page', 'page', publishedPage.id);
        showToast('🚀 Page successfully published live to Supabase!');
        return { success: true, message: 'Page published.' };
      }
      return { success: false, message: res.message || 'Failed to publish page.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Error publishing page.' };
    } finally {
      setIsLoadingPageConfig(false);
    }
  };

  const fetchPageRevisionsList = async (pageId: string): Promise<PageRevision[]> => {
    try {
      const revs = await fetchPageRevisionsFromSupabase(pageId);
      setPageRevisions(revs);
      return revs;
    } catch {
      return pageRevisions;
    }
  };

  const createPageRevisionSnapshot = async (
    pageId: string,
    revisionName: string,
    pageData: PageRecord
  ): Promise<PageRevision | null> => {
    try {
      const rev = await createPageRevisionInSupabase(
        pageId,
        revisionName,
        pageData
      );
      if (rev) {
        setPageRevisions(prev => [rev, ...prev]);
        showToast(`Revision snapshot "${revisionName}" created.`);
        return rev;
      }
      return null;
    } catch {
      return null;
    }
  };

  const restorePageRevisionSnapshot = async (revision: PageRevision): Promise<boolean> => {
    if (!revision.snapshotData) return false;
    try {
      const restoredPage: PageRecord = {
        id: revision.snapshotData.page?.id || activePageRecord.id,
        title: revision.snapshotData.page?.title || activePageRecord.title,
        slug: revision.snapshotData.page?.slug || activePageRecord.slug,
        status: 'draft',
        meta: revision.snapshotData.page?.meta || activePageRecord.meta,
        sections: revision.snapshotData.sections || activePageRecord.sections,
        publishedAt: null,
        createdAt: activePageRecord.createdAt,
        updatedAt: new Date().toISOString()
      };
      setActivePageRecord(restoredPage);
      await savePageDraftInSupabase(restoredPage);
      showToast(`Restored page configuration from revision "${revision.revisionName}".`);
      return true;
    } catch {
      showToast('Failed to restore revision.');
      return false;
    }
  };

  const deletePageSectionItem = async (sectionId: string): Promise<boolean> => {
    try {
      setActivePageRecord(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      }));
      await deletePageSectionFromSupabase(sectionId);
      showToast('Section removed from page.');
      return true;
    } catch {
      return false;
    }
  };

  const updateActivePageRecord = (updater: (prev: PageRecord) => PageRecord) => {
    setActivePageRecord(updater);
  };

  const refetchPageConfig = async (slugOrId: string = 'home') => {
    setIsLoadingPageConfig(true);
    try {
      const page = await fetchPageWithSectionsFromSupabase(slugOrId);
      if (page && page.sections && page.sections.length > 0) {
        setActivePageRecord(page);
        const revs = await fetchPageRevisionsFromSupabase(page.id);
        setPageRevisions(revs);
      }
    } finally {
      setIsLoadingPageConfig(false);
    }
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
        isLoadingProducts,
        productsError,
        refetchProducts,
        updateProductInventory,
        packagingOptions,
        botPanelServices,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkAddProducts,
        bulkDeleteProducts,
        reviews,
        addProductReview,
        updateProductReview,
        deleteProductReview,
        toggleReviewHelpful,
        reportProductReview,
        moderateReview,
        checkUserProductPurchase,
        cart,
        isLoadingCart,
        cartError,
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
        isLoadingWishlist,
        wishlistError,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        themeMode,
        toggleThemeMode,
        themeConfig,
        setThemeConfig,
        themeDraft,
        setThemeDraft,
        themeRevisions,
        isLoadingTheme,
        updateThemeDraft,
        saveThemeDraft,
        publishTheme,
        discardThemeChanges,
        resetThemeToDefaults,
        createThemeSnapshot,
        restoreThemeSnapshot,
        deleteThemeSnapshot,
        refetchThemeConfig,
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
        isLoadingOrders,
        ordersError,
        refetchOrders,
        calculateServerOrderQuote,
        placeServerVerifiedOrder,
        processOrderRefund,
        updateOrderLogistics,
        createOrder,
        updateOrderStatus,
        customOrders,
        createCustomOrderRequest,
        sendCustomOrderMessage,
        markCustomOrderMessagesAsRead,
        assignCustomOrderStaff,
        updateCustomOrderConversationStatus,
        provideCustomOrderQuote,
        respondToQuote,
        updateCustomOrderStatus,
        uploadCustomOrderFile,
        subscribeToCustomOrder,
        coupleTemplates,
        addCoupleTemplate,
        updateCoupleTemplate,
        deleteCoupleTemplate,
        toggleCoupleTemplateActive,
        coupleWebsites,
        createCoupleWebsite,
        updateCoupleWebsite,
        deleteCoupleWebsite,
        publishCoupleWebsite,
        addGuestbookEntry,
        likeCoupleWebsite,
        activeLivePreviewSubdomain,
        setActiveLivePreviewSubdomain,
        selectedEditingProject,
        setSelectedEditingProject,
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
        updatePolicyRecord,
        draftPolicyVersion,
        approveAndPublishPolicy,
        schedulePolicy,
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
        addUserAddress,
        updateUserAddress,
        deleteUserAddress,
        setDefaultUserAddress,
        redeemLoyaltyPoints,
        notifications,
        unreadNotificationsCount,
        addNotification,
        dispatchNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllReadNotifications,
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
        showToast,
        allPages,
        fetchAllPagesList,
        createPage,
        updatePageMetadata,
        duplicatePage,
        deletePage,
        activePageRecord,
        setActivePageRecord,
        pageRevisions,
        isLoadingPageConfig,
        savePageDraft,
        publishPage,
        fetchPageRevisionsList,
        createPageRevisionSnapshot,
        restorePageRevisionSnapshot,
        deletePageSectionItem,
        updateActivePageRecord,
        refetchPageConfig,
        paymentSettings,
        updatePaymentSettings
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
