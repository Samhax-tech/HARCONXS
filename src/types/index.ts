export type CategoryType = 'men' | 'women' | 'unisex' | 'couples' | 'custom' | 'digital' | 'digital-services' | 'bot-panels';
export type ProductCategory = CategoryType;

export type ProductBadge = 'Best Seller' | 'New' | 'Trending' | 'Limited' | 'Low Stock' | 'Almost Sold Out' | 'Sale' | 'Personalized' | 'Custom' | 'Digital' | 'Couples' | 'Featured';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  inventory: number;
  image?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  orderId?: string;
  orderItemId?: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  review?: string; // alias for comment
  date: string;
  createdAt?: string;
  updatedAt?: string;
  verified: boolean;
  verifiedPurchase?: boolean; // alias for verified
  likes: number; // alias for helpfulVotes
  helpfulVotes?: number;
  helpfulUserIds?: string[];
  images?: string[];
  customerImages?: string[]; // alias for images
  status?: 'approved' | 'pending' | 'rejected' | 'hidden';
  isFeatured?: boolean;
  reported?: boolean;
  reportReason?: string;
  reportCount?: number;
  adminNotes?: string;
}

export type ReviewModerationStatus = 'approved' | 'pending' | 'rejected' | 'hidden';

export interface ReviewReportSubmission {
  reviewId: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'irrelevant' | 'personal_info' | 'other';
  reasonText: string;
  details?: string;
  reportedBy?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  inventory: number;
  category: CategoryType;
  subcategory: string;
  tags: string[];
  badges: ProductBadge[];
  brand: string;
  productType: 'physical' | 'personalized' | 'digital' | 'custom_service';
  images: string[];
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  isPersonalizable?: boolean;
  personalizationFields?: {
    allowNames?: boolean;
    allowDate?: boolean;
    allowMessage?: boolean;
    allowPhoto?: boolean;
    allowFontSelection?: boolean;
    allowColorSelection?: boolean;
  };
  weight?: string;
  dimensions?: string;
  downloadUrl?: string;
  featured?: boolean;
  createdAt: string;
}

export interface PackagingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isPopular?: boolean;
}

export interface PersonalizationConfig {
  names?: string;
  date?: string;
  message?: string;
  photoUrl?: string;
  fontFamily?: string;
  colorTheme?: string;
  giftNote?: string;
  specialInstructions?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  packaging?: PackagingOption;
  personalization?: PersonalizationConfig;
  customPrice?: number;
}

export type OrderStatus = 
  | 'Pending'
  | 'Payment Pending'
  | 'Paid'
  | 'Processing'
  | 'Customization Required'
  | 'Production'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned'
  | 'Refunded';

