import { PageRecord, PageSection, PageSectionType } from '../types';

export const INITIAL_HOME_PAGE_SECTIONS: PageSection[] = [
  {
    id: 'sec_announcement_bar',
    pageId: 'page_home',
    sectionType: 'announcement_bar',
    sortOrder: 0,
    isHidden: false,
    settings: {
      paddingTop: 'none',
      paddingBottom: 'none',
      backgroundColor: '#09090b',
      textColor: '#f59e0b',
      animation: 'fade',
      containerWidth: 'full'
    },
    content: {
      message: 'Exclusive Atelier Drop: Complimentary Handcrafted Velvet Gift Packaging & Insured Shipping on orders over ₹2,499.',
      highlightTag: 'LIMITED TIME',
      couponCode: 'ATELIER2026',
      badgeText: 'BESPOKE LUXURY',
      linkText: 'Explore Collection',
      linkUrl: '#featured',
      showCountdown: true,
      countdownTarget: '2026-12-31T23:59:59',
      marqueeSpeed: 'normal'
    }
  },
  {
    id: 'sec_hero',
    pageId: 'page_home',
    sectionType: 'hero',
    sortOrder: 1,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'xl',
      backgroundColor: '#09090b',
      backgroundGradient: 'radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.15), rgba(9, 9, 11, 0.95))',
      textColor: '#f4f4f5',
      containerWidth: 'wide'
    },
    content: {
      eyebrow: 'Artisanal Craftsmanship & Digital Sanctuary',
      title: 'Bespoke Luxury Crafted For Eternal Memories',
      subtitle: 'Immerse in handcrafted heirloom jewelry, personalized keepsake sanctuaries, custom couple subdomains, and ultra-low latency bot panels.',
      primaryBtnText: 'Explore Atelier Products',
      primaryBtnLink: '#catalog',
      secondaryBtnText: 'Custom Atelier Order',
      secondaryBtnLink: '#custom-atelier',
      bannerImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1600&auto=format&fit=crop&q=85',
      overlayOpacity: 0.65,
      alignment: 'center',
      stats: [
        { label: 'Artisan Sanctuaries Created', value: '2,400+' },
        { label: 'Average Patron Rating', value: '4.9★' },
        { label: 'Laser Engraving Turnaround', value: '24-48h' },
        { label: 'Insured Delivery Coverage', value: 'Pan-India' }
      ]
    }
  },
  {
    id: 'sec_banners',
    pageId: 'page_home',
    sectionType: 'banners',
    sortOrder: 2,
    isHidden: false,
    settings: {
      paddingTop: 'md',
      paddingBottom: 'md',
      backgroundColor: '#121215',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Season Premiere',
      title: 'The Royal Sovereign Collection',
      subtitle: 'Hand-forged Damascus steel & laser engraved tungsten bands made to immortalize your bond.',
      couponCode: 'ROYAL20',
      discountAmount: '20% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=80',
      ctaText: 'Claim Atelier Privilege',
      ctaLink: '#catalog',
      style: 'card'
    }
  },
  {
    id: 'sec_categories',
    pageId: 'page_home',
    sectionType: 'categories',
    sortOrder: 3,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      title: 'Curated Atelier Departments',
      subtitle: 'From physical personalized treasures to dedicated digital sanctuaries and automation cloud.',
      columns: 4,
      categories: [
        {
          id: 'cat_custom',
          name: 'Custom Gifts & Keepsakes',
          subtitle: 'Laser engraved wooden plaques, acrylic art & memory boxes',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
          link: '#catalog'
        },
        {
          id: 'cat_couples',
          name: 'Couple Websites & Subdomains',
          subtitle: 'Interactive live anniversary counters, photo walls & music',
          image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
          link: '#couple-sites'
        },
        {
          id: 'cat_digital',
          name: 'Digital Services & Assets',
          subtitle: 'High-resolution digital portraits, video montages & invites',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          link: '#catalog'
        },
        {
          id: 'cat_bots',
          name: 'Bot Panels & Automation Cloud',
          subtitle: 'Telegram VIP gateways, Discord bot moderation & API engines',
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
          link: '#bot-panels'
        }
      ]
    }
  },
  {
    id: 'sec_featured_products',
    pageId: 'page_home',
    sectionType: 'featured_products',
    sortOrder: 4,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#0c0c0e',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Curator Choice',
      title: 'Featured Masterpieces',
      subtitle: 'Most cherished physical and digital crafts from our master artisans.',
      filterCategory: 'all',
      itemLimit: 6,
      viewMode: 'grid'
    }
  },
  {
    id: 'sec_best_sellers',
    pageId: 'page_home',
    sectionType: 'best_sellers',
    sortOrder: 5,
    isHidden: false,
    settings: {
      paddingTop: 'md',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      title: 'Top Rated Best Sellers',
      subtitle: 'Proven crowd favorites with 5-star verified customer acclaim.',
      itemLimit: 4,
      showRanking: true
    }
  },
  {
    id: 'sec_new_arrivals',
    pageId: 'page_home',
    sectionType: 'new_arrivals',
    sortOrder: 6,
    isHidden: false,
    settings: {
      paddingTop: 'md',
      paddingBottom: 'lg',
      backgroundColor: '#0e0e11',
      containerWidth: 'wide'
    },
    content: {
      title: 'Fresh From The Workshop',
      subtitle: 'Newly released designs crafted with state-of-the-art precision tools.',
      itemLimit: 4,
      tagText: 'NEW DROP'
    }
  },
  {
    id: 'sec_custom_gifts',
    pageId: 'page_home',
    sectionType: 'custom_gifts',
    sortOrder: 7,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: '#09090b',
      backgroundGradient: 'linear-gradient(180deg, #09090b 0%, #17171d 100%)',
      containerWidth: 'wide'
    },
    content: {
      eyebrow: 'Bespoke Commission Studio',
      title: 'Turn Your Intimate Memories Into Tangible Art',
      subtitle: 'Upload custom sketches, song wavelengths, Spotify codes, or coordinate engravings. Our artisans hand-inspect every detail before firing high-precision fiber lasers.',
      primaryBtnText: 'Launch Custom Order Studio',
      primaryBtnLink: '#custom-atelier',
      steps: [
        { step: '01', title: 'Submit Custom Brief', desc: 'Specify dimensions, metal, wood finish, and engrave text.' },
        { step: '02', title: 'Approve 3D Render', desc: 'Receive high-res 3D proof on your patron dashboard in under 6 hours.' },
        { step: '03', title: 'Artisan Laser Engrave', desc: 'Precision crafted in our master atelier and shipped in velvet gift box.' }
      ]
    }
  },
  {
    id: 'sec_couple_websites',
    pageId: 'page_home',
    sectionType: 'couple_websites',
    sortOrder: 8,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: '#0c0a09',
      containerWidth: 'wide'
    },
    content: {
      eyebrow: 'Digital Love Sanctuary',
      title: 'Your Dedicated Couple Website & Custom Subdomain',
      subtitle: 'Celebrate your relationship journey with a private, permanent digital sanctuary featuring live second-by-second anniversary clocks, photo vaults, ambient soundtrack player, and guestbook.',
      subdomainExample: 'alex-and-maya.harconxs.com',
      ctaText: 'Build Your Love Sanctuary',
      ctaLink: '#couple-sites',
      features: [
        'Live Second Counter & Milestone Predictor',
        'Interactive Memory Wall & Timeline Slideshow',
        'Background Romantic Ambient Soundtrack Player',
        'Digital Love Notes & Guestbook with Moderation',
        'Passcode Protection & Private Share Links'
      ]
    }
  },
  {
    id: 'sec_bot_panels',
    pageId: 'page_home',
    sectionType: 'bot_panels',
    sortOrder: 9,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      eyebrow: 'Enterprise Automation Cloud',
      title: 'High-Frequency Bot Panels & Realtime Gateways',
      subtitle: 'Deploy hardened Telegram VIP channel paywalls, Discord community moderation engines, and WhatsApp CRM bot flows backed by 99.99% uptime SLAs and Supabase infrastructure.',
      ctaText: 'Explore Bot Cloud Services',
      ctaLink: '#bot-panels',
      metrics: [
        { label: 'Uptime SLA', value: '99.99%' },
        { label: 'Webhook Latency', value: '< 38ms' },
        { label: 'Active Automated Channels', value: '14,200+' }
      ]
    }
  },
  {
    id: 'sec_testimonials',
    pageId: 'page_home',
    sectionType: 'testimonials',
    sortOrder: 10,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#121215',
      containerWidth: 'wide'
    },
    content: {
      title: 'Echoes From Our Patrons',
      subtitle: 'Read genuine notes from individuals who trusted HARCONXS for life milestones.',
      testimonials: [
        {
          author: 'Vikram & Ananya S.',
          location: 'Mumbai, MH',
          product: 'Eternal Couple Website & Subdomain',
          quote: 'Our anniversary subdomain brought tears to my wife’s eyes. The music player and live second counter made our dinner unforgettable.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        },
        {
          author: 'Kabir Mehta',
          location: 'Bengaluru, KA',
          product: 'Laser Engraved Obsidian Keepsake',
          quote: 'The craftsmanship is staggering. The wood grain and fiber-laser engraving were flawlessly sharp. Shipped in premium velvet within 48h.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
        },
        {
          author: 'Siddharth Rao',
          location: 'Hyderabad, TS',
          product: 'Telegram VIP Bot Panel Cloud',
          quote: 'Zero downtime and instant UPI webhook verification for all my 5,000+ members. The best automation gateway in India hands down.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
        }
      ]
    }
  },
  {
    id: 'sec_reviews',
    pageId: 'page_home',
    sectionType: 'reviews',
    sortOrder: 11,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      title: 'Verified Customer Reviews',
      subtitle: 'Transparent evaluations collected after confirmed parcel delivery.',
      averageRating: 4.9,
      totalReviewsCount: 1284,
      showPhotoFilter: true,
      displayMode: 'cards'
    }
  },
  {
    id: 'sec_faq',
    pageId: 'page_home',
    sectionType: 'faq',
    sortOrder: 12,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#0d0d10',
      containerWidth: 'normal'
    },
    content: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about bespoke customization, delivery timelines, and digital subdomain setups.',
      items: [
        {
          question: 'How fast is the turnaround for custom laser-engraved items?',
          answer: 'All bespoke orders are rendered into a 3D proof within 6 hours. Once you approve the digital proof, laser engraving takes 24 to 48 hours, followed by insured express courier transit (3-5 business days across India).'
        },
        {
          question: 'How does the Couple Website subdomain work?',
          answer: 'You choose a unique subdomain like "alex-and-maya.harconxs.com". Your website is provisioned in under 60 seconds with instant SSL, passcode encryption, ambient soundtrack playback, and lifetime hosting.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We support all major payment options via Razorpay & Cashfree: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, Mastercard, RuPay), Net Banking across 50+ banks, and Cash on Delivery for eligible items.'
        },
        {
          question: 'What if my package is damaged during shipping?',
          answer: 'Every HARCONXS parcel is covered under 100% insured courier coverage. If damaged upon receipt, simply send a photo on our 24/7 concierge or chat for an instant priority remake and reshipment free of charge.'
        }
      ]
    }
  },
  {
    id: 'sec_cta',
    pageId: 'page_home',
    sectionType: 'cta',
    sortOrder: 13,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: '#17171d',
      backgroundGradient: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.25), rgba(9, 9, 11, 0.95))',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Private Concierge Access',
      title: 'Create Something Truly Extraordinary Today',
      subtitle: 'Whether preserving a golden milestone or powering thousands of automated transactions, HARCONXS delivers unmatched sophistication.',
      primaryBtnText: 'Start Custom Commission',
      primaryBtnLink: '#custom-atelier',
      secondaryBtnText: 'Contact 24/7 Concierge',
      secondaryBtnLink: '#chat-concierge',
      trustBullets: [
        '100% Insured Delivery',
        '30-Day Satisfaction Guarantee',
        '24/7 Dedicated Artisan Support'
      ]
    }
  },
  {
    id: 'sec_newsletter',
    pageId: 'page_home',
    sectionType: 'newsletter',
    sortOrder: 14,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'normal'
    },
    content: {
      title: 'Join The HARCONXS Atelier Circle',
      subtitle: 'Receive exclusive early-access drops, private bespoke discounts, and secret collection previews directly in your inbox.',
      incentiveText: 'Get ₹500 off your first bespoke order with code ATELIER500 upon subscription.',
      inputPlaceholder: 'Enter your patron email address...',
      buttonText: 'Subscribe to Atelier Circle',
      disclaimer: 'We respect your privacy. Unsubscribe anytime with 1-click.'
    }
  },
  {
    id: 'sec_footer',
    pageId: 'page_home',
    sectionType: 'footer',
    sortOrder: 15,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'lg',
      backgroundColor: '#050507',
      containerWidth: 'wide'
    },
    content: {
      brandName: 'HARCONXS',
      tagline: 'Artisanal atelier, bespoke digital sanctuaries, and enterprise automation infrastructure.',
      supportEmail: 'concierge@harconxs.com',
      supportPhone: '+91 (080) 4892-3000',
      address: 'HARCONXS Atelier Studios, Indiranagar, Bengaluru, KA 560038',
      socials: {
        instagram: 'https://instagram.com/harconxs',
        youtube: 'https://youtube.com/@harconxs',
        telegram: 'https://t.me/harconxs_official',
        discord: 'https://discord.gg/harconxs'
      },
      copyright: '© 2026 HARCONXS. All rights reserved. Registered Artisan Atelier & Digital Infrastructure.'
    }
  }
];

