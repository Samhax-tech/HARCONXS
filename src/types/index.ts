export type CategoryType = 'men' | 'women' | 'unisex' | 'couples' | 'custom' | 'digital' | 'digital-services' | 'bot-panels';
export type ProductCategory = CategoryType;

export type ProductBadge = 'Best Seller' | 'New' | 'Trending' | 'Limited' | 'Low Stock' | 'Almost Sold Out' | 'Sale' | 'Personalized' | 'Custom' | 'Digital' | 'Couples' | 'Featured';

export interface ProductVariant {
  id: string;
  sku: string;
  name?: string;
  productId?: string;
  productName?: string;
  barcode?: string;
  title?: string;
  size?: string;
  color?: string;
  material?: string;
  options?: {
    size?: string;
    material?: string;
    color?: string;
    finish?: string;
    engraving?: string;
  };
  price: number;
  compareAtPrice?: number;
  cost?: number;
  costPrice?: number;
  inventory?: number;
  stock?: number;
  weightGrams?: number;
  image?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export type Review = ProductReview;

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
  isFeatured?: boolean;
  createdAt: string;

  // Convenience aliases
  costPrice?: number;
  stock?: number;
  inStock?: boolean;
  description?: string;
  imageUrl?: string;
  
  // Production SEO & OpenGraph Fields
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageUrl?: string;
  