export interface OrderTrackingEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  packagingFee: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cod' | 'crypto' | 'upi' | 'netbanking';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  giftNote?: string;
  deliveryDate?: string;
  estimatedDelivery?: string;
  timeline: OrderTrackingEvent[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export type CustomOrderRelationship = 
  | 'girlfriend' 
  | 'boyfriend' 
  | 'husband' 
  | 'wife' 
  | 'friend' 
  | 'family member' 
  | 'couple' 
  | 'other'
  | 'Girlfriend'
  | 'Boyfriend'
  | 'Husband'
  | 'Wife'
  | 'Friend'
  | 'Best Friend'
  | 'Partner'
  | 'Family'
  | 'Me'
  | 'Other';

export type CustomOrderOccasion = 
  | 'Birthday' 
  | 'Anniversary' 
  | "Valentine's Day" 
  | 'Wedding' 
  | 'Proposal' 
  | 'Friendship' 
  | 'Graduation' 
  | 'Celebration' 
  | 'Surprise' 
  | 'Just Because'
  | 'Other';

export type CustomOrderStatus = 
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'NEEDS_INFORMATION'
  | 'QUOTED'
  | 'QUOTE_ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'DESIGNING'
  | 'CUSTOMER_REVIEW'
  | 'APPROVED'
  | 'PRODUCTION'
  | 'PACKING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'
  // Legacy aliases for backward compatibility:
  | 'Submitted'
  | 'Quoted'
  | 'Paid'
  | 'In Design'
  | 'Production'
  | 'Shipped'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface CustomOrderTrackingEvent {
  status: CustomOrderStatus;
  timestamp: string;
  description?: string;
  note?: string;
  actor?: 'customer' | 'artisan' | 'system' | string;
  location?: string;
}

export interface CustomOrderQuote {
  id: string;
  amount: number;
  shippingFee: number;
  turnaroundDays: number;
  notes: string;
  packagingIncluded: string;
  validUntil: string;
  status: 'pending_review' | 'accepted' | 'rejected' | 'revised';
  designProofUrl?: string;
  revisedReason?: string;
}

export interface CustomOrderAttachment {
  id?: string;
  url: string;
  name: string;
  size?: string;
  fileSize?: number;
  fileType?: string;
  type?: 'image' | 'design_cad' | 'reference' | 'admin_proof' | 'document' | 'audio';
  category?: 'customer_reference' | 'design_cad' | 'admin_proof' | 'specification';
  previewUrl?: string;
  uploadedAt?: string;
  uploaderRole?: 'customer' | 'admin';
}

export type CustomOrderConversationStatus = 
  | 'open' 
  | 'in_progress' 
  | 'waiting_on_customer' 
  | 'waiting_on_artisan' 
  | 'resolved' 
  | 'archived';

export interface CustomOrderMessage {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
  attachments?: string[];
  fileAttachments?: CustomOrderAttachment[];
  isRead?: boolean;
  readAt?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isAdminProof?: boolean;
  adminProofTitle?: string;
}

export interface CustomOrderPersonalText {
  primaryNames?: string;
  milestoneDate?: string;
  coordinates?: string;
  customQuote?: string;
  typographyFont?: string;
  engravingPlacement?: string;
}

export interface CustomOrder {
  id: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  recipient: string;
  relationship: CustomOrderRelationship;
  occasion: CustomOrderOccasion;
  budgetRange: string;
  productType: string;
  customDesign?: string;
  personalText?: CustomOrderPersonalText;
  uploadedImages?: string[];
  referenceImages?: string[];
  uploadedFiles: string[];
  selectedColors: string[];
  preferredColors?: string[];
  preferredStyle?: string;
  customOptions?: Record<string, string>;
  selectedPackagingId?: string;
  giftNote?: string;
  customerNotes?: string;
  description: string;
  targetDeliveryDate?: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  designProofUrl?: string;
  status: CustomOrderStatus;
  timeline?: CustomOrderTrackingEvent[];
  quote?: CustomOrderQuote;
  messages: CustomOrderMessage[];
  assignedAdminId?: string;
  assignedAdminName?: string;
  assignedAdminRole?: string;
  conversationStatus?: CustomOrderConversationStatus;
  unreadCountCustomer?: number;
  unreadCountAdmin?: number;
  createdAt: string;
  updatedAt: string;
}

export type CoupleThemeCategory = 'Romantic' | 'Minimal' | 'Luxury' | 'Cute' | 'Dark' | 'Elegant' | 'Anniversary' | 'Wedding' | 'Proposal' | 'Long Distance';

export interface CoupleWebsiteTemplate {
  id: string;
  name: string;
  version?: string;
  themeCategory: CoupleThemeCategory;
  description: string;
  price: number;
  previewImage: string;
  demoSubdomain: string;
  features: string[];
  popular?: boolean;
  tags?: string[];
  isActive?: boolean;
  colorPalette?: string[];
  defaultFont?: string;
  releaseDate?: string;
}

export interface CoupleMemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  location?: string;
}

export interface CoupleGuestbookEntry {
  id: string;
  author: string;
  message: string;
  date: string;
  heartsCount?: number;
  approved?: boolean;
}

export interface CoupleWebsiteProject {
  id: string;
  customerId: string;
  subdomain: string;
  templateId: string;
  templateName?: string;
  partner1Name: string;
  partner2Name: string;
  partner1Photo?: string;
  partner2Photo?: string;
  anniversaryDate: string;
  ourStoryTitle: string;
  ourStoryText: string;
  heroTagline: string;
  primaryColor: string;
  secondaryColor?: string;
  fontStyle: string;
  musicTrack?: string;
  musicTitle?: string;
  videoUrl?: string;
  secretMessage?: string;
  photos: string[];
  memories: CoupleMemoryItem[];
  guestbook: CoupleGuestbookEntry[];
  status: 'active' | 'draft' | 'expired';
  isPublished?: boolean;
  customDomain?: string;
  views: number;
  heartsGiven?: number;
  qrCodeUrl?: string;
  createdAt: string;
  expiresAt: string;
}

export type BotPanelCategory = 
  | 'Telegram Bot Panels'
  | 'Discord Bot Panels'
  | 'WordPress Bot Panels'
  | 'Custom Bot Panels'
  | 'Hosting Panels';

export interface BotPanelPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  isPopular?: boolean;
}

export interface BotPanelRequirement {
  title: string;
  detail: string;
  icon?: string;
}

export interface BotPanelHostingInfo {
  specs: string;
  cpu: string;
  ram: string;
  storage: string;
  uptime: string;
  locations: string[];
  pterodactylCompatible: boolean;
  backupFrequency?: string;
  ddosProtection?: string;
}