export const INITIAL_HOME_PAGE_RECORD: PageRecord = {
  id: 'page_home',
  slug: 'home',
  title: 'HARCONXS Official Storefront & Digital Sanctuary',
  status: 'published',
  meta: {
    description: 'Discover handcrafted luxury jewelry, custom personalized keepsakes, bespoke couple websites, and high-frequency bot automation cloud at HARCONXS.',
    keywords: 'HARCONXS, bespoke jewelry, custom gifts, couple websites, bot panels, luxury keepsakes',
    ogImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&auto=format&fit=crop&q=80'
  },
  sections: INITIAL_HOME_PAGE_SECTIONS,
  publishedAt: '2026-01-01T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z'
};

export const SECTION_METADATA_DEFINITIONS: Record<PageSectionType, {
  label: string;
  category: 'header' | 'hero' | 'ecommerce' | 'bespoke' | 'social' | 'footer';
  description: string;
  iconName: string;
  defaultContent: any;
}> = {
  announcement_bar: {
    label: 'Announcement Bar',
    category: 'header',
    description: 'Top persistent promotional banner with marquee text, coupon tags & countdown timer.',
    iconName: 'Megaphone',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[0].content
  },
  hero: {
    label: 'Hero Showcase',
    category: 'hero',
    description: 'High-impact display header with luxury background, dual CTAs, and feature stat pills.',
    iconName: 'Sparkles',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[1].content
  },
  banners: {
    label: 'Promotional Banners',
    category: 'ecommerce',
    description: 'Highlight discounts, flash drops, and collection premiere deals.',
    iconName: 'Tag',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[2].content
  },
  categories: {
    label: 'Category Grid',
    category: 'ecommerce',
    description: 'Interactive visual grid linking to custom gifts, couple sites, digital, and bots.',
    iconName: 'LayoutGrid',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[3].content
  },
  featured_products: {
    label: 'Featured Products',
    category: 'ecommerce',
    description: 'Dynamic product grid filtered by category or top curator picks.',
    iconName: 'ShoppingBag',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[4].content
  },
  best_sellers: {
    label: 'Best Sellers',
    category: 'ecommerce',
    description: 'Ranked top selling products with badge tags.',
    iconName: 'Award',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[5].content
  },
  new_arrivals: {
    label: 'New Arrivals',
    category: 'ecommerce',
    description: 'Latest collection drops and fresh workshop releases.',
    iconName: 'Flame',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[6].content
  },
  custom_gifts: {
    label: 'Custom Gifts Atelier',
    category: 'bespoke',
    description: 'Interactive custom ordering workflow with 3-step proofing roadmap.',
    iconName: 'Gift',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[7].content
  },
  couple_websites: {
    label: 'Couple Websites & Subdomains',
    category: 'bespoke',
    description: 'Interactive feature spotlight for custom romantic subdomains and anniversaries.',
    iconName: 'Heart',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[8].content
  },
  bot_panels: {
    label: 'Bot Panels & Automation',
    category: 'bespoke',
    description: 'High-frequency webhook gateways, Telegram channels & Discord automation showcase.',
    iconName: 'Cpu',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[9].content
  },
  testimonials: {
    label: 'Patron Testimonials',
    category: 'social',
    description: 'Verified patron quotes with avatar pictures and product context.',
    iconName: 'Quote',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[10].content
  },
  reviews: {
    label: 'Customer Reviews Rating',
    category: 'social',
    description: 'Aggregated review score, star breakdown, and verified purchase cards.',
    iconName: 'Star',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[11].content
  },
  faq: {
    label: 'FAQ Accordion',
    category: 'social',
    description: 'Searchable question and answer accordion for delivery, bespoke, and returns.',
    iconName: 'HelpCircle',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[12].content
  },
  cta: {
    label: 'Call To Action (CTA)',
    category: 'hero',
    description: 'Conversion-focused section with trust badges and direct concierge buttons.',
    iconName: 'ArrowRightCircle',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[13].content
  },
  newsletter: {
    label: 'Newsletter Atelier Circle',
    category: 'social',
    description: 'Email capture form with discount code incentive and spam disclaimer.',
    iconName: 'Mail',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[14].content
  },
  footer: {
    label: 'Site Footer',
    category: 'footer',
    description: 'Brand summary, navigation columns, payment security badges, and copyright.',
    iconName: 'ShieldCheck',
    defaultContent: INITIAL_HOME_PAGE_SECTIONS[15].content
  }
};

export const SECTION_TYPE_METADATA = SECTION_METADATA_DEFINITIONS;
