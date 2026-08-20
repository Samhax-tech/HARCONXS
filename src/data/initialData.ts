import {
  Product,
  ProductReview,
  PackagingOption,
  CoupleWebsiteTemplate,
  BotPanelService,
  DiscountCoupon,
  Order,
  CustomOrder,
  CoupleWebsiteProject,
  ApiKeyRecord,
  SupportTicket,
  AutomationRule,
  SystemPolicy,
  PopupBannerConfig,
  BillingPortalConfig,
  YouTubeVideoItem,
  SocialLinksConfig,
  EmailNotification,
  BillingInvoice,
  KnowledgeCategory,
  KnowledgeArticle,
  FaqItem
} from '../types';


export const INITIAL_PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: 'pkg-standard',
    name: 'Minimal Eco Kraft Box',
    description: 'Recyclable matte earth box with embossed satin ribbon and tissue wrap.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pkg-luxury',
    name: 'Velvet Midnight Luxury Box',
    description: 'Black velvet lined rigid box with gold foil lettering and magnetic closure.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
    isPopular: true,
  },
  {
    id: 'pkg-couples',
    name: 'Romantic Eternal Rose Capsule',
    description: 'Preserved crimson rose inside crystal case with hidden drawer for jewelry or cards.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&auto=format&fit=crop&q=80',
    isPopular: true,
  },
  {
    id: 'pkg-birthday',
    name: 'Surprise Confetti Pop Box',
    description: 'Interactive unboxing with hidden photo cards, fairy lights, and pop-up gift card.',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // COUPLES & PERSONALIZED
  {
    id: 'prod-couple-1',
    sku: 'HX-CPL-001',
    name: 'Custom Coordinates Matching Bracelet Set',
    slug: 'custom-coordinates-matching-bracelet-set',
    shortDescription: 'Hand-engraved matte black titanium and rose gold bracelets with your special location & date.',
    fullDescription: 'Celebrate where your story began. Crafted with hypoallergenic surgical-grade titanium, custom laser engraved with precise GPS coordinates, significant dates, or secret roman numerals.',
    price: 68.00,
    compareAtPrice: 95.00,
    cost: 18.00,
    inventory: 48,
    category: 'couples',
    subcategory: 'Jewelry',
    tags: ['Couples', 'Anniversary', 'Engraved', 'Matching', 'Valentine'],
    badges: ['Best Seller', 'Personalized', 'Couples'],
    brand: 'HARCONXS Studio',
    productType: 'personalized',
    images: [
      'https://images.unsplash.com/photo-1611591475841-e40889c20a1f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-1', sku: 'HX-CPL-001-BLK', name: 'Matte Obsidian / Rose Gold', price: 68.00, inventory: 25 },
      { id: 'v-2', sku: 'HX-CPL-001-SLV', name: 'Brushed Silver / Pure Gold', price: 74.00, inventory: 23 }
    ],
    rating: 4.9,
    reviewCount: 142,
    isPersonalizable: true,
    personalizationFields: {
      allowNames: true,
      allowDate: true,
      allowMessage: true,
      allowFontSelection: true,
      allowColorSelection: true
    },
    weight: '0.15 kg',
    dimensions: '18cm - 24cm adjustable',
    featured: true,
    createdAt: '2026-06-10T12:00:00Z'
  },
  {
    id: 'prod-couple-2',
    sku: 'HX-CPL-002',
    name: 'Custom Acrylic Night Light Song Plaque',
    slug: 'custom-acrylic-night-light-song-plaque',
    shortDescription: 'Illuminated optical acrylic with your favorite song code, couple photo, and warm LED walnut wood base.',
    fullDescription: 'Capture your soundtrack. Scannable audio barcode linked to Spotify or Apple Music, crisp HD UV printed couple portrait, nestled on hand-carved solid walnut with dimmable touch control.',
    price: 49.00,
    compareAtPrice: 65.00,
    cost: 12.50,
    inventory: 64,
    category: 'couples',
    subcategory: 'Decor',
    tags: ['Couples', 'Gifts', 'Personalized', 'Music', 'Romantic'],
    badges: ['Trending', 'Personalized'],
    brand: 'HARCONXS Studio',
    productType: 'personalized',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 96,
    isPersonalizable: true,
    personalizationFields: {
      allowNames: true,
      allowDate: true,
      allowMessage: true,
      allowPhoto: true,
      allowFontSelection: true
    },
    featured: true,
    createdAt: '2026-06-15T12:00:00Z'
  },
  {
    id: 'prod-men-1',
    sku: 'HX-MEN-101',
    name: 'Chronograph Minimalist Automatic Watch',
    slug: 'chronograph-minimalist-automatic-watch',
    shortDescription: 'Sapphire crystal glass, Japanese automatic movement, aerospace-grade brushed steel casing.',
    fullDescription: 'Engineered for understated dominance. Features 50M water resistance, exhibition caseback, quick-release Italian calfskin leather and steel mesh interchangeable straps.',
    price: 189.00,
    compareAtPrice: 240.00,
    cost: 65.00,
    inventory: 30,
    category: 'men',
    subcategory: 'Watches',
    tags: ['Men', 'Luxury', 'Watches', 'Accessories'],
    badges: ['Featured', 'Sale'],
    brand: 'HARCONXS Elite',
    productType: 'physical',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-m1', sku: 'HX-MEN-101-BLK', name: 'Gunmetal / Charcoal Dial', price: 189.00, inventory: 15 },
      { id: 'v-m2', sku: 'HX-MEN-101-SLV', name: 'Silver / Glacier Blue Dial', price: 199.00, inventory: 15 }
    ],
    rating: 5.0,
    reviewCount: 88,
    weight: '0.45 kg',
    featured: true,
    createdAt: '2026-07-01T12:00:00Z'
  },
  {
    id: 'prod-women-1',
    sku: 'HX-WMN-201',
    name: 'Celestial Opal & Diamond Star Pendant',
    slug: 'celestial-opal-diamond-star-pendant',
    shortDescription: '18K gold vermeil with iridescent Australian opal and certified lab-grown accent diamonds.',
    fullDescription: 'Dainty yet radiant. Hand-faceted natural opal center that changes shimmer in shifting light, suspended on an adjustable 16-18 inch delicate diamond-cut cable chain.',
    price: 115.00,
    compareAtPrice: 150.00,
    cost: 38.00,
    inventory: 22,
    category: 'women',
    subcategory: 'Jewelry',
    tags: ['Women', 'Jewelry', 'Pendant', 'Gold', 'Gift'],
    badges: ['Best Seller', 'Limited'],
    brand: 'HARCONXS Atelier',
    productType: 'physical',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591475841-e40889c20a1f?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 112,
    featured: true,
    createdAt: '2026-07-05T12:00:00Z'
  },
  {
    id: 'prod-unisex-1',
    sku: 'HX-UNI-301',
    name: 'Tactical Modular Crossbody Sling',
    slug: 'tactical-modular-crossbody-sling',
    shortDescription: 'Waterproof Cordura nylon with magnetic Fidlock buckle and RFID-blocking hidden tech compartment.',
    fullDescription: 'The ultimate urban carry. Expandable gusset system transitions seamlessly from slim everyday pocket organizer to 4L tech sling accommodating iPad Mini, passports, chargers, and sunglasses.',
    price: 79.00,
    compareAtPrice: 99.00,
    cost: 24.00,
    inventory: 40,
    category: 'unisex',
    subcategory: 'Bags & EDC',
    tags: ['Unisex', 'Everyday Carry', 'Tech', 'Travel'],
    badges: ['Trending'],
    brand: 'HARCONXS Tech',
    productType: 'physical',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 73,
    featured: true,
    createdAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'prod-dig-1',
    sku: 'HX-DIG-401',
    name: 'Couple Website Interactive Experience - Lifetime Hosted',
    slug: 'couple-website-interactive-experience',
    shortDescription: 'Custom personalized interactive love sanctuary website with live anniversary counter, music player & memories timeline.',
    fullDescription: 'Gift a digital memory that lasts forever. Choose from romantic designer themes, customize with your photos, love notes, interactive countdown, and custom domain or subdomain.',
    price: 49.00,
    compareAtPrice: 89.00,
    cost: 2.00,
    inventory: 9999,
    category: 'digital',
    subcategory: 'Websites',
    tags: ['Couple Website', 'Digital', 'Anniversary', 'Gifts', 'Web'],
    badges: ['Best Seller', 'Digital', 'Couples'],
    brand: 'HARCONXS Digital',
    productType: 'digital',
    images: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewCount: 204,
    featured: true,
    createdAt: '2026-07-15T12:00:00Z'
  },
  {
    id: 'prod-bot-1',
    sku: 'HX-BOT-501',
    name: 'Telegram & Discord Automation Bot Panel Suite',
    slug: 'telegram-discord-automation-bot-panel-suite',
    shortDescription: 'Turnkey cloud bot management dashboard with live member analytics, auto-moderation, payments & broadcast engine.',
    fullDescription: 'Comprehensive management portal for high-performance Discord & Telegram communities. Includes instant webhooks, auto-responder AI integration, tiered subscription access, and uptime monitoring.',
    price: 39.00,
    compareAtPrice: 69.00,
    cost: 5.00,
    inventory: 9999,
    category: 'bot-panels',
    subcategory: 'Bot Panels',
    tags: ['Bots', 'Telegram', 'Discord', 'API', 'Automation'],
    badges: ['Digital', 'Featured'],
    brand: 'HARCONXS Cloud',
    productType: 'digital',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 65,
    featured: true,
    createdAt: '2026-07-20T12:00:00Z'
  },
  {
    id: 'prod-cust-1',
    sku: 'HX-CUST-601',
    name: 'Custom Commissioned Bespoke Gift Experience',
    slug: 'custom-commissioned-bespoke-gift-experience',
    shortDescription: 'Have our artisans & engineers fabricate your custom physical item, custom jewelry, or private web platform from scratch.',
    fullDescription: 'You imagine it, we build it. Submit your design briefs, reference sketches, budget, and recipient story. Get a rapid quotation with 3D design mockups, material selection, and dedicated production tracking.',
    price: 99.00,
    compareAtPrice: 150.00,
    cost: 30.00,
    inventory: 50,
    category: 'custom',
    subcategory: 'Bespoke Orders',
    tags: ['Custom Order', 'Handmade', 'Bespoke', 'Personalized'],
    badges: ['Custom', 'Featured'],
    brand: 'HARCONXS Atelier',
    productType: 'custom_service',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewCount: 41,
    featured: true,
    createdAt: '2026-07-25T12:00:00Z'
  }
];