export interface BotPanelFaq {
  question: string;
  answer: string;
}

export interface BotPanelSupportInfo {
  channel: string;
  responseTime: string;
  docsUrl: string;
  contactEmail: string;
  liveChatAvailable: boolean;
}

export interface BotPanelService {
  id: string;
  slug: string;
  name: string;
  category: BotPanelCategory;
  platform: 'Telegram' | 'Discord' | 'WhatsApp' | 'WordPress' | 'Hosting' | 'Custom';
  shortDesc: string;
  fullDesc: string;
  description?: string;
  icon: string;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  features?: string[];
  categorizedFeatures?: { category: string; items: string[] }[];
  requirements?: BotPanelRequirement[];
  hostingInfo?: BotPanelHostingInfo;
  plans: BotPanelPlan[];
  screenshots: string[];
  demoUrl: string;
  docsUrl: string;
  faqs?: BotPanelFaq[];
  supportInfo?: BotPanelSupportInfo;
  interactiveDemoType?: 'broadcast' | 'moderation' | 'whatsapp_crm' | 'wordpress_bridge' | 'hosting_pterodactyl' | 'custom_builder';
}

export type ApiScopeId = 
  | 'products:read'
  | 'orders:read'
  | 'support:read'
  | 'support:write'
  | 'chat:use'
  | 'custom_orders:read'
  | 'custom_orders:write'
  | 'faq:read'
  | 'couple_websites:read'
  | 'bot_services:read'
  | 'knowledge:read'
  | 'auth:handoff'
  | 'admin:all';

export interface BillingHandoffTicket {
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole?: string;
  planId?: string;
  productId?: string;
  slug?: string;
  billingCycle?: string;
  createdAt: number;
  expiresAt: number; // Single-use 60s TTL
  used: boolean;
  usedAt?: number;
  ipCreated?: string;
  ipRedeemed?: string;
  source: string;
}

export interface ApiKeyScope {
  id: ApiScopeId;
  name: string;
  description: string;
  category: 'Catalog' | 'Orders' | 'Support & Chat' | 'Custom' | 'Knowledge' | 'System';
}

export interface ApiClient {
  id: string;
  name: string;
  clientCode: 'HARCONXS-WEB' | 'HARCONXS-TELEGRAM' | 'HARCONXS-DISCORD' | 'HARCONXS-WORDPRESS' | 'HARCONXS-ADMIN' | string;
  clientType: 'internal_bot' | 'internal_app' | 'admin_cli';
  description: string;
  isActive: boolean;
  rateLimitPerMinute: number;
  defaultScopes: ApiScopeId[];
  createdAt: string;
  updatedAt: string;
  status?: string;
  allowedScopes?: (ApiScopeId | string)[];
}

export interface ApiKeyRecord {
  id: string;
  clientId?: string;
  clientName?: string;
  name: string;
  keyPrefix?: string;
  keyHash?: string; // SHA-256 hash (never plaintext)
  scopes?: (ApiScopeId | string)[];
  status: 'active' | 'revoked' | 'expired';
  rateLimit: number; // requests per minute
  usageCount?: number;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  revokedAt?: string;
  lastIp?: string;
  // Legacy aliases for backward compatibility:
  prefix?: string;
  lastUsed?: string;
  requestCount?: number;
  permissions?: string[];
}

export interface ApiUsageLog {
  id: string;
  requestId: string;
  keyId: string;
  clientId: string;
  clientName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  responseTimeMs: number;
  ipAddress: string;
  userAgent: string;
  scopesUsed?: string[];
  timestamp: string;
  errorMessage?: string;
}

export interface ApiHealthResponse {
  status: 'operational' | 'degraded' | 'maintenance';
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  system: {
    database: 'healthy' | 'degraded' | 'disconnected';
    realtime: 'healthy' | 'degraded';
    storage: 'healthy' | 'degraded';
    aiBotEngine: 'healthy' | 'degraded';
    rateLimiter: 'active';
  };
  environment: 'production' | 'preview' | 'development';
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  articleCount?: number;
}