  // Google Merchant Center & Catalog Catalog Attributes
  gtin?: string;
  barcode?: string;
  mpn?: string;
  googleProductCategory?: string;
  condition?: 'new' | 'refurbished' | 'used';
  availability?: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';
  gender?: 'unisex' | 'male' | 'female';
  ageGroup?: 'adult' | 'all_ages' | 'teen';
  material?: string;
  color?: string;
  size?: string;
  customLabel0?: string;
  customLabel1?: string;
  customLabel2?: string;
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
    phone?: string;
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
  ownerId?: string;
  ownerEmail?: string;
  title?: string;
  subdomain: string;
  templateId: string;
  templateName?: string;
  partner1Name: string;
  partner2Name: string;
  partner1?: string;
  partner2?: string;
  partner1Photo?: string;
  partner2Photo?: string;
  anniversaryDate: string;
  ourStoryTitle: string;
  ourStoryText: string;
  story?: string;
  welcomeMessage?: string;
  heroTagline: string;
  primaryColor: string;
  secondaryColor?: string;
  fontStyle: string;
  musicTrack?: string;
  musicTitle?: string;
  videoUrl?: string;
  secretMessage?: string;
  passcode?: string;
  passwordProtected?: boolean;
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
  | 'search:query'
  | 'orders:read'
  | 'support:read'
  | 'support:write'
  | 'chat:use'
  | 'chat:interact'
  | 'custom_orders:read'
  | 'custom_orders:write'
  | 'faq:read'
  | 'couple_websites:read'
  | 'bot_services:read'
  | 'knowledge:read'
  | 'system:health'
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

export interface PolicySection {
  heading: string;
  content: string;
  body?: string;
}

export type ContentPublicationStatus = 'draft' | 'published' | 'scheduled';

export interface PolicyVersion {
  id: string;
  policyId: string;
  version: string;
  title: string;
  content: string;
  sections?: PolicySection[];
  status: 'draft' | 'published' | 'archived';
  changeSummary?: string;
  createdBy: string;
  isAiDrafted: boolean;
  requiresApproval: boolean;
  approvedBy?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  // DB aliases
  policy_id?: string;
  version_number?: string;
  is_ai_drafted?: boolean;
  requires_approval?: boolean;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at?: string;
}

export interface PolicyRecord {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: 'legal' | 'customer_care' | 'company' | 'governance';
  status: ContentPublicationStatus;
  scheduledAt?: string | null;
  version: string;
  lastUpdated: string;
  content: string;
  sections?: PolicySection[];
  requiresAdminApproval: boolean;
  approvedBy?: string | null;
  approvedAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  versions?: PolicyVersion[];
  // DB aliases
  scheduled_at?: string | null;
  requires_admin_approval?: boolean;
  approved_by?: string | null;
  approved_at?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SystemPolicy = PolicyRecord;
export type PolicyDocument = PolicyRecord;

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

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationCategory = 
  | 'account' 
  | 'orders' 
  | 'custom' 
  | 'custom_orders'
  | 'websites' 
  | 'couple_websites'
  | 'support' 
  | 'security'
  | 'account_security'
  | 'marketing'
  | 'system';

export type NotificationType =
  | 'ACCOUNT_CREATED'
  | 'EMAIL_VERIFICATION'
  | 'ORDER_CREATED'
  | 'PAYMENT_SUCCESSFUL'
  | 'ORDER_PROCESSING'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'REFUND_PROCESSED'
  | 'CUSTOM_ORDER_MESSAGE'
  | 'CUSTOM_QUOTE_ISSUED'
  | 'QUOTE_ACCEPTED'
  | 'COUPLE_WEBSITE_PURCHASE'
  | 'WEBSITE_PUBLISHED'
  | 'SUPPORT_REPLY'
  | 'API_KEY_CREATED'
  | 'API_KEY_REVOKED';

export interface AppNotification {
  id: string;
  userId?: string;
  recipientEmail?: string;
  recipientName?: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  emailSent?: boolean;
  emailDispatched?: boolean;
  emailId?: string;
  emailTemplateId?: string;
  priority?: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  actionView?: string;
}

export type EmailNotificationType = 
  | 'account_created'
  | 'email_verification'
  | 'order_confirmed'
  | 'payment_successful'
  | 'order_processing'
  | 'shipping_update'
  | 'order_delivered'
  | 'refund_processed'
  | 'custom_order_message'
  | 'custom_order_quote'
  | 'quote_accepted'
  | 'couple_website_purchase'
  | 'website_published'
  | 'support_reply'
  | 'api_key_created'
  | 'api_key_revoked'
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
  status: 'delivered' | 'sent' | 'queued' | 'simulated';
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

export interface ThemeBrandSettings {
  siteName: string;
  tagline: string;
  logoImageUrl?: string;
  faviconUrl?: string;
  brandStatement: string;
  copyrightText: string;
  establishedYear: string;
  showWordmarkIfNoLogo: boolean;
}

export interface ThemeTypographySettings {
  fontFamily: 'serif' | 'sans' | 'mono' | 'display';
  headingFont: 'Playfair Display' | 'Cinzel' | 'Cormorant' | 'Plus Jakarta Sans' | 'Inter' | 'Space Mono';
  bodyFont: 'Plus Jakarta Sans' | 'Inter' | 'System Sans' | 'Lora' | 'Space Mono';
  baseFontSize: '14px' | '15px' | '16px' | '18px';
  headingLetterSpacing: 'tighter' | 'tight' | 'normal' | 'wide' | 'widest';
  headingFontWeight: 'medium' | 'semibold' | 'bold' | 'extrabold';
  bodyLineHeight: 'snug' | 'normal' | 'relaxed' | 'loose';
}

export interface ThemeColorSettings {
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
  textMutedColor: string;
  themeMode: 'dark' | 'light' | 'midnight' | 'obsidian' | 'champagne';
}

export interface ThemeButtonSettings {
  buttonRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  buttonStyle: 'solid' | 'glow' | 'outline' | 'gradient' | 'luxury-pill';
  buttonShadow: 'none' | 'sm' | 'md' | 'lg' | 'colored';
  buttonTransform: 'none' | 'uppercase' | 'capitalize';
  buttonFontWeight: 'medium' | 'semibold' | 'bold';
  primaryBtnBg?: string;
  primaryBtnText?: string;
  secondaryBtnBg?: string;
  secondaryBtnText?: string;
}

export interface ThemeCardSettings {
  cardRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  cardBackground: 'solid' | 'glass' | 'translucent' | 'deep';
  cardBorder: 'none' | 'subtle' | 'accent' | 'highlight';
  cardShadow: 'none' | 'sm' | 'md' | 'lg' | 'hover-lift';
  productImageAspect: 'square' | 'portrait' | 'wide';
  imageHoverZoom: boolean;
  showQuickViewBadge: boolean;
}

export interface ThemeHeaderSettings {
  headerSticky: boolean;
  headerBlur: boolean;
  headerStyle: 'minimal' | 'luxury' | 'bordered' | 'floating';
  headerHeight: 'compact' | 'normal' | 'tall';
  showAnnouncementInHeader: boolean;
  showCurrencySelector: boolean;
  showSearchIcon: boolean;
  headerBgColor?: string;
}

export interface ThemeFooterSettings {
  footerTagline: string;
  footerStyle: 'classic' | 'modern' | 'minimal' | 'atelier-columns';
  showPaymentBadges: boolean;
  showSocialLinks: boolean;
  showNewsletterBox: boolean;
  supportEmail: string;
  supportPhone: string;
  footerBgColor?: string;
}

export interface ThemeAnnouncementSettings {
  announcementEnabled: boolean;
  announcementText: string;
  announcementDiscountCode: string;
  announcementBgColor: string;
  announcementTextColor: string;
  announcementLinkUrl: string;
  announcementLinkText: string;
  announcementSticky: boolean;
  freeShippingThreshold: number;
}

export interface ThemeLayoutSettings {
  containerMaxWidth: 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-screen-2xl' | 'max-w-full';
  sectionSpacing: 'compact' | 'normal' | 'spacious' | 'airy';
  gridGap: 'sm' | 'md' | 'lg' | 'xl';
  showSectionDividers: boolean;
}

export interface ThemeResponsiveSettings {
  mobileProductColumns: 1 | 2;
  mobileNavbarStyle: 'drawer' | 'bottom-bar' | 'compact';
  mobileScaling: 'compact' | 'normal' | 'comfortable';
}

export interface ThemeSeoSettings {
  seoTitleTemplate: string;
  defaultMetaDescription: string;
  ogImageUrl: string;
  metaKeywords: string[];
  twitterHandle: string;
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