export const INITIAL_COUPLE_TEMPLATES: CoupleWebsiteTemplate[] = [
  {
    id: 'tmpl-romantic-sunset',
    name: 'Golden Hour Eternal',
    version: 'v2.4',
    themeCategory: 'Romantic',
    description: 'Warm champagne & sunset palette with floating heart particles, background acoustic soundtrack, live relationship timer, and parallax photo memories.',
    price: 39.00,
    previewImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'alex-and-sophia',
    features: ['Live Love Counter (Years, Months, Days, Secs)', 'Soundtrack Player', 'Parallax Story Timeline', 'Interactive Love Quiz', 'Live Guestbook & Love Letters'],
    popular: true,
    isActive: true,
    tags: ['Best Seller', 'Romantic', 'Floating Hearts'],
    colorPalette: ['#e11d48', '#fb7185', '#ffe4e6', '#0f172a'],
    defaultFont: 'Playfair Display',
    releaseDate: '2026-08-01'
  },
  {
    id: 'tmpl-luxury-monochrome',
    name: 'Atelier Noir & Rose Gold',
    version: 'v3.1',
    themeCategory: 'Luxury',
    description: 'Editorial high-fashion layout with minimalist serif typography, video hero, dark aesthetic, and interactive memory archive with guestbook.',
    price: 49.00,
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'julian-and-elena',
    features: ['Film Roll Photo Stream', 'Milestone Map Pinning', 'Secret Password Note', 'Ultra Fast CDN Hosting', 'Custom QR Code Card'],
    popular: true,
    isActive: true,
    tags: ['Luxury', 'Editorial', 'Dark Mode'],
    colorPalette: ['#f59e0b', '#d97706', '#18181b', '#09090b'],
    defaultFont: 'Cinzel',
    releaseDate: '2026-08-05'
  },
  {
    id: 'tmpl-cute-pastel',
    name: 'Strawberry Milk & Stars',
    version: 'v1.9',
    themeCategory: 'Cute',
    description: 'Playful aesthetic with custom polaroid stickers, romantic mood trackers, anniversary notifications, and pastel colorway.',
    price: 34.00,
    previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'leo-and-maya',
    features: ['Polaroid Drag-and-Drop', 'Virtual Love Letterbox', 'Spotify Playlist Sync', 'Cute Floating Badges', 'Mobile App Shortcut'],
    popular: false,
    isActive: true,
    tags: ['Cute', 'Polaroids', 'Pastel'],
    colorPalette: ['#ec4899', '#f472b6', '#fdf2f8', '#1e1b4b'],
    defaultFont: 'Dancing Script',
    releaseDate: '2026-07-20'
  },
  {
    id: 'tmpl-minimal-clean',
    name: 'Nordic Clean & Pure',
    version: 'v2.0',
    themeCategory: 'Minimal',
    description: 'Ultra-clean white and slate aesthetic emphasizing typography, curated photo galleries, and chronological relationship milestones.',
    price: 29.00,
    previewImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'marcus-and-chloe',
    features: ['Typography Focus', 'Full-screen Photo Lightbox', 'Relationship Stats Counter', 'Lightweight <50ms Load', 'Custom Subdomain'],
    popular: false,
    isActive: true,
    tags: ['Minimal', 'Fast', 'Nordic'],
    colorPalette: ['#0284c7', '#38bdf8', '#f8fafc', '#0f172a'],
    defaultFont: 'Inter',
    releaseDate: '2026-07-15'
  },
  {
    id: 'tmpl-wedding-elegance',
    name: 'Vows of Eternity',
    version: 'v2.2',
    themeCategory: 'Wedding',
    description: 'Royal botanical wedding & anniversary edition with RSVP guestbook, event itinerary schedule, Google Maps venue pinning, and vow books.',
    price: 59.00,
    previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'david-and-claire',
    features: ['RSVP Guestbook with Hearts', 'Wedding Itinerary Timeline', 'Registry Links', 'Custom Music Player', 'Countdown to Ceremony'],
    popular: true,
    isActive: true,
    tags: ['Wedding', 'Ceremony', 'RSVP'],
    colorPalette: ['#10b981', '#34d399', '#ecfdf5', '#064e3b'],
    defaultFont: 'Cormorant Garamond',
    releaseDate: '2026-08-10'
  },
  {
    id: 'tmpl-long-distance',
    name: 'Across Timezones & Oceans',
    version: 'v1.5',
    themeCategory: 'Long Distance',
    description: 'Designed specifically for long-distance partners with dual live timezone clocks, flight countdowns, voice memo embed, and memory constellation.',
    price: 39.00,
    previewImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'liam-and-hannah',
    features: ['Dual Timezone Live Clocks', 'Next Reunion Countdown', 'Flight Ticket Souvenir', 'Digital Postcards Archive', 'Secret Messages Box'],
    popular: true,
    isActive: true,
    tags: ['Long Distance', 'Timezones', 'Constellation'],
    colorPalette: ['#8b5cf6', '#a78bfa', '#ede9fe', '#2e1065'],
    defaultFont: 'Montserrat',
    releaseDate: '2026-08-12'
  }
];