export interface KnowledgeArticle {
  id: string;
  categoryId: string;
  categoryName?: string;
  slug: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  views: number;
  helpfulVotes: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  question: string;
  answer: string;
  tags: string[];
  orderIndex: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiChatRequest {
  message: string;
  conversationId?: string;
  clientId?: string;
  customerId?: string;
  customerEmail?: string;
  sessionToken?: string;
  context?: {
    channel?: 'telegram' | 'discord' | 'wordpress' | 'web';
    userId?: string;
    userEmail?: string;
    customerId?: string;
    customerEmail?: string;
    customerName?: string;
    isLoggedIn?: boolean;
    orderId?: string;
    cartItemCount?: number;
    currentView?: string;
    createTicketDirectly?: boolean;
  };
}

export interface ApiChatAction {
  label: string;
  view: string;
  productId?: string;
  orderId?: string;
  actionType?: 'navigate' | 'create_ticket' | 'open_modal';
}

export interface ApiChatResponse {
  reply: string;
  conversationId: string;
  action?: ApiChatAction;
  actions?: ApiChatAction[];
  suggestions?: string[];
  relatedProducts?: {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    url: string;
  }[];
  orderLookupResult?: {
    orderNumber: string;
    status: string;
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    itemsSummary?: string;
    trackingUrl?: string;
  };
  ticketOffer?: {
    offer: boolean;
    subject?: string;
    category?: 'General' | 'Order Issue' | 'Custom Project' | 'Couple Website' | 'Bot Panel' | 'Payment / Refund';
    reason?: string;
  };
  createdTicket?: {
    id: string;
    ticketNumber: string;
    subject: string;
    status: string;
  };
  sourcesUsed?: string[];
  modelUsed?: string;
  confidence: number;
  timestamp: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue?: number;
  maxUsage?: number;
  currentUsage: number;
  expiresAt: string;
  active: boolean;
}
export type Coupon = DiscountCoupon;

export interface AffiliateProfile {
  id: string;
  userId: string;
  referralCode: string;
  referralLink: string;
  commissionRate: number;
  clicks: number;
  ordersCount: number;
  totalRevenue: number;
  totalCommission: number;
  pendingPayout: number;
  paidPayout: number;
  status: 'active' | 'pending' | 'suspended';
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: 'General' | 'Order Issue' | 'Custom Project' | 'Couple Website' | 'Bot Panel' | 'Payment / Refund';
  priority: 'low' | 'medium' | 'high';
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  messages: {
    id: string;
    sender: 'customer' | 'support' | 'ai';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
  runCount: number;
  lastRun?: string;
}

export interface SystemPolicy {
  id: string;
  title: string;
  slug: string;
  version: string;
  lastUpdated: string;
  content: string;
}
export type PolicyDocument = SystemPolicy;

export interface PopupBannerConfig {
  enabled: boolean;
  title: string;
  description: string;
  couponCode: string;
  ctaText: string;
  ctaView: string;
  imageUrl: string;
  badgeText: string;
  expiresAt?: string;
  showDelaySeconds: number;
}

export interface BillingPortalConfig {
  portalUrl: string;
  provider: 'Razorpay Subscriptions' | 'Stripe Billing' | 'Whop' | 'LemonSqueezy' | 'Custom Node Portal';
  publicKey: string;
  webhookSecret: string;
  redirectMode: 'new_tab' | 'iframe_modal';
  syncActiveSubscriptions: boolean;
  status: 'connected' | 'disconnected' | 'testing';
  lastSynced?: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  category: 'Craftsmanship' | 'Tutorial' | 'Sanctuary' | 'Bot Panels';
  views: string;
  publishedDate: string;
  featured?: boolean;
}

export interface SocialLinksConfig {
  youtube: string;
  instagram: string;
  telegram: string;
  discord: string;
  twitter: string;
  github: string;
  whatsapp: string;
}

export type EmailNotificationType = 
  | 'account_created'
  | 'order_confirmed'
  | 'shipping_update'
  | 'custom_order_quote'
  | 'delivery_success';

export interface EmailNotification {
  id: string;
  type: EmailNotificationType;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  previewSnippet: string;
  htmlContent: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'queued';
  orderNumber?: string;
  trackingNumber?: string;
  carrier?: string;
  metadata?: Record<string, any>;
}

export interface SupabaseConfigStatus {
  isConnected: boolean;
  url: string;
  isCustomUrl: boolean;
  lastSyncedAt?: string;
  tableCounts: {
    orders: number;
    products: number;
    customOrders: number;
    coupleWebsites: number;
    emailLogs: number;
  };
}

export interface ThemeConfig {
  siteName: string;
  tagline: string;
  announcementText: string;
  announcementDiscountCode: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  fontFamily: 'serif' | 'sans' | 'mono';
  bannerImageUrl: string;
  logoImageUrl?: string;
  footerTagline: string;
  supportEmail: string;
  supportPhone: string;
  freeShippingThreshold: number;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: 'INR';
  paymentMethod: 'UPI / QR' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery';
  paymentGateway: 'Razorpay PG' | 'Cashfree UPI' | 'PhonePe Switch' | 'Direct Atelier';
  status: 'Paid' | 'Authorized' | 'Settled' | 'Refunded';
  gstNumber?: string;
  cgst: number;
  sgst: number;
  date: string;
  itemsSummary: string;
  receiptUrl?: string;
}