  // Granular settings categories
  brand: ThemeBrandSettings;
  typography: ThemeTypographySettings;
  colors: ThemeColorSettings;
  buttons: ThemeButtonSettings;
  cards: ThemeCardSettings;
  header: ThemeHeaderSettings;
  footer: ThemeFooterSettings;
  announcement: ThemeAnnouncementSettings;
  layout: ThemeLayoutSettings;
  responsive: ThemeResponsiveSettings;
  seo: ThemeSeoSettings;

  // Metadata
  version?: number;
  status?: 'draft' | 'published';
  updatedAt?: string;
  updatedBy?: string;
}

export interface ThemeRevision {
  id: string;
  revision_name: string;
  notes?: string;
  created_at: string;
  created_by?: string;
  config: ThemeConfig;
  is_published?: boolean;
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

// ==============================================================================
// 12. HARCONXS PRIVATE WEBSITE EDITOR & SECTION SCHEMAS
// ==============================================================================

export type PageSectionType = 
  | 'hero'
  | 'announcement_bar'
  | 'banners'
  | 'categories'
  | 'featured_products'
  | 'best_sellers'
  | 'new_arrivals'
  | 'custom_gifts'
  | 'couple_websites'
  | 'bot_panels'
  | 'support'
  | 'trust_benefits'
  | 'testimonials'
  | 'reviews'
  | 'faq'
  | 'cta'
  | 'newsletter'
  | 'footer';

export interface PageSectionSettings {
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  backgroundColor?: string;
  backgroundGradient?: string;
  textColor?: string;
  containerWidth?: 'narrow' | 'normal' | 'wide' | 'full' | 'contained';
  showDivider?: boolean;
  animation?: 'fade' | 'slide-up' | 'none';
  customCssClass?: string;
  titleScale?: 'normal' | 'large' | 'display';
  alignment?: 'left' | 'center' | 'right';
  fontStyle?: 'serif' | 'sans';
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

export interface PageSection<TSettings = PageSectionSettings, TContent = any> {
  id: string;
  pageId: string;
  sectionType: PageSectionType;
  sortOrder: number;
  isHidden: boolean;
  settings: TSettings;
  content: TContent;
  name?: string;
  // DB column aliases for backward compatibility:
  page_id?: string;
  section_type?: PageSectionType;
  sort_order?: number;
  is_hidden?: boolean;
  is_visible?: boolean;
  settings_json?: any;
  content_json?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageRecord {
  id: string;
  slug: string;
  title: string;
  status: ContentPublicationStatus;
  scheduledAt?: string | null;
  meta?: {
    description?: string;
    keywords?: string;
    ogImage?: string;
    customHeadHtml?: string;
  };
  sections: PageSection[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // DB aliases:
  scheduled_at?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PageRevision {
  id: string;
  pageId: string;
  versionNumber: number;
  revisionName: string;
  snapshotData: {
    page: Partial<PageRecord>;
    sections: PageSection[];
  };
  createdBy?: string;
  createdAt: string;
  // DB aliases:
  page_id?: string;
  version_number?: number;
  revision_name?: string;
  snapshot_data?: any;
  snapshot_json?: any;
  created_by?: string;
  created_at?: string;
}

export type EditorDeviceViewport = 'desktop' | 'tablet' | 'mobile';

// ==============================================================================
// 13. FULL E-COMMERCE ADMINISTRATION SUITE DATA TYPES
// ==============================================================================

export type AdminSectionKey =
  | 'overview'
  // Catalog / Products
  | 'products'
  | 'categories'
  | 'variants'
  | 'inventory'
  // Orders
  | 'orders'
  | 'order-details'
  | 'returns'
  | 'refunds'
  | 'shipping'
  // Customers
  | 'customers'
  | 'customer-details'
  | 'addresses'
  | 'reviews'
  | 'support'
  // Custom Orders
  | 'custom'
  | 'quotes'
  | 'custom-order-chat'
  | 'packaging'
  // Couple Websites
  | 'couple-templates'
  | 'couple-projects'
  // Bot Panels
  | 'bot-plans'
  | 'bot-services'
  // Private API
  | 'api-clients'
  | 'api-keys'
  | 'api-scopes'
  | 'api-usage'
  | 'api-logs'
  // Marketing
  | 'coupons'
  | 'affiliates'
  | 'gift-cards'
  | 'loyalty'
  // Content
  | 'pages'
  | 'page-builder'
  | 'faq'
  | 'policies'
  | 'seo'
  // Analytics
  | 'analytics-sales'
  | 'analytics-customers'
  | 'analytics-products'
  | 'analytics-traffic'
  | 'analytics-conversions'
  // Settings
  | 'settings-general'
  | 'settings-payments'
  | 'settings-shipping'
  | 'settings-tax'
  | 'settings-notifications'
  | 'settings-email'
  | 'settings-staff'
  | 'settings-roles'
  | 'settings-permissions'
  | 'settings-audit-logs'
  // Supabase SQL Studio
  | 'sql-editor';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  displayOrder: number;
  featured: boolean;
  parentCategoryId?: string | null;
  metaTitle?: string;
  metaDescription?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  location: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  reorderQuantity: number;
  costPerUnit: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestockedAt: string;
}

export interface InventoryMovementLog {
  id: string;
  inventoryId: string;
  sku: string;
  productName: string;
  changeType: 'purchase_order' | 'order_fulfillment' | 'return_restock' | 'adjustment' | 'damaged_writeoff';
  quantityDelta: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  rmaNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    reason: 'damaged' | 'wrong_item' | 'defective_craft' | 'changed_mind' | 'size_mismatch';
    condition: 'unopened' | 'opened' | 'damaged' | 'missing_parts';
  }[];
  requestedRefundAmount: number;
  status: 'requested' | 'approved' | 'in_transit' | 'received' | 'inspected' | 'restocked' | 'rejected' | 'refunded';
  returnCarrier?: string;
  returnTrackingAwb?: string;
  inspectionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundRecord {
  id: string;
  refundNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'processed' | 'pending' | 'failed';
  gateway: 'Razorpay PG' | 'Stripe' | 'Manual Bank Transfer' | 'Store Credit';
  gatewayTransactionId: string;
  initiatedBy: string;
  createdAt: string;
}

export interface ShippingCarrierInfo {
  id: string;
  name: string;
  code: 'bluedart' | 'fedex' | 'dhl' | 'delhivery' | 'india_post' | 'custom';
  accountNumber: string;
  apiKey: string;
  isActive: boolean;
  trackingBaseUrl: string;
  supportsLiveTracking: boolean;
  ratePerKg: number;
  deliveryDaysEstimate: string;
}

export interface ShippingZoneConfig {
  id: string;
  name: string;
  regions: string[];
  baseRate: number;
  freeShippingAbove: number;
  estimatedDays: string;
  active: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'standard' | 'vip' | 'royal_sovereign';
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive' | 'flagged';
  tags: string[];
  notes?: string;
  rewardPoints: number;
  customOrdersCount: number;
  createdAt: string;
}

export interface CustomerAddressItem {
  id: string;
  customerId: string;
  customerName: string;
  addressType: 'shipping' | 'billing';
  isDefault: boolean;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CustomQuoteRecord {
  id: string;
  quoteNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  projectTitle: string;
  estimatedPrice: number;
  depositRequired: number;
  leadTimeDays: number;
  packagingName: string;
  specsSummary: string;
  cadProofUrl?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface GiftCardRecord {
  id: string;
  code: string;
  initialBalance: number;
  currentBalance: number;
  currency: 'INR';
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message?: string;
  status: 'active' | 'redeemed' | 'disabled' | 'expired';
  expiresAt: string;
  createdAt: string;
}

export interface LoyaltyTierInfo {
  tier: 'standard' | 'vip' | 'royal_sovereign';
  name: string;
  minSpend: number;
  pointsMultiplier: number;
  perks: string[];
  color: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'support_agent' | 'fulfillment_specialist' | 'marketing_lead' | 'financial_controller';
  status: 'active' | 'invited' | 'suspended';
  lastLoginAt?: string;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
  department: string;
  createdAt: string;
}

export interface AdminRoleDefinition {
  id: string;
  roleKey: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  memberCount: number;
}

export interface AuditLogRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  status: 'ALLOWED' | 'DENIED';
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

export interface PaymentMethodsConfig {
  // Cash on Delivery
  codEnabled: boolean;
  codMaxLimit: number;
  codFee: number;
  codOtpRequired: boolean;
  codRestrictedCategories: string[];

  // UPI Payments
  upiEnabled: boolean;
  upiVpa: string;
  upiMerchantName: string;
  upiDynamicQr: boolean;
  upiAutoVerify: boolean;

  // Credit / Debit Cards
  cardsEnabled: boolean;
  cardProvider: 'razorpay' | 'stripe' | 'payu' | 'custom';
  razorpayKeyId: string;
  razorpayKeySecret: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  cardsInternational: boolean;
  cardsEmiAvailable: boolean;
  cards3DSecure: boolean;

  // Netbanking & Wallets
  netbankingEnabled: boolean;
  walletsEnabled: boolean;
  
  // Luxury Crypto / Web3
  cryptoEnabled: boolean;
  cryptoWalletAddress: string;

  // General Gateway Environment
  testMode: boolean;
  updatedAt?: string;
  updatedBy?: string;
}




