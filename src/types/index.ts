export type CategoryType = 'men' | 'women' | 'unisex' | 'couples' | 'custom' | 'digital' | 'bot-panels';
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
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  likes: number;
  images?: string[];
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
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cod' | 'crypto';
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
  timeline: OrderTrackingEvent[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export type CustomOrderRelationship = 'Me' | 'Friend' | 'Best Friend' | 'Girlfriend' | 'Boyfriend' | 'Husband' | 'Wife' | 'Partner' | 'Family' | 'Other';

export type CustomOrderOccasion = 'Birthday' | 'Anniversary' | 'Valentine\'s Day' | 'Wedding' | 'Proposal' | 'Friendship' | 'Graduation' | 'Celebration' | 'Surprise' | 'Other';

export type CustomOrderStatus = 'Submitted' | 'Quoted' | 'Paid' | 'In Design' | 'Production' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';

export interface CustomOrderQuote {
  id: string;
  amount: number;
  shippingFee: number;
  turnaroundDays: number;
  notes: string;
  packagingIncluded: string;
  validUntil: string;
  status: 'pending_review' | 'accepted' | 'rejected' | 'revised';
}

export interface CustomOrderMessage {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
  attachments?: string[];
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
  description: string;
  preferredColors: string[];
  preferredStyle: string;
  uploadedFiles: string[];
  selectedPackagingId?: string;
  targetDeliveryDate?: string;
  status: CustomOrderStatus;
  quote?: CustomOrderQuote;
  messages: CustomOrderMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CoupleWebsiteTemplate {
  id: string;
  name: string;
  themeCategory: 'Romantic' | 'Minimal' | 'Luxury' | 'Cute' | 'Dark' | 'Elegant' | 'Anniversary' | 'Wedding' | 'Proposal';
  description: string;
  price: number;
  previewImage: string;
  demoSubdomain: string;
  features: string[];
  popular?: boolean;
}

export interface CoupleWebsiteProject {
  id: string;
  customerId: string;
  subdomain: string;
  templateId: string;
  partner1Name: string;
  partner2Name: string;
  anniversaryDate: string;
  ourStoryTitle: string;
  ourStoryText: string;
  heroTagline: string;
  primaryColor: string;
  fontStyle: string;
  musicTrack?: string;
  photos: string[];
  memories: {
    id: string;
    title: string;
    date: string;
    description: string;
    image?: string;
  }[];
  guestbook: {
    id: string;
    author: string;
    message: string;
    date: string;
  }[];
  status: 'active' | 'draft' | 'expired';
  customDomain?: string;
  views: number;
  createdAt: string;
  expiresAt: string;
}

export interface BotPanelService {
  id: string;
  name: string;
  platform: 'Telegram' | 'Discord' | 'WhatsApp' | 'WordPress' | 'Hosting' | 'Custom';
  shortDesc: string;
  fullDesc: string;
  icon: string;
  badge?: string;
  plans: {
    id: string;
    name: string;
    price: number;
    billingPeriod: 'monthly' | 'yearly' | 'lifetime';
    features: string[];
    isPopular?: boolean;
  }[];
  screenshots: string[];
  demoUrl: string;
  docsUrl: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  rateLimit: number;
  requestCount: number;
  permissions: string[];
  status: 'active' | 'revoked';
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

