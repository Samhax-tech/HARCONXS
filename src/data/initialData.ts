import {
  Product,
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
  EmailNotification
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
    themeCategory: 'Romantic',
    description: 'Warm champagne & sunset palette with floating heart particles, audio player, and parallax photo scroll.',
    price: 39.00,
    previewImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'alex-and-sophia',
    features: ['Live Love Counter', 'Soundtrack Player', 'Parallax Story Timeline', 'Interactive Love Quiz', 'Guestbook & Love Letters'],
    popular: true
  },
  {
    id: 'tmpl-luxury-monochrome',
    name: 'Atelier Noir & Rose Gold',
    themeCategory: 'Luxury',
    description: 'Editorial high-fashion layout with minimalist serif typography, video hero, and interactive memory archive.',
    price: 49.00,
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'julian-and-elena',
    features: ['Film Roll Photo Stream', 'Milestone Map Pinning', 'Secret Password Note', 'Ultra Fast CDN Hosting', 'Custom QR Code Card'],
    popular: true
  },
  {
    id: 'tmpl-cute-pastel',
    name: 'Strawberry Milk & Stars',
    themeCategory: 'Cute',
    description: 'Playful anime-inspired aesthetic with custom polaroid stickers, mood trackers, and anniversary notifications.',
    price: 34.00,
    previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'leo-and-maya',
    features: ['Polaroid Drag-and-Drop', 'Virtual Love Letterbox', 'Spotify Playlist Sync', 'Cute Floating Badges', 'Mobile App Shortcut']
  },
  {
    id: 'tmpl-minimal-clean',
    name: 'Nordic Clean & Pure',
    themeCategory: 'Minimal',
    description: 'Ultra-clean white and slate aesthetic emphasizing typography, curated photo galleries, and chronological vows.',
    price: 29.00,
    previewImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80',
    demoSubdomain: 'marcus-and-chloe',
    features: ['Typography Focus', 'Full-screen Photo Lightbox', 'Relationship Stats Counter', 'Lightweight <50ms Load']
  }
];