export const INITIAL_BOT_PANEL_SERVICES: BotPanelService[] = [
  // 1. Telegram Bot Panels
  {
    id: 'bot-tg-vip',
    slug: 'telegram-community-vip-panel',
    name: 'Telegram Community & VIP Monetization Panel',
    category: 'Telegram Bot Panels',
    platform: 'Telegram',
    shortDesc: 'Automated subscription gates, auto-expiring invite links, crypto & card payouts, broadcast scheduler.',
    fullDesc: 'The ultimate control center for Telegram channel owners and community leaders. Protect exclusive channels with automatic member verification, recurring billing webhooks, anti-forwarding shields, and interactive bot keyboards.',
    description: 'Empower your Telegram community with enterprise-grade subscription gating, one-time passes, instant automated channel invites, and seamless payment gateways. Fully syncs with Stripe, Razorpay, Crypto, and your custom Pterodactyl hosting node.',
    icon: 'Send',
    badge: 'Best Seller',
    rating: 4.95,
    reviewsCount: 142,
    features: [
      'Auto-expiring 1-click single-use invite links',
      'Automated kick/ban upon subscription lapse or chargeback',
      'Multi-tier VIP channel management (Gold, Diamond, Lifetime)',
      'Scheduled broadcast campaign manager with rich media',
      'Built-in Telegram mini-app web dashboard embed',
      'Pterodactyl node auto-restart & health monitoring'
    ],
    categorizedFeatures: [
      {
        category: 'Subscription & Payment Gating',
        items: [
          'Direct Stripe, Crypto & Razorpay Webhook Handlers',
          'Automated renewal reminders sent via bot PM',
          'One-click subscriber revocation on cancellation',
          'Affiliate tracking sub-bots for group referrers'
        ]
      },
      {
        category: 'Channel Security & Anti-Leak',
        items: [
          'Anti-forwarding and restricted content flag enforcement',
          'Dynamic patron watermark overlay injection',
          'Anti-spam and CAPTCHA user join verification',
          'Silent raid protection mode'
        ]
      },
      {
        category: 'Broadcasting & Engagement',
        items: [
          'Rich inline keyboard button customizer',
          'A/B testing campaign analytics & read receipts',
          'Multi-channel simultaneous message dispatcher',
          'Automated welcome video & onboarding sequences'
        ]
      }
    ],
    requirements: [
      { title: 'Telegram Bot Token', detail: 'Obtained freely from @BotFather in 30 seconds', icon: 'Bot' },
      { title: 'Channel Admin Privileges', detail: 'Bot must be added as Administrator with "Invite Users via Link" rights', icon: 'Shield' },
      { title: 'HTTPS Webhook SSL', detail: 'Provided automatically by HARCONXS Cloud Pterodactyl Container', icon: 'Lock' }
    ],
    hostingInfo: {
      specs: 'Dedicated Pterodactyl Docker Node',
      cpu: '200% AMD EPYC Dedicated vCPU',
      ram: '2 GB DDR5 RAM',
      storage: '20 GB NVMe Gen4 Storage',
      uptime: '99.98% Guaranteed SLA',
      locations: ['Frankfurt, Germany', 'Singapore', 'Mumbai, India', 'Ashburn, USA'],
      pterodactylCompatible: true,
      backupFrequency: 'Daily Automated Cloud Snapshots',
      ddosProtection: 'Path.net 12 Tbps DDoS Filtering'
    },
    plans: [
      { id: 'p1', name: 'Starter Bot', price: 19.00, billingPeriod: 'monthly', features: ['Up to 2 Channels', 'Instant Webhooks', 'Stripe & Crypto Gates', '24/7 Cloud Uptime'] },
      { id: 'p2', name: 'Pro Scaler', price: 49.00, billingPeriod: 'monthly', isPopular: true, features: ['Unlimited Channels', 'Automated Content Broadcasts', 'Custom AI Support Agent', 'Affiliate Tracking Sub-bots', 'Priority Cloud VPS'] },
      { id: 'p3', name: 'Lifetime Suite', price: 299.00, billingPeriod: 'lifetime', features: ['Full Source Code Included', 'Dedicated Server Deployment', 'Custom Branding & Domain', 'Lifetime Updates & Support'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-tg.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/tg-panel',
    faqs: [
      { question: 'How quickly does the Telegram bot activate after billing?', answer: 'Activation is fully automated. As soon as your order completes on billingharconxs.vercel.app, your Pterodactyl container boots up within 60 seconds with your initial license key.' },
      { question: 'Can I connect multiple Telegram channels and groups?', answer: 'Yes! The Pro Scaler and Lifetime plans support unlimited public and private channels, discussion groups, and VIP tiers.' },
      { question: 'What payment gateways does the bot support for membership?', answer: 'The panel supports native Stripe Checkout, Razorpay, LemonSqueezy, USDT (TRC20/ERC20), and manual admin approvals.' }
    ],
    supportInfo: {
      channel: 'Dedicated Telegram VIP Concierge & Discord Ticket Portal',
      responseTime: 'Average under 15 minutes (24/7/365)',
      docsUrl: 'https://docs.harconxs.com/tg-panel',
      contactEmail: 'concierge@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'broadcast'
  },
  {
    id: 'bot-tg-ai-store',
    slug: 'telegram-ai-support-commerce-bot',
    name: 'Telegram AI Concierge & Direct Commerce Bot',
    category: 'Telegram Bot Panels',
    platform: 'Telegram',
    shortDesc: 'Grounded conversational AI shop closer, real-time order tracking lookup, live catalog browsing.',
    fullDesc: 'Transform your Telegram channel into a high-converting storefront. Powered by HARCONXS AI Engine, this bot answers customer questions, verifies orders securely, suggests matching products, and escalates complex queries to human agents.',
    description: 'Equip your brand with an intelligent 24/7 Telegram sales assistant. Customers can browse your complete product catalog, search by keywords, view luxury unboxing videos, and check carrier delivery statuses directly in chat.',
    icon: 'Bot',
    badge: 'AI Powered',
    rating: 4.88,
    reviewsCount: 96,
    features: [
      'Grounded AI conversational engine trained on your store catalog',
      'Safe patron order verification with masked customer privacy',
      'In-chat catalog browser with dynamic inline purchase buttons',
      'Automatic escalation to central Supabase support tickets',
      'Multi-language translation for international patrons',
      'Comprehensive conversion analytics & question insights'
    ],
    categorizedFeatures: [
      {
        category: 'Conversational Commerce',
        items: [
          'Context-aware product recommendations based on budget',
          'Instant answers to shipping, returns, and sizing policies',
          'Direct Telegram Pay and external checkout link generator',
          'Abandoned cart nudge sequences'
        ]
      },
      {
        category: 'Support & Order Tracking',
        items: [
          'Safe order lookup via Order # and patron email/phone',
          'Live carrier tracking milestones and delivery estimates',
          'One-click ticket filing into central admin dashboard',
          'Human support agent live takeover switch'
        ]
      }
    ],
    requirements: [
      { title: 'Telegram Bot API Token', detail: 'Token from @BotFather', icon: 'Bot' },
      { title: 'HARCONXS Private API Key', detail: 'Provided in your admin dashboard with products:read scope', icon: 'Key' }
    ],
    hostingInfo: {
      specs: 'Cloud Docker Instance with High-Speed Gemini Bridge',
      cpu: '150% Dedicated vCPU',
      ram: '1.5 GB RAM',
      storage: '15 GB SSD Storage',
      uptime: '99.95% Guaranteed SLA',
      locations: ['Frankfurt, Germany', 'Mumbai, India', 'Singapore'],
      pterodactylCompatible: true,
      backupFrequency: 'Daily Cloud Snapshots',
      ddosProtection: 'Enterprise Cloudflare Shield'
    },
    plans: [
      { id: 'ptga1', name: 'Starter AI', price: 25.00, billingPeriod: 'monthly', features: ['1,000 AI Conversations/mo', 'Catalog Sync', 'Safe Order Lookup', 'Cloud Hosting Included'] },
      { id: 'ptga2', name: 'Enterprise AI', price: 69.00, billingPeriod: 'monthly', isPopular: true, features: ['Unlimited Conversations', 'Custom Fine-Tuned Persona', 'Human Agent Inbox', 'Priority Node Speed'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-tg-ai.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/tg-ai',
    faqs: [
      { question: 'Does the bot hallucinate prices or fake orders?', answer: 'No. The bot queries the real-time HARCONXS central API before quoting any prices or tracking information.' },
      { question: 'Can my human team take over the chat?', answer: 'Yes, with a single button click in your admin console, the AI gracefully pauses and transfers the customer to your live agent.' }
    ],
    supportInfo: {
      channel: 'Telegram Support Concierge',
      responseTime: 'Under 15 minutes',
      docsUrl: 'https://docs.harconxs.com/tg-ai',
      contactEmail: 'support@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'broadcast'
  },

  // 2. Discord Bot Panels
  {
    id: 'bot-dc-hub',
    slug: 'discord-moderation-ticket-engine',
    name: 'Discord Multi-Server Moderation & Ticket Engine',
    category: 'Discord Bot Panels',
    platform: 'Discord',
    shortDesc: 'Enterprise ticket transcripts, XP levelling system, customizable reaction roles, AI mod filters.',
    fullDesc: 'Manage hundreds of Discord servers from one unified, sleek web interface. Includes interactive web-based dashboard, role sync with Patreon/Shopify, voice channel generators, and audio streaming bot modules.',
    description: 'The definitive Discord operations suite for gaming networks, crypto DAOs, luxury brand communities, and creator servers. Features automated thread ticketing, HTML transcript generation, reaction roles, and automated moderation.',
    icon: 'Shield',
    badge: 'Top Rated',
    rating: 4.96,
    reviewsCount: 178,
    features: [
      'Interactive Web-Based Discord Server Configuration Portal',
      'HTML transcript generation uploaded to secure S3 storage',
      'Intelligent anti-raid, link filtering, and CAPTCHA gateway',
      'Automatic role assignment based on store purchases',
      'Custom slash commands generator (/track, /catalog, /support)',
      'High-uptime Pterodactyl container with 0% socket drop rate'
    ],
    categorizedFeatures: [
      {
        category: 'Support Ticketing & Customer Service',
        items: [
          'Button and dropdown ticket creation panel',
          'Direct integration with central Supabase tickets table',
          'Automatic staff assignment based on ticket category',
          'Interactive patron star rating upon ticket close'
        ]
      },
      {
        category: 'Security & Auto-Moderation',
        items: [
          'AI-powered toxic message and slur removal',
          'Discord Invite link scrubber and anti-phishing filter',
          'New account age gates and avatar verification',
          'Automatic slowmode during high-traffic raids'
        ]
      }
    ],
    requirements: [
      { title: 'Discord Application & Bot Token', detail: 'Created from Discord Developer Portal', icon: 'Bot' },
      { title: 'Server Administrator Permission', detail: 'To invite the bot and manage server roles', icon: 'Shield' }
    ],
    hostingInfo: {
      specs: 'Ultra-low Latency Discord Gateway Container',
      cpu: '250% Intel Xeon / AMD EPYC Core',
      ram: '2 GB High-Speed RAM',
      storage: '25 GB SSD',
      uptime: '99.99% Discord Gateway WebSocket Uptime',
      locations: ['Ashburn (US-East)', 'Frankfurt (EU-Central)', 'Singapore'],
      pterodactylCompatible: true,
      backupFrequency: 'Real-time database replication',
      ddosProtection: 'Pterodactyl Shield'
    },
    plans: [
      { id: 'pd1', name: 'Guild Basic', price: 15.00, billingPeriod: 'monthly', features: ['Up to 3 Discord Servers', 'Ticket Transcripts', 'Anti-Raid Auto Shield', 'Custom Embed Builder'] },
      { id: 'pd2', name: 'Empire Pro', price: 39.00, billingPeriod: 'monthly', isPopular: true, features: ['Unlimited Guilds', 'AI Auto-Response Bot', 'Custom Bot Avatar & Token', 'Voice Channel Auto-Host', 'Store Role Sync'] },
      { id: 'pd3', name: 'Enterprise Cluster', price: 120.00, billingPeriod: 'monthly', features: ['Dedicated Server Node', 'Custom Bot Code Modifications', 'White-Label Branding', 'Dedicated Account Manager'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-dc.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/dc-panel',
    faqs: [
      { question: 'Where are ticket transcripts stored?', answer: 'Transcripts are compiled into clean, searchable HTML files and archived securely with encrypted links for your staff.' },
      { question: 'Can the bot grant Discord roles when a customer purchases on our website?', answer: 'Yes! Link your HARCONXS API or webhooks to automatically assign VIP or Backer roles instantly on checkout.' }
    ],
    supportInfo: {
      channel: 'Discord Official Server & Developer Channel',
      responseTime: 'Under 10 minutes',
      docsUrl: 'https://docs.harconxs.com/dc-panel',
      contactEmail: 'discord-ops@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'moderation'
  },
  {
    id: 'bot-dc-economy',
    slug: 'discord-community-economy-pterodactyl',
    name: 'Discord Economy, Rewards & Pterodactyl Server Linker',
    category: 'Discord Bot Panels',
    platform: 'Discord',
    shortDesc: 'Virtual currency wallet, reward shop, daily coin multipliers & automated Pterodactyl server controls.',
    fullDesc: 'Engage your gaming and tech community with a complete virtual economy. Users earn server coins through chat activity and rewarded events, then redeem coins for real Pterodactyl game server temporary instances or role upgrades.',
    description: 'The ultimate gamification and hosting bridge for Discord. Connects directly to your Pterodactyl panel API so members can start, stop, restart, and monitor their servers directly through Discord slash commands.',
    icon: 'Terminal',
    badge: 'Gaming & Economy',
    rating: 4.91,
    reviewsCount: 84,
    features: [
      'Virtual Coin Economy with Leaderboards, Gambling, and Daily Streaks',
      'Pterodactyl Panel API integration (/server start, /server status)',
      'Automated temporary 7-day server provisioning via coin redemption',
      'Discord OAuth account binding to client billing profile',
      'Anti-cheat and multi-account coin exploit detection'
    ],
    categorizedFeatures: [
      {
        category: 'Pterodactyl Integration',
        items: [
          'Real-time CPU, RAM, and disk utilization graphs in Discord embeds',
          'Automatic server suspension when coin credits expire',
          '1-click server power management for authorized players',
          'Server backup trigger from Discord channel'
        ]
      }
    ],
    requirements: [
      { title: 'Discord Bot Application', detail: 'With message content and server members intents', icon: 'Bot' },
      { title: 'Pterodactyl Client/Application API Key', detail: 'To execute server commands on your hosting node', icon: 'Key' }
    ],
    hostingInfo: {
      specs: 'Dedicated Node with WebSocket Listener',
      cpu: '200% AMD Ryzen 9 Core',
      ram: '2 GB RAM',
      storage: '20 GB NVMe Storage',
      uptime: '99.98% SLA',
      locations: ['Frankfurt, Germany', 'Ashburn, USA'],
      pterodactylCompatible: true,
      backupFrequency: 'Every 6 hours',
      ddosProtection: 'Game-Optimized DDoS Filter'
    },
    plans: [
      { id: 'pdc_eco1', name: 'Community Node', price: 22.00, billingPeriod: 'monthly', features: ['500 Server Members', 'Economy & Leaderboard', 'Pterodactyl Server Link', '24/7 Uptime'] },
      { id: 'pdc_eco2', name: 'Network Pro', price: 55.00, billingPeriod: 'monthly', isPopular: true, features: ['Unlimited Members', 'Multiple Pterodactyl Panels', 'Custom Coin Shop', 'Priority Node Allocation'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-dc-eco.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/dc-economy',
    faqs: [
      { question: 'Is my Pterodactyl master API key safe?', answer: 'Yes. API keys are stored securely server-side inside your isolated Pterodactyl container environment.' }
    ],
    supportInfo: {
      channel: 'Discord Community Support Hub',
      responseTime: 'Under 20 minutes',
      docsUrl: 'https://docs.harconxs.com/dc-economy',
      contactEmail: 'gaming-support@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'hosting_pterodactyl'
  },

  // 3. WordPress Bot Panels
  {
    id: 'bot-wp-bridge',
    slug: 'wordpress-central-support-catalog-bridge',
    name: 'WordPress & WooCommerce Central Support & Catalog Bridge',
    category: 'WordPress Bot Panels',
    platform: 'WordPress',
    shortDesc: 'Drop-in WordPress plugin for real-time catalog sync, safe order tracking widget, and central ticketing.',
    fullDesc: 'Seamlessly link your WordPress or WooCommerce website to the central HARCONXS backend. Provides shortcodes and Gutenberg blocks for interactive order status tracking, FAQ accordion sync, and direct support ticket submission without cluttering your WordPress database.',
    description: 'Lightweight, ultra-fast PHP & React bridge plugin for WordPress. Offloads catalog queries and customer support tickets to the central high-speed Supabase engine, keeping your WordPress site blazing fast and database-lean.',
    icon: 'Globe',
    badge: 'WooCommerce Ready',
    rating: 4.89,
    reviewsCount: 112,
    features: [
      'Shortcodes: [harconxs_order_tracker], [harconxs_support_widget], [harconxs_catalog]',
      'Zero database bloat: all orders & tickets sync to central cloud database',
      'Safe patron privacy shield: requires matching Order # and Billing Email',
      'Full compatibility with Elementor, Divi, Gutenberg, and classic themes',
      'Automatic AJAX polling and responsive mobile layouts',
      'Automated plugin updates pushed directly from HARCONXS CDN'
    ],
    categorizedFeatures: [
      {
        category: 'WooCommerce & Catalog Sync',
        items: [
          'Bi-directional product inventory & pricing sync',
          'Customizable checkout redirect with origin tracking',
          'Rich SEO Schema markup for catalog items',
          'Automated category taxonomy mirroring'
        ]
      },
      {
        category: 'Customer Self-Service Widgets',
        items: [
          'Embeddable order lookup form with carrier tracking URLs',
          'Instant support ticket creation directly into admin inbox',
          'Live AI customer concierge floating chat widget',
          'Customizable color palette matching your WordPress theme'
        ]
      }
    ],
    requirements: [
      { title: 'WordPress 5.8 or higher', detail: 'PHP 7.4, 8.0, 8.1, or 8.2 compatible', icon: 'Globe' },
      { title: 'HARCONXS Private API Key', detail: 'Configured in WordPress Settings > HARCONXS Bridge', icon: 'Key' }
    ],
    hostingInfo: {
      specs: 'Cloud API Bridge Gateway & CDN Asset Delivery',
      cpu: 'Global Edge Anycast Network',
      ram: 'Shared Edge Memory Cache',
      storage: 'Unlimited Cloud Sync',
      uptime: '99.99% API SLA',
      locations: ['Global Cloudflare Edge (280+ cities)'],
      pterodactylCompatible: true,
      backupFrequency: 'Continuous Cloud Backup',
      ddosProtection: 'Enterprise Web Application Firewall'
    },
    plans: [
      { id: 'pwp1', name: 'Single Site', price: 14.00, billingPeriod: 'monthly', features: ['1 WordPress / WooCommerce Site', 'Catalog & Order Widgets', 'Central Ticket Sync', 'Automatic Plugin Updates'] },
      { id: 'pwp2', name: 'Agency 5-Pack', price: 39.00, billingPeriod: 'monthly', isPopular: true, features: ['Up to 5 Client Websites', 'White-Label Plugin Branding', 'Priority API Rate Limit', 'Developer API Webhooks'] },
      { id: 'pwp3', name: 'Unlimited Agency Lifetime', price: 249.00, billingPeriod: 'lifetime', features: ['Unlimited Client Sites', 'Full PHP/React Source Code', 'Lifetime License Keys', 'Direct Developer Support'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-wp.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/wp-bridge',
    faqs: [
      { question: 'Will this slow down my WordPress website?', answer: 'No. The plugin communicates asynchronously via client-side AJAX/REST APIs, ensuring zero impact on your core WordPress TTFB or page render speeds.' },
      { question: 'Can I customize the design of the shortcodes?', answer: 'Yes! The widgets inherit your theme’s typography and offer simple CSS class hooks and custom color pickers in WP-Admin.' }
    ],
    supportInfo: {
      channel: 'WordPress Developer Ticket Portal',
      responseTime: 'Under 30 minutes',
      docsUrl: 'https://docs.harconxs.com/wp-bridge',
      contactEmail: 'wp-plugins@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'wordpress_bridge'
  },
  {
    id: 'bot-wp-social',
    slug: 'wordpress-automation-social-sync',
    name: 'WordPress Auto-Publisher & Social Bot Sync',
    category: 'WordPress Bot Panels',
    platform: 'WordPress',
    shortDesc: 'Auto-publish blog posts, product drops, and flash discounts directly to Telegram & Discord channels.',
    fullDesc: 'Supercharge your content distribution. Every time you publish a new product, blog post, or flash sale in WordPress, this bot automatically creates visually rich embeds and dispatches them across your Telegram and Discord channels in milliseconds.',
    description: 'Eliminate manual cross-posting. Features customized embed templates, scheduled social queueing, automated hashtag insertion, and UTM campaign tracking for every social click.',
    icon: 'Share2',
    badge: 'Automation',
    rating: 4.82,
    reviewsCount: 65,
    features: [
      'Instant post dispatch on WordPress publish / update',
      'Custom Telegram MarkdownV2 and Discord Rich Embed formats',
      'Automated featured image resizing and thumbnail attachment',
      'Product price drop and coupon code broadcast triggers',
      'Detailed click-through analytics and referral tracking'
    ],
    categorizedFeatures: [
      {
        category: 'Social Channels',
        items: [
          'Telegram Channels and VIP Groups',
          'Discord Announcement and Community Channels',
          'WhatsApp Business Broadcast Channels',
          'Twitter / X and Mastodon webhooks'
        ]
      }
    ],
    requirements: [
      { title: 'WordPress 5.0+', detail: 'REST API enabled (default on standard installs)', icon: 'Globe' },
      { title: 'Bot Tokens / Webhook URLs', detail: 'For target Telegram/Discord channels', icon: 'Key' }
    ],
    hostingInfo: {
      specs: 'Cloud Automation Dispatcher',
      cpu: '100% vCPU',
      ram: '1 GB RAM',
      storage: '10 GB SSD',
      uptime: '99.95% SLA',
      locations: ['Frankfurt, Germany', 'Ashburn, USA'],
      pterodactylCompatible: true,
      backupFrequency: 'Daily Snapshots',
      ddosProtection: 'Standard DDoS Shield'
    },
    plans: [
      { id: 'pwps1', name: 'Starter Sync', price: 12.00, billingPeriod: 'monthly', features: ['1 WP Site', '2 Social Channels', 'Instant Publishing', 'Basic Analytics'] },
      { id: 'pwps2', name: 'Power Publisher', price: 29.00, billingPeriod: 'monthly', isPopular: true, features: ['5 WP Sites', 'Unlimited Channels', 'Custom Embed Builder', 'UTM Analytics'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-wp-social.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/wp-social',
    faqs: [
      { question: 'Can I customize the message text before it sends?', answer: 'Yes, you can define template variables like {post_title}, {price}, {discount_code}, and {permalink}.' }
    ],
    supportInfo: {
      channel: 'Support Ticket System',
      responseTime: 'Under 1 hour',
      docsUrl: 'https://docs.harconxs.com/wp-social',
      contactEmail: 'social-bot@harconxs.com',
      liveChatAvailable: false
    },
    interactiveDemoType: 'broadcast'
  },

  // 4. Custom Bot Panels
  {
    id: 'bot-custom-suite',
    slug: 'custom-enterprise-bot-suite',
    name: 'Custom Enterprise Multi-Platform Bot & Architecture',
    category: 'Custom Bot Panels',
    platform: 'Custom',
    shortDesc: 'Bespoke microservices, custom database integrations, proprietary CRM connectors & dedicated container setup.',
    fullDesc: 'Have a specialized automation requirement? Our senior software architects build custom bot solutions tailored specifically to your business workflows. From proprietary stock market alert bots to custom crypto smart contract event listeners and multi-channel customer CRM integrations.',
    description: 'Full-cycle bespoke bot engineering. Includes requirements scoping, private architecture design, high-concurrency Node.js/Python microservices, custom dashboard frontend, and private Pterodactyl container deployment.',
    icon: 'Layers',
    badge: 'Bespoke Solution',
    rating: 5.0,
    reviewsCount: 38,
    features: [
      'Custom architecture designed specifically for your business logic',
      'Cross-platform execution across Telegram, Discord, WhatsApp & Web',
      'Integration with your existing PostgreSQL, MySQL, Supabase or REST APIs',
      'Dedicated high-performance Pterodactyl cloud node with SLA guarantee',
      'Full source code ownership and intellectual property transfer',
      'Dedicated DevOps engineer and 24/7 priority incident response'
    ],
    categorizedFeatures: [
      {
        category: 'Custom Engineering Process',
        items: [
          'Detailed technical specification & milestone delivery',
          'Private GitHub repository with CI/CD deployment pipeline',
          'Unit & integration automated test suites',
          'Comprehensive API documentation & admin training session'
        ]
      },
      {
        category: 'Enterprise Infrastructure',
        items: [
          'Isolated Docker container cluster on high-frequency NVMe hardware',
          'Zero-downtime rolling container deployments',
          'Custom telemetry dashboard with error alerts via PagerDuty',
          'Custom domain name and SSL certificates'
        ]
      }
    ],
    requirements: [
      { title: 'Project Scope Brief', detail: 'Overview of required integrations and user workflows', icon: 'Layers' },
      { title: 'Target Platform Credentials', detail: 'API keys or developer access for services to be integrated', icon: 'Key' }
    ],
    hostingInfo: {
      specs: 'Custom Scalable Cloud Cluster (Pterodactyl / Kubernetes)',
      cpu: 'Up to 8 Dedicated vCPUs',
      ram: 'Up to 16 GB DDR5 RAM',
      storage: '100+ GB NVMe Storage',
      uptime: '99.99% Enterprise SLA',
      locations: ['Global Custom Region Deployment'],
      pterodactylCompatible: true,
      backupFrequency: 'Hourly Snapshots & Multi-Region Failover',
      ddosProtection: 'Custom Enterprise DDoS Mitigation'
    },
    plans: [
      { id: 'pcust_std', name: 'Custom Milestone Build', price: 499.00, billingPeriod: 'lifetime', features: ['Complete Custom Bot Logic', '2 Platform Integrations', '1 Month Free Cloud Hosting', 'Source Code & Documentation'] },
      { id: 'pcust_ent', name: 'Enterprise Complete Suite', price: 1200.00, billingPeriod: 'lifetime', isPopular: true, features: ['Unlimited Platform Bridges', 'Custom Web Admin Panel', '6 Months Dedicated Hosting', 'Dedicated DevOps Support', 'Full IP Rights Transfer'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-custom.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/custom-bots',
    faqs: [
      { question: 'How long does a custom bot build take?', answer: 'Standard custom builds take 5 to 10 business days depending on complexity, with iterative weekly demo sprints.' },
      { question: 'Do I get the source code?', answer: 'Yes! All custom builds include full Git repository transfer with unrestricted ownership.' }
    ],
    supportInfo: {
      channel: 'Dedicated Slack / Discord Private War-Room Channel',
      responseTime: 'Priority Instant Concierge (< 5 mins)',
      docsUrl: 'https://docs.harconxs.com/custom-bots',
      contactEmail: 'architects@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'custom_builder'
  },
  {
    id: 'bot-custom-trading',
    slug: 'custom-trading-alert-bot',
    name: 'TradingView & Crypto Webhook Execution Bot',
    category: 'Custom Bot Panels',
    platform: 'Custom',
    shortDesc: 'Sub-millisecond TradingView alert parser, multi-exchange order router, and private VIP trade copier.',
    fullDesc: 'Connect your PineScript trading strategies or TradingView webhook alerts directly to Binance, Bybit, KuCoin, or private Telegram/Discord subscriber groups with sub-10ms execution speeds and risk management controls.',
    description: 'Institutional-grade trade execution bot. Parses incoming webhook JSON signals, calculates position sizing based on account balance, places stop-loss / take-profit orders, and broadcasts real-time PnL cards to your VIP channel.',
    icon: 'Zap',
    badge: 'Ultra Fast',
    rating: 4.97,
    reviewsCount: 72,
    features: [
      'Sub-10ms Webhook receiver with IP whitelist protection',
      'Multi-Exchange API support (Binance, Bybit, OKX, MT5 bridge)',
      'Automated position size calculator with max drawdown risk rules',
      'Automated visual PnL card generator for Telegram/Discord channels',
      'Trailing stop-loss & multi-target take-profit order management'
    ],
    categorizedFeatures: [
      {
        category: 'Execution Engine',
        items: [
          'High-frequency WebSocket exchange listeners',
          'Reconnection failover with zero missed signals',
          'Slippage and latency protection algorithms',
          'Encrypted API key vault in container memory'
        ]
      }
    ],
    requirements: [
      { title: 'TradingView Pro / Webhook Alert access', detail: 'To configure webhook alert payloads', icon: 'Zap' },
      { title: 'Exchange API Keys (Trading Only)', detail: 'Never require withdrawal permissions', icon: 'Lock' }
    ],
    hostingInfo: {
      specs: 'Ultra-Low Latency Co-located Trading Node',
      cpu: '300% Dedicated High-Frequency Core',
      ram: '4 GB High-Speed RAM',
      storage: '30 GB NVMe Storage',
      uptime: '99.999% SLA',
      locations: ['Tokyo (Binance Co-located)', 'London (LMAX)', 'Frankfurt'],
      pterodactylCompatible: true,
      backupFrequency: 'Continuous Log Streaming',
      ddosProtection: 'Financial-Grade Shield'
    },
    plans: [
      { id: 'pct_trd1', name: 'Trader Pro', price: 79.00, billingPeriod: 'monthly', features: ['Up to 3 Exchanges', 'Sub-15ms Execution', 'Telegram Alert Copier', 'Risk Management Engine'] },
      { id: 'pct_trd2', name: 'Fund VIP', price: 199.00, billingPeriod: 'monthly', isPopular: true, features: ['Unlimited Accounts', 'Sub-5ms Co-located Node', 'Multi-Tier Copier', 'Dedicated DevOps Line'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-trading.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/trading-bot',
    faqs: [
      { question: 'Is my money safe?', answer: 'Yes. The bot only requires "Trade" permissions on exchange API keys; withdrawal permissions are strictly disabled.' }
    ],
    supportInfo: {
      channel: 'Trader VIP Concierge Channel',
      responseTime: 'Under 10 minutes',
      docsUrl: 'https://docs.harconxs.com/trading-bot',
      contactEmail: 'trading@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'broadcast'
  },

  // 5. Hosting Panels
  {
    id: 'bot-host-pterodactyl',
    slug: 'pterodactyl-bot-hosting-panel',
    name: 'Pterodactyl High-Performance Bot & Cloud Panel',
    category: 'Hosting Panels',
    platform: 'Hosting',
    shortDesc: 'Isolated Docker container hosting for Node.js, Python, Go, and Java bots with web file manager & fast console.',
    fullDesc: 'Deploy and monitor any Discord, Telegram, or custom automation bot in seconds. Powered by the industry-standard Pterodactyl management panel, you get a full web-based terminal, SFTP access, live resource graphs, environment variable editor, and automated crash recovery.',
    description: 'The premier cloud hosting environment designed specifically for bots and game servers. Choose your desired RAM, CPU, and disk size, and our automated provisioning engine delivers your server credentials immediately upon checkout.',
    icon: 'Terminal',
    badge: 'Popular Hosting',
    rating: 4.98,
    reviewsCount: 230,
    features: [
      'Full Pterodactyl v1.11+ web management panel access',
      'Live real-time web console with instant command execution',
      'Interactive visual file manager + secure SFTP connection',
      'One-click runtime installer (Node.js 18/20/22, Python 3.10/3.11/3.12, Java 21, Golang)',
      'Automated server restart on crash or unexpected exit',
      'Schedule cron tasks (daily restarts, database backups, cache clears)'
    ],
    categorizedFeatures: [
      {
        category: 'Server Hardware & Virtualization',
        items: [
          'Enterprise AMD EPYC 9654 & Ryzen 9 7950X processors',
          'PCIe 4.0 NVMe RAID-1 enterprise storage with 7,000 MB/s read/write',
          'DDR5 4800MHz ECC Server Memory',
          'Unmetered 1 Gbps / 10 Gbps redundant uplink bandwidth'
        ]
      },
      {
        category: 'Security & Management',
        items: [
          'Isolated Docker container environment per customer',
          'Permanent Path.net and Voxility 12 Tbps DDoS Filtering',
          'Multi-user sub-user permission delegation for your staff',
          'Environment variable & secret management without code modification'
        ]
      }
    ],
    requirements: [
      { title: 'Any standard Bot Repository or Script', detail: 'Node.js, Python, Java, Go, Rust, or C# supported', icon: 'Terminal' },
      { title: 'Browser or SFTP Client', detail: 'Access your files from any web browser or FileZilla/WinSCP', icon: 'Globe' }
    ],
    hostingInfo: {
      specs: 'Dedicated Pterodactyl Docker Container Instance',
      cpu: 'Up to 400% Dedicated AMD Ryzen / EPYC vCPU',
      ram: '1 GB to 16 GB DDR5 RAM Options',
      storage: '10 GB to 100 GB NVMe Gen4 Storage',
      uptime: '99.99% Guaranteed Network SLA',
      locations: ['Frankfurt, Germany (EU)', 'Mumbai, India (Asia-South)', 'Singapore (Asia-East)', 'Ashburn, USA (US-East)'],
      pterodactylCompatible: true,
      backupFrequency: 'Automated 1-Click Cloud Backups',
      ddosProtection: 'Permanent 12 Tbps Always-On DDoS Mitigation'
    },
    plans: [
      { id: 'php_1gb', name: '1GB Free Trial Panel (20 Coins)', price: 0.00, billingPeriod: 'monthly', features: ['1 GB DDR5 RAM', '100% CPU Core', '1 GB NVMe Storage', '7 Days Duration', '1 Active Panel Limit'] },
      { id: 'php_5gb', name: '5GB Panel', price: 1.78, billingPeriod: 'monthly', isPopular: true, features: ['5 GB DDR5 RAM', '200% AMD vCPU', '25 GB NVMe Storage', 'Full SFTP & Web Console', '99.99% Uptime SLA'] },
      { id: 'php_10gb', name: '10GB Panel', price: 2.09, billingPeriod: 'monthly', features: ['10 GB DDR5 RAM', '300% AMD vCPU', '50 GB NVMe Storage', 'Priority Network Route', 'Free Daily Backups'] },
      { id: 'php_unl', name: 'Unlimited Panel', price: 4.18, billingPeriod: 'monthly', features: ['16 GB RAM Burst', '400% CPU Core', '100 GB NVMe Storage', 'Dedicated IP Option', 'VIP 24/7 Support'] },
      { id: 'php_reseller', name: 'Reseller Panel', price: 7.32, billingPeriod: 'monthly', features: ['Create & Sell Sub-Panels', '50 GB Pool RAM', '250 GB NVMe Pool', 'Custom Subdomain', 'API Provisioning Access'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-pterodactyl.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/pterodactyl',
    faqs: [
      { question: 'How do I upload my bot code?', answer: 'You can upload your files directly through the web-based File Manager (including drag-and-drop zip extraction) or connect via SFTP using FileZilla or WinSCP.' },
      { question: 'What runtimes are supported?', answer: 'We support all major versions of Node.js, Python, Java, Golang, C#, Rust, and custom Docker container images.' },
      { question: 'How does free panel creation with coins work?', answer: 'Users can earn 20 coins through rewarded activities or referrals, then create a temporary 1GB / 7-day free Pterodactyl panel directly from their dashboard!' }
    ],
    supportInfo: {
      channel: 'Pterodactyl DevOps Technical Support & Discord',
      responseTime: 'Under 10 minutes',
      docsUrl: 'https://docs.harconxs.com/pterodactyl',
      contactEmail: 'pterodactyl-ops@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'hosting_pterodactyl'
  },
  {
    id: 'bot-host-docker-vps',
    slug: 'nodejs-python-docker-hosting',
    name: 'Node.js & Python Dedicated Docker Micro-Container Node',
    category: 'Hosting Panels',
    platform: 'Hosting',
    shortDesc: 'Always-on background worker instances, zero-sleep architecture, environment secrets manager, fast restart.',
    fullDesc: 'The lightweight hosting solution for individual developers and agencies running background workers, cron scripts, web scrapers, and bot instances with guaranteed zero sleep timeouts and dedicated memory allocation.',
    description: 'Stop dealing with random free host timeouts. Get dedicated, always-on Docker instances with integrated Git deployment, live stdout/stderr logging streams, and automated health checks.',
    icon: 'Layers',
    badge: 'Developer Choice',
    rating: 4.87,
    reviewsCount: 95,
    features: [
      'Guaranteed 100% Always-On Uptime (Zero Sleep or Hibernation)',
      'Direct Git Repository webhook deploy on git push',
      'Live streaming real-time stdout and stderr log viewer',
      'Custom environment variables with AES-256 encrypted storage',
      'Port binding for express/fastify webhooks with free SSL subdomains'
    ],
    categorizedFeatures: [
      {
        category: 'Developer Experience',
        items: [
          'Automatic npm install / pip install on container startup',
          'Custom startup command flags (e.g. tsx, nodemon, gunicorn)',
          'Automated RAM leak restart threshold configuration',
          'Direct SSH shell terminal access'
        ]
      }
    ],
    requirements: [
      { title: 'package.json or requirements.txt', detail: 'Standard project manifest file', icon: 'Code' },
      { title: 'Main entry point file', detail: 'e.g. index.js, bot.py, server.ts', icon: 'Terminal' }
    ],
    hostingInfo: {
      specs: 'Dedicated Lightweight Cloud Worker Node',
      cpu: '150% Dedicated vCPU',
      ram: '2 GB DDR5 RAM',
      storage: '15 GB SSD Storage',
      uptime: '99.95% SLA',
      locations: ['Frankfurt, Germany', 'Mumbai, India', 'Ashburn, USA'],
      pterodactylCompatible: true,
      backupFrequency: 'Daily Automated Snapshots',
      ddosProtection: 'Enterprise DDoS Shield'
    },
    plans: [
      { id: 'pdock_dev', name: 'Developer Micro', price: 2.50, billingPeriod: 'monthly', features: ['1.5 GB RAM', 'Always-On Worker', 'Live Log Streaming', 'Git Deploy Webhook'] },
      { id: 'pdock_pro', name: 'Cluster Pro', price: 6.00, billingPeriod: 'monthly', isPopular: true, features: ['4 GB RAM', 'Dedicated vCPU', 'Port 443 HTTPS Proxy', 'Priority SLA'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-docker.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/docker-hosting',
    faqs: [
      { question: 'Does my bot go to sleep when idle?', answer: 'Never. Unlike standard free tiers, all HARCONXS bot instances run 24/7 with zero sleeping or throttling.' }
    ],
    supportInfo: {
      channel: 'Dev Support Desk',
      responseTime: 'Under 25 minutes',
      docsUrl: 'https://docs.harconxs.com/docker-hosting',
      contactEmail: 'dev-support@harconxs.com',
      liveChatAvailable: true
    },
    interactiveDemoType: 'hosting_pterodactyl'
  }
];


export const INITIAL_COUPONS: DiscountCoupon[] = [
  {
    id: 'coup-welcome',
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    minOrderValue: 40,
    maxUsage: 1000,
    currentUsage: 214,
    expiresAt: '2027-01-01T00:00:00Z',
    active: true
  },
  {
    id: 'coup-love',
    code: 'FOREVERLOVE',
    type: 'fixed',
    value: 20,
    minOrderValue: 80,
    maxUsage: 500,
    currentUsage: 139,
    expiresAt: '2027-02-14T00:00:00Z',
    active: true
  },
  {
    id: 'coup-ship',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minOrderValue: 50,
    maxUsage: 5000,
    currentUsage: 890,
    expiresAt: '2027-12-31T00:00:00Z',
    active: true
  }
];

export const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'HX-90821',
    customerId: 'cust-hamza',
    customerName: 'Hamza Shahid',
    customerEmail: 'hamzashahid1152901@gmail.com',
    customerPhone: '+1 (555) 234-5678',
    items: [
      {
        id: 'cart-it-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        packaging: INITIAL_PACKAGING_OPTIONS[1],
        personalization: {
          names: 'Hamza & Sarah',
          date: '2024-04-18',
          message: 'Forever & Always',
          fontFamily: 'Playfair Display'
        }
      }
    ],
    subtotal: 68.00,
    discount: 10.20,
    packagingFee: 14.99,
    shippingFee: 0.00,
    tax: 4.80,
    total: 77.59,
    currency: 'USD',
    status: 'Production',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'Hamza Shahid',
      street: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States'
    },
    trackingNumber: 'HX-FEDEX-99824102',
    carrier: 'FedEx Express',
    trackingUrl: 'https://fedex.com/tracking',
    giftNote: 'Happy 2nd Anniversary my love!',
    timeline: [
      { status: 'Pending', timestamp: '2026-08-14T10:00:00Z', description: 'Order placed by customer.' },
      { status: 'Paid', timestamp: '2026-08-14T10:02:00Z', description: 'Payment of $77.59 verified via Stripe.' },
      { status: 'Customization Required', timestamp: '2026-08-14T14:30:00Z', description: 'Engraving details confirmed by laser atelier.' },
      { status: 'Production', timestamp: '2026-08-15T09:00:00Z', description: 'Item currently being engraved and assembled in luxury velvet box.' }
    ],
    riskLevel: 'LOW',
    createdAt: '2026-08-14T10:00:00Z'
  }
];

export const INITIAL_SAMPLE_CUSTOM_ORDERS: CustomOrder[] = [
  {
    id: 'co-10001',
    requestNumber: 'CO-10001',
    customerId: 'cust-hamza',
    customerName: 'Hamza Shahid',
    customerEmail: 'hamzashahid1152901@gmail.com',
    recipient: 'Sarah Al-Mansoor',
    relationship: 'girlfriend',
    occasion: 'Birthday',
    budgetRange: '$150 - $300',
    productType: 'Titanium Mechanical Music Box with Holographic Portrait & Star Map',
    customDesign: 'Celestial Romance & 3D Laser Crystal',
    personalText: {
      primaryNames: 'Hamza & Sarah',
      milestoneDate: '2024-09-15',
      coordinates: '48.8584° N, 2.2945° E',
      customQuote: 'Every note in this melody is a chapter in our infinite story. Forever yours.',
      typographyFont: 'Royal Calligraphy',
      engravingPlacement: 'Inside Lid & Outer Ring Bezel'
    },
    uploadedImages: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'
    ],
    referenceImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
    ],
    uploadedFiles: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
    ],
    selectedColors: ['Deep Rosewood', 'Antique Brass Gold', 'Midnight Obsidian'],
    preferredColors: ['Deep Rosewood', 'Antique Brass Gold', 'Midnight Obsidian'],
    preferredStyle: 'Vintage Romantic Luxury Atelier',
    customOptions: {
      'Mechanism Tune': "Can't Help Falling in Love (18-Note Sankyo Gold)",
      'Engraving Depth': '0.45mm Micro-Diamond Scribed',
      'Finish': 'Triple Hand-Polished Beeswax Satin'
    },
    selectedPackagingId: 'pkg-luxury',
    giftNote: 'To my dearest Sarah, happy birthday! May this little melody remind you of Paris under the stars.',
    customerNotes: 'Please ensure the Eiffel tower star coordinates are centered directly beneath the date.',
    description: 'A hand-polished mahogany and aerospace titanium keepsake box playing "Can\'t Help Falling in Love", with precision laser engraved starry sky coordinates and illuminated crystal couple portrait.',
    targetDeliveryDate: '2026-09-01',
    status: 'QUOTED',
    designProofUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-08-15T10:00:00Z', description: 'Custom order request received by Atelier Intake Engine.', actor: 'customer' },
      { status: 'UNDER_REVIEW', timestamp: '2026-08-15T10:15:00Z', description: 'Senior Master Jeweler Julian assigned to review fabrication tolerances.', actor: 'artisan' },
      { status: 'QUOTED', timestamp: '2026-08-15T12:00:00Z', description: 'Official quotation #quote-co-1 generated with 3D design proof.', actor: 'artisan' }
    ],
    quote: {
      id: 'quote-co-1',
      amount: 175.00,
      shippingFee: 0.00,
      turnaroundDays: 7,
      notes: 'Includes custom 18-note Japanese Sankyo movement, laser-etched crystal photo cube, and Midnight Velvet presentation box with LED illuminate header.',
      packagingIncluded: 'Velvet Midnight Luxury Box',
      validUntil: '2026-08-30',
      status: 'pending_review',
      designProofUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    },
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Hamza Shahid',
        text: 'Hi Harconxs team! Can we make sure the wood has a warm gloss finish and the engraving is crisp?',
        timestamp: '2026-08-15T11:20:00Z'
      },
      {
        id: 'm2',
        sender: 'admin',
        senderName: 'Atelier Master Julian',
        text: 'Hello Hamza! Absolutely. We apply 3 coats of organic beeswax polish for a deep lustrous satin feel. We have prepared quotation #quote-co-1 with CAD rendering for your approval!',
        timestamp: '2026-08-15T12:05:00Z'
      }
    ],
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T12:05:00Z'
  },
  {
    id: 'co-10002',
    requestNumber: 'CO-10002',
    customerId: 'cust-hamza',
    customerName: 'Hamza Shahid',
    customerEmail: 'hamzashahid1152901@gmail.com',
    recipient: 'Julian & Elena',
    relationship: 'couple',
    occasion: 'Anniversary',
    budgetRange: '$200 - $450',
    productType: 'Celestial Coordinates Rotating Dual-Axis Kinetic Ring Box',
    customDesign: 'Planetary Orbit & Constellation Inlay',
    personalText: {
      primaryNames: 'Julian & Elena',
      milestoneDate: '2021-10-24',
      coordinates: '37.7749° N, 122.4194° W',
      customQuote: 'Two orbits intertwined across all celestial skies.',
      typographyFont: 'Minimal Modern Sans',
      engravingPlacement: 'Inner Brass Bezel'
    },
    uploadedImages: [
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80'
    ],
    referenceImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80'
    ],
    uploadedFiles: [
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80'
    ],
    selectedColors: ['Brushed Titanium', 'Rose Gold Accents'],
    preferredColors: ['Brushed Titanium', 'Rose Gold Accents'],
    preferredStyle: 'Modern Kinetic Aerospace',
    customOptions: {
      'Gear Mechanism': 'Precision Swiss 64-Tooth Brass Planetary Gear',
      'Ring Slot': 'Dual Velvet Ring Pillows'
    },
    selectedPackagingId: 'pkg-proposal',
    giftNote: 'Happy 5th Anniversary! May our orbits stay locked forever.',
    description: 'Precision CNC-machined titanium kinetic box where rotating the outer ring reveals the dual wedding bands illuminated by subtle warm LED halo.',
    targetDeliveryDate: '2026-09-20',
    status: 'PRODUCTION',
    carrier: 'BlueDart Apex Gold',
    trackingNumber: 'HX-DEL-984210',
    trackingUrl: 'https://track.bluedart.com/awb=HX-DEL-984210',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-08-10T09:00:00Z', description: 'Brief submitted for dual-axis kinetic ring box.', actor: 'customer' },
      { status: 'UNDER_REVIEW', timestamp: '2026-08-10T11:00:00Z', description: 'Kinetic engineering review complete.', actor: 'artisan' },
      { status: 'QUOTED', timestamp: '2026-08-10T14:30:00Z', description: 'Quotation of $240 generated.', actor: 'artisan' },
      { status: 'QUOTE_ACCEPTED', timestamp: '2026-08-11T08:15:00Z', description: 'Customer accepted quotation.', actor: 'customer' },
      { status: 'PAID', timestamp: '2026-08-11T08:20:00Z', description: 'Payment of $240 confirmed via Card.', actor: 'customer' },
      { status: 'DESIGNING', timestamp: '2026-08-12T10:00:00Z', description: '3D CAD micro-gear blueprints finalized.', actor: 'artisan' },
      { status: 'CUSTOMER_REVIEW', timestamp: '2026-08-12T16:00:00Z', description: 'CAD proof sent to customer for review.', actor: 'artisan' },
      { status: 'APPROVED', timestamp: '2026-08-13T09:00:00Z', description: 'Customer approved 3D CAD blueprints.', actor: 'customer' },
      { status: 'PRODUCTION', timestamp: '2026-08-14T08:00:00Z', description: 'Aerospace Grade 5 Titanium CNC milling and laser engraving in progress.', actor: 'artisan' }
    ],
    quote: {
      id: 'quote-co-2',
      amount: 240.00,
      shippingFee: 0.00,
      turnaroundDays: 10,
      notes: 'Includes aerospace Grade 5 Titanium CNC milling, Swiss brass gears, and luxury lighted presentation vault.',
      packagingIncluded: 'Secret Proposal Vault Box',
      validUntil: '2026-08-25',
      status: 'accepted'
    },
    messages: [
      {
        id: 'm3',
        sender: 'customer',
        senderName: 'Hamza Shahid',
        text: 'The 3D CAD preview looks incredible! Excited to see the finished gears.',
        timestamp: '2026-08-13T09:05:00Z'
      },
      {
        id: 'm4',
        sender: 'admin',
        senderName: 'Master Artisan Elena',
        text: 'Thank you Hamza! The CNC lathe is running right now. Tolerances are within 0.02mm.',
        timestamp: '2026-08-14T08:30:00Z'
      }
    ],
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-14T08:30:00Z'
  }
];

export const INITIAL_SAMPLE_COUPLE_WEBSITES: CoupleWebsiteProject[] = [
  {
    id: 'cws-hamza-sarah',
    customerId: 'cust-hamza',
    subdomain: 'hamza-and-sarah',
    templateId: 'tmpl-romantic-sunset',
    partner1Name: 'Hamza',
    partner2Name: 'Sarah',
    anniversaryDate: '2023-04-18',
    ourStoryTitle: 'From Coffee in Kyoto to Forever',
    ourStoryText: 'We met on a rainy Tuesday in Kyoto under a sakura umbrella. Since then, we have visited 14 countries, adopted a mischievous golden retriever named Mochi, and built a lifetime of warmth together.',
    heroTagline: 'Two souls, one synchronized universe ❤️',
    primaryColor: '#e11d48',
    fontStyle: 'Playfair Display',
    musicTrack: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
    photos: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80'
    ],
    memories: [
      {
        id: 'mem-1',
        title: 'Our First Road Trip',
        date: '2023-08-12',
        description: 'Driving through Big Sur with the windows rolled down singing out loud.',
        image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'mem-2',
        title: 'The Sunset Proposal',
        date: '2025-06-20',
        description: 'Overlooking the cliffs of Amalfi under a purple twilight sky.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80'
      }
    ],
    guestbook: [
      {
        id: 'gb-1',
        author: 'Elena & Marcus',
        message: 'You two are truly made for each other! Wishing you endless laughs and adventures!',
        date: '2026-08-01'
      }
    ],
    status: 'active',
    customDomain: 'hamzaandsarah.love',
    views: 1248,
    createdAt: '2026-04-18T00:00:00Z',
    expiresAt: '2028-04-18T00:00:00Z'
  }
];

export const INITIAL_API_KEYS: ApiKeyRecord[] = [
  {
    id: 'key-1',
    clientId: 'cli_discord',
    clientName: 'HARCONXS Discord Bot',
    name: 'Production Discord Bot Sync',
    keyPrefix: 'hx_live_89a1',
    keyHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    scopes: ['read:orders', 'read:products', 'chat:grounded'],
    prefix: 'hx_live_89a1...492b',
    createdAt: '2026-07-01',
    lastUsed: 'Just now',
    lastUsedAt: '2026-08-19T06:00:00Z',
    rateLimit: 120,
    requestCount: 14820,
    usageCount: 14820,
    permissions: ['orders.read', 'bot.broadcast', 'webhooks.manage'],
    status: 'active'
  },
  {
    id: 'key-2',
    clientId: 'cli_telegram',
    clientName: 'HARCONXS Telegram Bot',
    name: 'Telegram VIP Webhook Gateway',
    keyPrefix: 'hx_live_33f2',
    keyHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    scopes: ['read:orders', 'write:support', 'chat:grounded'],
    prefix: 'hx_live_33f2...99ca',
    createdAt: '2026-07-15',
    lastUsed: '2 hours ago',
    lastUsedAt: '2026-08-19T04:00:00Z',
    rateLimit: 60,
    requestCount: 3940,
    usageCount: 3940,
    permissions: ['bot.verify_member', 'coupons.validate'],
    status: 'active'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-8902',
    customerId: 'cust-hamza',
    customerName: 'Hamza Shahid',
    customerEmail: 'hamzashahid1152901@gmail.com',
    subject: 'Adding custom photo to couple website gallery',
    category: 'Couple Website',
    priority: 'medium',
    status: 'In Progress',
    messages: [
      {
        id: 'tm-1',
        sender: 'customer',
        senderName: 'Hamza Shahid',
        text: 'Hi, can I upload high resolution 4K images to my couple website gallery?',
        timestamp: '2026-08-16T10:00:00Z'
      },
      {
        id: 'tm-2',
        sender: 'support',
        senderName: 'Dev Support Leo',
        text: 'Hello Hamza! Yes, our CDN automatically optimizes and serves WebP / AVIF copies for all screen resolutions with zero loss in clarity.',
        timestamp: '2026-08-16T10:15:00Z'
      }
    ],
    createdAt: '2026-08-16T10:00:00Z',
    updatedAt: '2026-08-16T10:15:00Z'
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'auto-1',
    name: 'Low Stock Alert Trigger',
    trigger: 'Inventory < 5 units',
    condition: 'Physical products only',
    action: 'Send urgent Slack & Email alert to Product Manager',
    isActive: true,
    runCount: 14,
    lastRun: '2026-08-16T08:12:00Z'
  },
  {
    id: 'auto-2',
    name: 'VIP Customer Tagging',
    trigger: 'Customer Lifetime Spend > $500',
    condition: 'All successful orders',
    action: 'Apply VIP Tag + Grant 15% perpetual loyalty cashback',
    isActive: true,
    runCount: 42,
    lastRun: '2026-08-15T18:40:00Z'
  },
  {
    id: 'auto-3',
    name: 'Post-Delivery Review Invitation',
    trigger: 'Order Status = Delivered',
    condition: 'Delay 48 hours',
    action: 'Dispatch personalized email with 50 Loyalty Points bonus',
    isActive: true,
    runCount: 189,
    lastRun: '2026-08-16T14:20:00Z'
  }
];

export const INITIAL_SYSTEM_POLICIES: SystemPolicy[] = [
  {
    id: 'pol-privacy',
    title: 'Privacy Policy',
    slug: 'privacy',
    version: '2.3.0',
    lastUpdated: 'August 16, 2026',
    content: `HARCONXS SHOP is committed to protecting your personal data and digital privacy. We employ end-to-end TLS 1.3 encryption, zero-knowledge storage for user-uploaded private photos and bespoke messages, and never monetize or sell personal identifiers to third-party data brokers. For custom orders, your reference photos and messages are strictly accessible only by the assigned artisan for fabrication purposes and are permanently archived or deleted upon customer request.`
  },
  {
    id: 'pol-terms',
    title: 'Terms of Service',
    slug: 'terms',
    version: '3.1.0',
    lastUpdated: 'August 16, 2026',
    content: `By accessing HARCONXS SHOP, ordering custom personalized goods, subscribing to bot dashboards, or generating couple websites, you agree to our standard terms of service. All digital templates and generated couple subdomains are guaranteed 99.9% uptime. Custom physical products undergo rigorous quality inspection prior to dispatch.`
  },
  {
    id: 'pol-custom',
    title: 'Custom Orders & Personalization Policy',
    slug: 'custom-orders',
    version: '1.8.0',
    lastUpdated: 'August 16, 2026',
    content: `Because custom and personalized products are manufactured uniquely for you (including custom engraved coordinates, names, bespoke music boxes, and custom domain couple portals), cancellations or modifications must be submitted within 12 hours of placing the order before laser engraving or fabrication commences. If an item arrives damaged or with an engraving discrepancy from your submitted brief, we provide an immediate free remake or full refund.`
  },
  {
    id: 'pol-shipping',
    title: 'Shipping & Delivery Policy',
    slug: 'shipping',
    version: '2.0.0',
    lastUpdated: 'August 16, 2026',
    content: `We ship worldwide with dedicated fast delivery across India via BlueDart, Delhivery, DTDC, and Express Post. Standard items dispatch within 24-48 business hours. Metro cities (Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Kolkata) receive delivery in 2-3 business days. Personalized items require 2-3 business days of precision laser engraving in our atelier before dispatch. Tracking numbers with live WhatsApp and SMS milestone updates are provided instantly.`
  }
];

export const INITIAL_POPUP_BANNER: PopupBannerConfig = {
  enabled: true,
  title: '🇮🇳 Festive Special: Extra 20% OFF Everything',
  description: 'Upgrade your gifting experience with artisan laser engraving, lifetime couple websites, and VIP bot panels. Use code at checkout!',
  couponCode: 'INDIA20',
  ctaText: 'Explore Festive Collection',
  ctaView: 'catalog',
  imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
  badgeText: 'LIMITED TIME DEAL',
  expiresAt: '2026-10-30T23:59:59Z',
  showDelaySeconds: 1
};

export const INITIAL_BILLING_PORTAL: BillingPortalConfig = {
  portalUrl: 'https://billing.harconxs.com',
  provider: 'Razorpay Subscriptions',
  publicKey: 'rzp_live_harconxs_984729184',
  webhookSecret: 'whsec_hx_live_93810248201',
  redirectMode: 'new_tab',
  syncActiveSubscriptions: true,
  status: 'connected',
  lastSynced: '2026-08-16T15:30:00Z'
};

export const INITIAL_YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'yt-1',
    title: 'How We Laser-Engrave Custom Couple Coordinates & Titanium Bands',
    youtubeId: 'dQw4w9WgXcQ', // Clean placeholder ID that embeds nicely
    description: 'A behind-the-scenes look into our Bangalore atelier studio showcasing micron-precision fiber laser etching and luxury velvet packaging assembly.',
    category: 'Craftsmanship',
    views: '142K views',
    publishedDate: '1 month ago',
    featured: true
  },
  {
    id: 'yt-2',
    title: 'Building a 3D Couple Memory Website in 3 Minutes with HARCONXS',
    youtubeId: 'L_LUpnjgPso',
    description: 'Full walkthrough of creating romantic timeline sanctuaries, custom audio players, interactive guestbooks, and personal domain deployment.',
    category: 'Sanctuary',
    views: '88K views',
    publishedDate: '2 weeks ago',
    featured: true
  },
  {
    id: 'yt-3',
    title: 'Deploying High-Performance Telegram & Discord Bot Panels (Turnkey Guide)',
    youtubeId: 'fJ9rUzIMcZQ',
    description: 'Learn how to automate VIP subscriber gating, real-time crypto alerts, WhatsApp business auto-responders, and webhook integrations with zero coding.',
    category: 'Bot Panels',
    views: '54K views',
    publishedDate: '3 weeks ago',
    featured: false
  },
  {
    id: 'yt-4',
    title: 'Unboxing the Acrylic LED Song Plaque & Spotify Code Keepsake',
    youtubeId: 'kJQP7kiw5Fk',
    description: 'Customer review and unboxing of our best-selling optical acrylic night lamp with touch dimmer and solid walnut base.',
    category: 'Tutorial',
    views: '97K views',
    publishedDate: '2 months ago',
    featured: false
  }
];

export const INITIAL_SOCIAL_LINKS: SocialLinksConfig = {
  youtube: 'https://youtube.com/@harconxs',
  instagram: 'https://instagram.com/harconxs.shop',
  telegram: 'https://t.me/harconxs_official',
  discord: 'https://discord.gg/harconxs',
  twitter: 'https://x.com/harconxs',
  github: 'https://github.com/harconxs',
  whatsapp: 'https://wa.me/919876543210'
};

export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: 'eml-init-1',
    type: 'account_created',
    recipientEmail: 'hamzashahid1152901@gmail.com',
    recipientName: 'Hamza Shahid',
    subject: '✨ Welcome to HARCONXS Atelier, Hamza Shahid! (+150 Loyalty Points Credited)',
    previewSnippet: 'Your exclusive HARCONXS Atelier membership is now verified. Access your bespoke laser keepsakes, couple sanctuaries, and loyalty wallet.',
    htmlContent: `
      <div style="font-family: sans-serif; background: #18181b; color: #f4f4f5; padding: 24px; border-radius: 16px; border: 1px solid #27272a;">
        <h2 style="color: #fbbf24; margin-top: 0;">HARCONXS ATELIER & SANCTUARY</h2>
        <p>Welcome <strong>Hamza Shahid</strong>! Your member account has been credited with <strong>+150 Loyalty Points</strong>.</p>
        <p style="color: #a1a1aa; font-size: 13px;">Enjoy priority artisan laser engraving, real-time logistics tracking, and private cloud sanctuaries.</p>
      </div>
    `,
    sentAt: '2026-08-14T09:00:00Z',
    status: 'delivered'
  },
  {
    id: 'eml-init-2',
    type: 'order_confirmed',
    recipientEmail: 'hamzashahid1152901@gmail.com',
    recipientName: 'Hamza Shahid',
    subject: '📦 Order Confirmed: #HX-90821 — Thank You for Choosing HARCONXS',
    previewSnippet: 'We have received your order #HX-90821. Our artisans are preparing your bespoke laser keepsake.',
    htmlContent: `
      <div style="font-family: sans-serif; background: #18181b; color: #f4f4f5; padding: 24px; border-radius: 16px; border: 1px solid #27272a;">
        <h2 style="color: #fbbf24; margin-top: 0;">HARCONXS OFFICIAL RECEIPT</h2>
        <p>Order <strong>#HX-90821</strong> is verified. Total Paid: <strong>$77.59</strong>.</p>
        <div style="background: #09090b; padding: 12px; border-radius: 8px; margin: 12px 0; font-size: 12px;">
          <div>Item: Custom Coordinates Matching Bracelet Set</div>
          <div>Engraving: "Hamza & Sarah" (2024-04-18)</div>
          <div>Packaging: Velvet Midnight Luxury Box</div>
        </div>
      </div>
    `,
    sentAt: '2026-08-14T10:02:00Z',
    status: 'delivered',
    orderNumber: 'HX-90821',
    carrier: 'FedEx Express',
    trackingNumber: 'HX-FEDEX-99824102'
  },
  {
    id: 'eml-init-3',
    type: 'shipping_update',
    recipientEmail: 'hamzashahid1152901@gmail.com',
    recipientName: 'Hamza Shahid',
    subject: '🚀 Logistics Milestone: Order #HX-90821 in Production at Atelier',
    previewSnippet: 'Your handcrafted HARCONXS order #HX-90821 is being laser engraved and assembled in our luxury presentation box.',
    htmlContent: `
      <div style="font-family: sans-serif; background: #18181b; color: #f4f4f5; padding: 24px; border-radius: 16px; border: 1px solid #27272a;">
        <h2 style="color: #fbbf24; margin-top: 0;">LOGISTICS & ATELIER DISPATCH</h2>
        <p>Order <strong>#HX-90821</strong> is currently in <strong>Production & QA</strong>.</p>
        <p style="font-size: 12px; color: #a1a1aa;">Tracking Number: <strong>HX-FEDEX-99824102</strong></p>
      </div>
    `,
    sentAt: '2026-08-15T09:00:00Z',
    status: 'delivered',
    orderNumber: 'HX-90821',
    carrier: 'FedEx Express',
    trackingNumber: 'HX-FEDEX-99824102'
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-cpl-1',
    productId: 'prod-couple-1',
    orderId: 'ord-init-1',
    orderItemId: 'oi-cpl-1',
    userId: 'usr-1',
    userName: 'Rohan & Ananya Sharma',
    userEmail: 'rohan.sharma@example.com',
    rating: 5,
    title: 'Flawless laser engraving & coordinates accuracy!',
    comment: 'Ordered our anniversary coordinates in 18K gold vermeil. The engraving precision is breathtaking and the velvet presentation box felt ultra-luxurious. She cried happy tears during our anniversary date night.',
    review: 'Ordered our anniversary coordinates in 18K gold vermeil. The engraving precision is breathtaking and the velvet presentation box felt ultra-luxurious. She cried happy tears during our anniversary date night.',
    date: 'Aug 10, 2026',
    createdAt: '2026-08-10T14:30:00Z',
    verified: true,
    verifiedPurchase: true,
    likes: 28,
    helpfulVotes: 28,
    helpfulUserIds: ['usr-2', 'usr-3', 'usr-4'],
    images: [
      'https://images.unsplash.com/photo-1611591475168-52219c676770?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    customerImages: [
      'https://images.unsplash.com/photo-1611591475168-52219c676770?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'approved',
    isFeatured: true
  },
  {
    id: 'rev-cpl-2',
    productId: 'prod-couple-1',
    orderId: 'ord-sample-2',
    userId: 'usr-2',
    userName: 'Priya Mukherjee',
    userEmail: 'priya.m@example.com',
    rating: 5,
    title: 'Best long-distance anniversary gift ever made',
    comment: 'Substantial solid feel with scratch-resistant coating. Delivered in Bengaluru within 48 hours in pristine protective wrapping. The custom cursive font matched the interactive live preview 100%.',
    review: 'Substantial solid feel with scratch-resistant coating. Delivered in Bengaluru within 48 hours in pristine protective wrapping. The custom cursive font matched the interactive live preview 100%.',
    date: 'Jul 29, 2026',
    createdAt: '2026-07-29T11:15:00Z',
    verified: true,
    verifiedPurchase: true,
    likes: 19,
    helpfulVotes: 19,
    helpfulUserIds: ['usr-1', 'usr-5'],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    customerImages: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'approved',
    isFeatured: true
  },
  {
    id: 'rev-cpl-3',
    productId: 'prod-couple-1',
    orderId: 'ord-sample-3',
    userId: 'usr-3',
    userName: 'Vikram Mehta',
    userEmail: 'vikram.mehta@example.com',
    rating: 4,
    title: 'Very premium quality, speedy dispatch',
    comment: 'Great weight and mirror-polished finish. Would love if they provided extra adjustment links by default, but customer support sent extra pins in 24 hours. Overall top-notch craftsmanship.',
    review: 'Great weight and mirror-polished finish. Would love if they provided extra adjustment links by default, but customer support sent extra pins in 24 hours. Overall top-notch craftsmanship.',
    date: 'Jul 14, 2026',
    createdAt: '2026-07-14T09:45:00Z',
    verified: true,
    verifiedPurchase: true,
    likes: 9,
    helpfulVotes: 9,
    helpfulUserIds: ['usr-2'],
    images: [],
    customerImages: [],
    status: 'approved',
    isFeatured: false
  },
  {
    id: 'rev-cpl-4',
    productId: 'prod-couple-2',
    orderId: 'ord-sample-4',
    userId: 'usr-4',
    userName: 'Kavita Reddy',
    userEmail: 'kavita.reddy@example.com',
    rating: 5,
    title: 'The projected photo is crystal clear and vivid!',
    comment: 'Holding the nano-engraved micro stone up to a phone flashlight projects our Goa proposal photo onto the wall like pure cinema magic! My fiancé was speechless.',
    review: 'Holding the nano-engraved micro stone up to a phone flashlight projects our Goa proposal photo onto the wall like pure cinema magic! My fiancé was speechless.',
    date: 'Aug 02, 2026',
    createdAt: '2026-08-02T16:20:00Z',
    verified: true,
    verifiedPurchase: true,
    likes: 34,
    helpfulVotes: 34,
    helpfulUserIds: ['usr-1', 'usr-3', 'usr-6'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    customerImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'approved',
    isFeatured: true
  },
  {
    id: 'rev-men-1',
    productId: 'prod-men-1',
    orderId: 'ord-sample-5',
    userId: 'usr-5',
    userName: 'Aditya Sen',
    userEmail: 'aditya.sen@example.com',
    rating: 5,
    title: 'A masterpiece timepiece in gunmetal ceramic',
    comment: 'Exceeds timepieces 3x its price bracket. The sapphire anti-reflective crystal, heavy solid links, and tactile butterfly clasp feel truly bespoke. Highly recommended.',
    review: 'Exceeds timepieces 3x its price bracket. The sapphire anti-reflective crystal, heavy solid links, and tactile butterfly clasp feel truly bespoke. Highly recommended.',
    date: 'Aug 08, 2026',
    createdAt: '2026-08-08T18:10:00Z',
    verified: true,
    verifiedPurchase: true,
    likes: 17,
    helpfulVotes: 17,
    helpfulUserIds: ['usr-1'],
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    customerImages: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'approved',
    isFeatured: true
  },
  {
    id: 'rev-wmn-1',
    productId: 'prod-women-1',
    orderId: 'ord-sample-6',
    userId: 'usr-6',
    userName: 'Tara Singhania',
    userEmail: 'tara.s@example.com',
    rating: 5,
    title: 'Iridescent Australian opal shimmer is breathtaking',
    comment: 'Shimmers radiantly between rose pink, electric turquoise, and gold under daylight. 18K thick gold vermeil has not tarnished after weeks of daily wear.',
    review: 'Shimmers radiantly between rose pink, electric turquoise, and gold under daylight. 18K thick gold vermeil has not tarnished after weeks of daily wear.',
    date: 'Aug 05, 2026',
    createdAt: '2026-08-05T13:40:00Z',
    verified: true,
    verifiedPurchase: true,
    likes: 26,
    helpfulVotes: 26,
    helpfulUserIds: ['usr-2', 'usr-4'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    customerImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'approved',
    isFeatured: true
  },
  {
    id: 'rev-dig-1',
    productId: 'prod-dig-1',
    orderId: 'ord-sample-7',
    userId: 'usr-7',
    userName: 'Sameer & Zoya Khan',
    userEmail: 'sameer.zoya@example.com',
    rating: 5,
    title: 'The couple website sanctuary blew our friends away!',
    comment: 'Set up in under 5 minutes with our songs, anniversary counter, and photo reel. We shared the link with all our wedding guests and received 80+ guestbook love notes.',
    review: 'Set up in under 5 minutes with our songs, anniversary counter, and photo reel. We shared the link with all our wedding guests and received 80+ guestbook love notes.',
    date: 'Aug 12, 2026',
    createdAt: '2026-08-12T19:00:00Z',
    verified: true,
    verifiedPurchase: true,
    likes: 41,
    helpfulVotes: 41,
    helpfulUserIds: ['usr-1', 'usr-3', 'usr-5'],
    images: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80'
    ],
    customerImages: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'approved',
    isFeatured: true
  }
];

export const INITIAL_BILLING_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-hx-001',
    invoiceNumber: 'INV-HX-2026-0891',
    transactionId: 'TXN-UPI-98214208',
    orderId: 'ord-init-1',
    orderNumber: 'HX-90821',
    customerName: 'Hamza Shahid',
    customerEmail: 'hamzashahid1152901@gmail.com',
    amount: 6711.53,
    currency: 'INR',
    paymentMethod: 'UPI / QR',
    paymentGateway: 'Cashfree UPI',
    status: 'Paid',
    gstNumber: '29AABCH8821K1ZM',
    cgst: 511.89,
    sgst: 511.89,
    date: '2026-08-14T10:02:00Z',
    itemsSummary: 'Custom Coordinates Matching Bracelet Set (x1) + Velvet Luxury Box',
    receiptUrl: 'https://harconxs.com/receipt/INV-HX-2026-0891'
  }
];

export const INITIAL_THEME_CONFIG = {
  siteName: 'HARCONXS',
  tagline: 'LUXURY COMMERCE & SANCTUARY ATELIER',
  announcementText: 'Use code WELCOME15 for 15% off your first order',
  announcementDiscountCode: 'WELCOME15',
  heroHeadline: 'SHOP • PERSONALIZE • CUSTOMIZE • CREATE',
  heroSubheadline: 'Find something you love, personalize it your way, request something completely bespoke, or generate a lifetime couple website & bot automation suite.',
  primaryColor: '#f59e0b',
  accentColor: '#f43f5e',
  secondaryColor: '#38bdf8',
  fontFamily: 'serif' as const,
  bannerImageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1600&auto=format&fit=crop&q=80',
  footerTagline: 'Premium commerce destination engineered for couples, handcrafted laser engravings, lifetime cloud memory portals, and bespoke digital automation.',
  supportEmail: 'care@harconxs.com',
  supportPhone: '+91 98200 12890',
  freeShippingThreshold: 1500
};

export const INITIAL_KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'kc-shipping',
    name: 'Shipping & Delivery',
    slug: 'shipping-delivery',
    description: 'Dispatch timelines, domestic & worldwide courier partners, real-time live tracking, and tamper-proof insured packaging.',
    icon: 'Truck',
    displayOrder: 1,
    articleCount: 3
  },
  {
    id: 'kc-returns',
    name: 'Returns & Refunds',
    slug: 'returns-refunds',
    description: '30-day money-back guarantee, non-customized product returns, damaged in transit replacements, and refund methods.',
    icon: 'RotateCcw',
    displayOrder: 2,
    articleCount: 3
  },
  {
    id: 'kc-custom',
    name: 'Custom & Personalized Orders',
    slug: 'custom-orders',
    description: 'Laser engraving specs, 3D brief submission, custom quotation #CO workflows, design approvals, and master jewelers.',
    icon: 'Sparkles',
    displayOrder: 3,
    articleCount: 4
  },
  {
    id: 'kc-couple-sites',
    name: 'Couple Websites & Sanctuaries',
    slug: 'couple-websites',
    description: 'Subdomains, anniversary live countdown timers, multimedia galleries, background audio tracks, guestbook moderation, and custom domains.',
    icon: 'Heart',
    displayOrder: 4,
    articleCount: 3
  },
  {
    id: 'kc-bots',
    name: 'Bot Panels & Digital Infrastructure',
    slug: 'bot-panels',
    description: 'Telegram VIP gateways, Discord bot moderation dashboards, WhatsApp CRM automation, API rate limits, and private billing portals.',
    icon: 'Bot',
    displayOrder: 5,
    articleCount: 3
  },
  {
    id: 'kc-payments',
    name: 'Payments & Store Credit',
    slug: 'payments-billing',
    description: 'UPI, Credit/Debit cards, NetBanking, Razorpay PG, Cashfree, GST invoices, discount promo codes, and loyalty reward redemption.',
    icon: 'CreditCard',
    displayOrder: 6,
    articleCount: 2
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'ka-1',
    categoryId: 'kc-shipping',
    categoryName: 'Shipping & Delivery',
    slug: 'delivery-times-and-rates',
    title: 'Standard and Express Delivery Timelines',
    summary: 'Standard delivery takes 3-5 business days across domestic metros. Express courier arrives in 1-2 business days with full GPS tracking.',
    content: `All HARCONXS orders are securely packed and dispatched from our primary fulfillment centers within 24 to 48 hours.

### Delivery Windows
- **Metro Cities (Delhi, Mumbai, Bengaluru, etc.):** 2 to 4 business days.
- **Rest of Country:** 4 to 6 business days.
- **Express Guaranteed Courier:** 24 to 48 hours for eligible zip codes.
- **International Orders:** 7 to 12 business days via DHL Express / FedEx Global.

### Free Shipping Threshold
Orders exceeding ₹1,500 ($50 USD equivalent) qualify for 100% Free Insured Shipping.

### Real-Time Tracking
Once your package is packed and handed over to our courier partner (BlueDart, Delhivery, or DHL), you will receive an automated SMS and Email with your tracking link. You can also monitor your live shipment progress directly in your My Account > Orders tab or by asking our AI concierge with your authenticated account.`,
    tags: ['shipping', 'delivery', 'tracking', 'courier', 'express', 'free shipping'],
    views: 3420,
    helpfulVotes: 288,
    isFeatured: true,
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-08-10T00:00:00Z'
  },
  {
    id: 'ka-2',
    categoryId: 'kc-returns',
    categoryName: 'Returns & Refunds',
    slug: 'returns-and-refund-policy',
    title: '30-Day Return Window and Damaged Replacement Guarantee',
    summary: 'Non-customized physical products are eligible for a 30-day hassle-free return. Personalized laser-engraved items are protected with a free replacement if defective or damaged.',
    content: `We take extraordinary pride in the craftsmanship of every HARCONXS creation.

### Physical Ready-Made Items
You can initiate a return or exchange within **30 days** of delivery. The item must be unworn, in original packaging with protective seals intact.

### Personalized & Bespoke Items
Because personalized products (e.g. custom laser coordinates, photo projection jewelry, engraved nameplates) are handcrafted exclusively to your custom specifications, they are exempt from standard remorse returns. However:
- If your personalized piece arrives damaged or has a transcription flaw caused by our atelier, we provide a **100% free immediate replacement or full store credit**.

### How to Request a Refund or Return
1. Navigate to **My Account > Orders > Request Return** or open a Support Ticket.
2. Our customer concierge team approves requests within 12 business hours.
3. Refunds are credited to your original payment method within 3-5 bank business days after inspection.`,
    tags: ['returns', 'refunds', 'replacement', 'warranty', 'money back'],
    views: 2910,
    helpfulVotes: 215,
    isFeatured: true,
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-08-12T00:00:00Z'
  },
  {
    id: 'ka-3',
    categoryId: 'kc-custom',
    categoryName: 'Custom & Personalized Orders',
    slug: 'custom-order-quotation-workflow',
    title: 'How Custom Bespoke Orders & Quotations (#CO) Work',
    summary: 'Submit your bespoke brief with recipient, occasion, budget, and design inspirations. Our master jewelers provide a detailed 3D preview and official quote within 24 hours.',
    content: `HARCONXS Atelier lets you bring any physical or digital concept into reality.

### 4-Step Bespoke Process
1. **Submit Your Brief:** Visit the "Create Something Special" custom builder. Select your recipient (Friend, Girlfriend, Boyfriend, Husband, Wife, Partner), occasion, budget, and upload any reference sketches or photos.
2. **Atelier Review & Quotation:** Our master jewelers analyze your requirements and issue an official Quotation (e.g. #CO-10032) with fixed pricing, turnaround schedule, and 3D mockups.
3. **Approval & Payment:** Review the quote in your Custom Projects dashboard. Accept or request adjustments, then complete payment securely.
4. **Handcrafting & Delivery:** Watch real-time milestone updates through Design, Casting, Engraving, Quality Inspection, and Insured Dispatch.`,
    tags: ['custom orders', 'bespoke', 'quotation', 'custom builder', 'engraving', 'brief'],
    views: 4120,
    helpfulVotes: 376,
    isFeatured: true,
    createdAt: '2026-06-05T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'ka-4',
    categoryId: 'kc-couple-sites',
    categoryName: 'Couple Websites & Sanctuaries',
    slug: 'couple-website-features-and-setup',
    title: 'Couple Sanctuary Websites: Setup, Custom Subdomains & Features',
    summary: 'Create a permanent, interactive love sanctuary with live anniversary counters, romantic photo galleries, background acoustic audio, and customizable subdomains.',
    content: `A HARCONXS Couple Sanctuary is an exclusive, private digital website dedicated to your romantic journey.

### Included Features
- **Live Anniversary & Relationship Timer:** Precise to the exact second.
- **HD Story Timeline & Photo Galleries:** Curate milestones from your first date to today with cloud-optimized CDN streaming.
- **Romantic Audio Player:** Set your favorite acoustic ballad as background music.
- **Interactive Love Guestbook:** Friends, family, or your partner can leave heartfelt messages.
- **Secret Valentine Letter & Video Capsule:** Password-locked surprise reveal for special dates.
- **Subdomain / Custom Domain:** Choose your custom address like \`alex-and-sarah.harconxsshop.com\` or connect your own domain (\`.love\`, \`.com\`).

### Instant Generation & Lifetime Cloud Hosting
Upon checkout, your sanctuary is deployed instantly with an easy-to-use customer management dashboard to update photos and memories anytime.`,
    tags: ['couple website', 'anniversary', 'relationship timer', 'guestbook', 'music', 'subdomain'],
    views: 3880,
    helpfulVotes: 340,
    isFeatured: true,
    createdAt: '2026-06-10T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'ka-5',
    categoryId: 'kc-bots',
    categoryName: 'Bot Panels & Digital Infrastructure',
    slug: 'bot-panel-services-and-api',
    title: 'Bot Panels, Webhooks & Private Billing Integrations',
    summary: 'Explore our enterprise-grade Telegram VIP portals, Discord community bots, WhatsApp CRM systems, and developer API keys with sub-50ms latency.',
    content: `HARCONXS Digital Infrastructure provides turnkey hosting and management panels for conversational automation.

### Available Digital Bot Services
1. **Telegram VIP Member Portal:** Automated payment-to-invite link issuance, subscription expiry kicks, and real-time broadcasts.
2. **Discord Bot Suite:** Server economy, role synchronization, auto-moderation, and custom commands.
3. **WhatsApp Business CRM Panel:** Multi-agent inbox, automated dispatch notifications, and template broadcasts.

### Private Billing Separation
All bot hosting subscriptions, plan upgrades, and recurring billing are managed via the dedicated Private Billing Portal for maximum enterprise security and isolation.

### Developer API Access
Customers can generate secure scoped API tokens (\`read:products\`, \`read:orders\`, \`chat:use\`) under My Account > API Keys to integrate with custom headless bots and websites.`,
    tags: ['bot panels', 'telegram', 'discord', 'whatsapp', 'api keys', 'webhooks', 'private billing'],
    views: 2650,
    helpfulVotes: 198,
    isFeatured: false,
    createdAt: '2026-06-15T00:00:00Z',
    updatedAt: '2026-08-17T00:00:00Z'
  }
];

export const INITIAL_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    categoryId: 'kc-shipping',
    categoryName: 'Shipping & Delivery',
    question: 'How do I track my order status?',
    answer: 'You can check your live order and shipment status at any time by signing into your account, navigating to My Account > Orders, or simply asking our AI concierge "Where is my order?" while logged in. You will see carrier details, real-time GPS milestones, and estimated delivery dates.',
    tags: ['tracking', 'order status', 'shipment', 'delivery'],
    orderIndex: 1,
    isFeatured: true
  },
  {
    id: 'faq-2',
    categoryId: 'kc-custom',
    categoryName: 'Custom & Personalized Orders',
    question: 'Can I preview my custom laser engraving before it is crafted?',
    answer: 'Yes! Our online Personalizer provides an instant interactive live 3D visual preview. For bespoke custom orders (#CO), our jeweler atelier provides a comprehensive digital proof for your sign-off before manufacturing begins.',
    tags: ['custom preview', 'engraving', 'personalizer', '3d mockup'],
    orderIndex: 2,
    isFeatured: true
  },
  {
    id: 'faq-3',
    categoryId: 'kc-returns',
    categoryName: 'Returns & Refunds',
    question: 'What is your refund policy if an item arrives damaged?',
    answer: 'If your package arrives defective or damaged during transit, notify us within 48 hours of delivery. We will dispatch a 100% free expedited replacement immediately with no return hassle.',
    tags: ['damaged', 'refund', 'replacement', 'warranty'],
    orderIndex: 3,
    isFeatured: true
  },
  {
    id: 'faq-4',
    categoryId: 'kc-couple-sites',
    categoryName: 'Couple Websites & Sanctuaries',
    question: 'How long does a couple website stay online?',
    answer: 'All HARCONXS Couple Sanctuaries remain active for the duration of your chosen plan (1 Year, 3 Years, or Lifetime Eternity pass). You can renew or upgrade your hosting anytime from your project dashboard with 100% data preservation.',
    tags: ['couple website', 'expiry', 'hosting', 'renewal'],
    orderIndex: 4,
    isFeatured: true
  },
  {
    id: 'faq-5',
    categoryId: 'kc-payments',
    categoryName: 'Payments & Store Credit',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, Rupay, Amex), Net Banking across 50+ banks, Store Credit, and Cash on Delivery for physical items.',
    tags: ['payment methods', 'upi', 'cards', 'cod', 'cashfree', 'razorpay'],
    orderIndex: 5,
    isFeatured: true
  },
  {
    id: 'faq-6',
    categoryId: 'kc-bots',
    categoryName: 'Bot Panels & Digital Infrastructure',
    question: 'How do I connect my Telegram or Discord bot to HARCONXS API?',
    answer: 'Generate a private API key with the "chat:use" and "products:read" scopes under My Account > API Keys. Use our JSON endpoint POST /api/v1/chat with your API key header "X-HARCONXS-API-KEY" to ground your bot in live inventory and order data.',
    tags: ['api', 'telegram bot', 'discord bot', 'integration', 'token'],
    orderIndex: 6,
    isFeatured: false
  },
  {
    id: 'faq-7',
    categoryId: 'kc-custom',
    categoryName: 'Custom & Personalized Orders',
    question: 'What luxury gift packaging options are available?',
    answer: 'We offer Minimal Eco Kraft boxes (free), Velvet Midnight Luxury Boxes ($14.99) with gold foil embossing, and Romantic Eternal Rose Capsules ($24.99) featuring a preserved crimson rose and hidden secret compartment.',
    tags: ['packaging', 'gift box', 'velvet box', 'rose capsule'],
    orderIndex: 7,
    isFeatured: true
  }
];