export const INITIAL_BOT_PANEL_SERVICES: BotPanelService[] = [
  {
    id: 'bot-tg-vip',
    name: 'Telegram Community & VIP Monetization Panel',
    platform: 'Telegram',
    shortDesc: 'Automated subscription gates, auto-expiring invite links, crypto & card payouts, broadcast scheduler.',
    fullDesc: 'The ultimate control center for Telegram channel owners and community leaders. Protect exclusive channels with automatic member verification, recurring billing webhooks, anti-forwarding shields, and interactive bot keyboards.',
    icon: 'Send',
    badge: 'Popular',
    plans: [
      { id: 'p1', name: 'Starter Bot', price: 19.00, billingPeriod: 'monthly', features: ['Up to 2 Channels', 'Instant Webhooks', 'Stripe & Crypto Gates', '24/7 Cloud Uptime'] },
      { id: 'p2', name: 'Pro Scaler', price: 49.00, billingPeriod: 'monthly', isPopular: true, features: ['Unlimited Channels', 'Automated Content Broadcasts', 'Custom AI Support Agent', 'Affiliate Tracking Sub-bots', 'Priority Cloud VPS'] },
      { id: 'p3', name: 'Lifetime Suite', price: 299.00, billingPeriod: 'lifetime', features: ['Source Code Included', 'Dedicated Server Deployment', 'Custom Branding & Domain', 'Lifetime Updates'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-tg.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/tg-panel'
  },
  {
    id: 'bot-dc-hub',
    name: 'Discord Multi-Server Moderation & Ticket Engine',
    platform: 'Discord',
    shortDesc: 'Enterprise ticket transcripts, XP levelling system, customizable reaction roles, AI mod filters.',
    fullDesc: 'Manage hundreds of Discord servers from one unified, sleek web interface. Includes interactive web-based dashboard, role sync with Patreon/Shopify, voice channel generators, and audio streaming bot modules.',
    icon: 'Shield',
    badge: 'Top Rated',
    plans: [
      { id: 'pd1', name: 'Guild Basic', price: 15.00, billingPeriod: 'monthly', features: ['3 Discord Servers', 'Ticket Transcripts', 'Anti-Raid Auto Shield', 'Custom Embed Builder'] },
      { id: 'pd2', name: 'Empire Pro', price: 39.00, billingPeriod: 'monthly', isPopular: true, features: ['Unlimited Guilds', 'AI Auto-Response Bot', 'Custom Bot Avatar & Token', 'Voice Channel Auto-Host'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-dc.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/dc-panel'
  },
  {
    id: 'bot-wa-crm',
    name: 'WhatsApp Business AI Sales & CRM Dashboard',
    platform: 'WhatsApp',
    shortDesc: 'Official Cloud API connector, automated cart recovery, catalog browsing & 24/7 AI sales closer.',
    fullDesc: 'Turn WhatsApp conversations into automated revenue. Connect your store directly to WhatsApp, trigger order tracking SMS/messages, send rich interactive button menus, and manage human handoffs seamlessly.',
    icon: 'MessageSquare',
    plans: [
      { id: 'pw1', name: 'Growth', price: 29.00, billingPeriod: 'monthly', features: ['1 Phone Number', '1,000 Free AI Conversations/mo', 'Catalog Sync', 'Order Status Automation'] },
      { id: 'pw2', name: 'Business Max', price: 79.00, billingPeriod: 'monthly', isPopular: true, features: ['5 Agents Multi-login', 'Unlimited AI Conversations', 'Broadcast Campaign Manager', 'Webhook API Access'] }
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    ],
    demoUrl: 'https://demo-wa.harconxs.com',
    docsUrl: 'https://docs.harconxs.com/wa-panel'
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
    recipient: 'Sarah',
    relationship: 'Girlfriend',
    occasion: 'Birthday',
    budgetRange: '$100 - $250',
    productType: 'Custom Handcrafted Mechanical Music Box with Holographic Portrait',
    description: 'I would like a vintage mahogany hand-crank music box that plays "La Vie En Rose", with a rotating acrylic photo cube inside engraved with our first trip to Paris.',
    preferredColors: ['Deep Rosewood', 'Antique Brass Gold', 'Ivory'],
    preferredStyle: 'Vintage Romantic Luxury',
    uploadedFiles: ['https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'],
    selectedPackagingId: 'pkg-luxury',
    targetDeliveryDate: '2026-09-01',
    status: 'Quoted',
    quote: {
      id: 'quote-co-1',
      amount: 175.00,
      shippingFee: 0.00,
      turnaroundDays: 7,
      notes: 'Includes custom 18-note Japanese Sankyo movement, laser-etched crystal photo cube, and Midnight Velvet presentation box with LED illuminate header.',
      packagingIncluded: 'Velvet Midnight Luxury Box',
      validUntil: '2026-08-30',
      status: 'pending_review'
    },
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Hamza Shahid',
        text: 'Hi Harconxs team! Can we make sure the wood has a warm gloss finish?',
        timestamp: '2026-08-15T11:20:00Z'
      },
      {
        id: 'm2',
        sender: 'admin',
        senderName: 'Atelier Master Julian',
        text: 'Hello Hamza! Absolutely. We apply 3 coats of organic beeswax polish for a deep lustrous satin feel. We have prepared quote #quote-co-1 for your review!',
        timestamp: '2026-08-15T12:05:00Z'
      }
    ],
    createdAt: '2026-08-15T10:30:00Z',
    updatedAt: '2026-08-15T12:05:00Z'
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
    name: 'Production Discord Bot Sync',
    prefix: 'hx_live_89a1...492b',
    createdAt: '2026-07-01',
    lastUsed: 'Just now',
    rateLimit: 120,
    requestCount: 14820,
    permissions: ['orders.read', 'bot.broadcast', 'webhooks.manage'],
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'Telegram VIP Webhook Gateway',
    prefix: 'hx_live_33f2...99ca',
    createdAt: '2026-07-15',
    lastUsed: '2 hours ago',
    rateLimit: 60,
    requestCount: 3940,
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

