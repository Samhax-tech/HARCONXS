import { PageRecord, PageSection, PageSectionType } from '../types';

export const INITIAL_HOME_PAGE_SECTIONS: PageSection[] = [
  {
    id: 'sec_hero',
    pageId: 'page_home',
    sectionType: 'hero',
    sortOrder: 1,
    isHidden: false,
    settings: {
      paddingTop: 'md',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      eyebrow: 'Haute Joaillerie & Bespoke Keepsakes',
      title: 'Artisanal Craftsmanship For Life’s Cherished Milestones',
      subtitle: 'Discover handcrafted coordinates jewelry, laser-engraved acrylic keepsakes, and private interactive couple websites designed to immortalize your memories.',
      primaryBtnText: 'Explore Catalog',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'Custom Commission',
      secondaryBtnLink: '/custom-products',
      bannerImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1600&auto=format&fit=crop&q=85',
      badgeText: 'Curated 2026 Collection',
      stats: [
        { label: 'Heirloom Gifts Crafted', value: '10,000+' },
        { label: 'Patron Rating', value: '4.9★' },
        { label: 'Turnaround Time', value: '24-48h' },
        { label: 'Insured Delivery', value: 'Pan-India' }
      ]
    }
  },
  {
    id: 'sec_featured_products',
    pageId: 'page_home',
    sectionType: 'featured_products',
    sortOrder: 2,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Atelier Spotlight',
      title: 'Featured Masterpieces & Bestsellers',
      subtitle: 'Handcrafted with hypoallergenic titanium, 18K gold finishes, and museum-grade laser precision.',
      filterCategory: 'all',
      itemLimit: 4,
      viewMode: 'grid',
      viewAllLink: '/shop'
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
      backgroundColor: '#0c0c0e',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Curated Collections',
      title: 'Engineered For Every Meaningful Connection',
      subtitle: 'Explore our specialized departments from fine jewelry to private digital portals.',
      categories: [
        {
          id: 'cat_couples',
          name: 'Couples & Matching',
          subtitle: 'Coordinates bracelets, acrylic song plaques & anniversary boxes',
          image: 'https://images.unsplash.com/photo-1611591475841-e40889c20a1f?w=800&auto=format&fit=crop&q=80',
          link: '/shop/couples',
          itemCount: '24 Pieces'
        },
        {
          id: 'cat_men',
          name: "Men's Collection",
          subtitle: 'Minimalist automatic watches, leather EDC & titanium cuff links',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
          link: '/shop/men',
          itemCount: '18 Pieces'
        },
        {
          id: 'cat_women',
          name: "Women's Atelier",
          subtitle: '18K opal pendants, diamond huggies & luxury velvet pouches',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
          link: '/shop/women',
          itemCount: '20 Pieces'
        },
        {
          id: 'cat_unisex',
          name: 'Unisex & Modular Carry',
          subtitle: 'Tactile brass keyrings, minimalist wallets & waterproof slings',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
          link: '/shop/unisex',
          itemCount: '15 Pieces'
        }
      ]
    }
  },
  {
    id: 'sec_couple_websites',
    pageId: 'page_home',
    sectionType: 'couple_websites',
    sortOrder: 4,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Digital Love Sanctuary',
      title: 'Private Interactive Couple Websites',
      subtitle: 'Celebrate your relationship journey with a dedicated subdomain, live second-by-second anniversary clock, ambient soundtrack playback, and encrypted photo vault.',
      subdomainExample: 'alex-and-maya.harconxs.com',
      ctaText: 'Build Your Sanctuary',
      ctaLink: '/couple-websites',
      features: [
        'Live Second-by-Second Anniversary Clock & Milestones',
        'Interactive Memory Wall & High-Definition Photo Vault',
        'Ambient Romantic Song Player with Spotify Sync',
        'Passcode Protection & Private Visitor Guestbook',
        'Instant Subdomain Deployment with Lifetime Cloud Hosting'
      ]
    }
  },
  {
    id: 'sec_custom_gifts',
    pageId: 'page_home',
    sectionType: 'custom_gifts',
    sortOrder: 5,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: '#0c0c0e',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Bespoke Studio',
      title: 'Turn Your Special Memories Into Tangible Art',
      subtitle: 'Upload custom sketches, song wavelengths, coordinates, or personalized dedications. Our master artisans hand-inspect every commission before laser etching.',
      ctaText: 'Start Custom Commission',
      ctaLink: '/custom-products',
      steps: [
        {
          step: '01',
          title: 'Submit Design Brief',
          desc: 'Choose your metal, solid wood base, custom engraving text, or upload artwork.'
        },
        {
          step: '02',
          title: 'Approve 3D Render',
          desc: 'Receive a high-resolution 3D proof in under 6 hours on your dashboard.'
        },
        {
          step: '03',
          title: 'Artisan Laser Fabrication',
          desc: 'Precision crafted in our master studio and delivered in a signature velvet box.'
        }
      ]
    }
  },
  {
    id: 'sec_support',
    pageId: 'page_home',
    sectionType: 'support',
    sortOrder: 6,
    isHidden: false,
    settings: {
      paddingTop: 'lg',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Client Care & Concierge',
      title: 'Here For You Every Step of the Way',
      subtitle: 'Track your live order milestones, explore frequently asked questions, or connect with our dedicated concierge team.',
      trackingPlaceholder: 'Enter your Order ID (e.g. HX-8291) or Phone...',
      faqItems: [
        {
          question: 'How fast is turnaround for personalized & custom items?',
          answer: 'Digital 3D proofs are delivered within 6 hours. Once approved, laser fabrication takes 24 to 48 hours, followed by 3-5 days insured express delivery.'
        },
        {
          question: 'How do Couple Website subdomains work?',
          answer: 'You choose a unique name (e.g. yournames.harconxs.com). Your private website is generated in 60 seconds with instant SSL, music player, and memory gallery.'
        },
        {
          question: 'What is your transit and damage policy?',
          answer: 'All shipments are 100% insured with express carriers. If any parcel is damaged in transit, we dispatch a priority replacement immediately at zero cost.'
        },
        {
          question: 'What payment options are supported?',
          answer: 'We support all major payment options: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Cash on Delivery on eligible physical items.'
        }
      ]
    }
  },
  {
    id: 'sec_trust_benefits',
    pageId: 'page_home',
    sectionType: 'trust_benefits',
    sortOrder: 7,
    isHidden: false,
    settings: {
      paddingTop: 'md',
      paddingBottom: 'lg',
      backgroundColor: '#09090b',
      containerWidth: 'wide'
    },
    content: {
      pillars: [
        {
          icon: 'Award',
          title: 'Master Craftsmanship',
          desc: 'Laser-calibrated precision with surgical titanium, sterling silver & 18K gold.'
        },
        {
          icon: 'Truck',
          title: 'Pan-India Insured Transit',
          desc: 'Express dispatch via BlueDart & Delhivery with real-time GPS tracking.'
        },
        {
          icon: 'Gift',
          title: 'Signature Gift Packaging',
          desc: 'Complimentary archival velvet gift boxes, wax seal & satin ribbon.'
        },
        {
          icon: 'ShieldCheck',
          title: 'Encrypted & Secure',
          desc: '256-bit SSL encrypted checkout with 100% buyer protection guarantee.'
        }
      ]
    }
  },
  {
    id: 'sec_cta',
    pageId: 'page_home',
    sectionType: 'cta',
    sortOrder: 8,
    isHidden: false,
    settings: {
      paddingTop: 'xl',
      paddingBottom: 'xl',
      backgroundColor: '#121215',
      containerWidth: 'wide'
    },
    content: {
      badge: 'Private Concierge Available',
      title: 'Celebrate Your Cherished Moments With HARCONXS',
      subtitle: 'From engraved keepsake jewelry to lifetime interactive couple memory websites, create an unforgettable tribute today.',
      primaryBtnText: 'Shop All Collections',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'Start Custom Commission',
      secondaryBtnLink: '/custom-products'
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
    defaultContent: {
      message: 'Exclusive Atelier Drop: Complimentary Handcrafted Velvet Gift Packaging & Insured Shipping on orders over ₹2,499.',
      highlightTag: 'LIMITED TIME',
      couponCode: 'WELCOME15',
      linkText: 'Explore Collection',
      linkUrl: '/shop'
    }
  },
  hero: {
    label: 'Hero Showcase',
    category: 'hero',
    description: 'High-impact display header with luxury background, dual CTAs, and feature stat pills.',
    iconName: 'Sparkles',
    defaultContent: {
      eyebrow: 'Haute Joaillerie & Bespoke Keepsakes',
      title: 'Artisanal Craftsmanship For Life’s Cherished Milestones',
      subtitle: 'Discover handcrafted coordinates jewelry, laser-engraved acrylic keepsakes, and private interactive couple websites designed to immortalize your memories.',
      primaryBtnText: 'Explore Catalog',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'Custom Commission',
      secondaryBtnLink: '/custom-products',
      bannerImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1600&auto=format&fit=crop&q=85',
      badgeText: 'Curated 2026 Collection',
      stats: [
        { label: 'Heirloom Gifts Crafted', value: '10,000+' },
        { label: 'Patron Rating', value: '4.9★' },
        { label: 'Turnaround Time', value: '24-48h' },
        { label: 'Insured Delivery', value: 'Pan-India' }
      ]
    }
  },
  banners: {
    label: 'Promotional Banners',
    category: 'ecommerce',
    description: 'Highlight discounts, flash drops, and collection premiere deals.',
    iconName: 'Tag',
    defaultContent: {
      badge: 'Season Premiere',
      title: 'The Royal Sovereign Collection',
      subtitle: 'Hand-forged Damascus steel & laser engraved tungsten bands made to immortalize your bond.',
      couponCode: 'ROYAL20',
      discountAmount: '20% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=80',
      ctaText: 'Claim Atelier Privilege',
      ctaLink: '/shop',
      style: 'card'
    }
  },
  categories: {
    label: 'Category Grid',
    category: 'ecommerce',
    description: 'Interactive visual grid linking to custom gifts, couple sites, and jewelry.',
    iconName: 'LayoutGrid',
    defaultContent: {
      badge: 'Curated Collections',
      title: 'Engineered For Every Meaningful Connection',
      subtitle: 'Explore our specialized departments from fine jewelry to private digital portals.',
      categories: [
        {
          id: 'cat_couples',
          name: 'Couples & Matching',
          subtitle: 'Coordinates bracelets, acrylic song plaques & anniversary boxes',
          image: 'https://images.unsplash.com/photo-1611591475841-e40889c20a1f?w=800&auto=format&fit=crop&q=80',
          link: '/shop/couples',
          itemCount: '24 Pieces'
        },
        {
          id: 'cat_men',
          name: "Men's Collection",
          subtitle: 'Minimalist automatic watches, leather EDC & titanium cuff links',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
          link: '/shop/men',
          itemCount: '18 Pieces'
        },
        {
          id: 'cat_women',
          name: "Women's Atelier",
          subtitle: '18K opal pendants, diamond huggies & luxury velvet pouches',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
          link: '/shop/women',
          itemCount: '20 Pieces'
        },
        {
          id: 'cat_unisex',
          name: 'Unisex & Modular Carry',
          subtitle: 'Tactile brass keyrings, minimalist wallets & waterproof slings',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
          link: '/shop/unisex',
          itemCount: '15 Pieces'
        }
      ]
    }
  },
  featured_products: {
    label: 'Featured Products',
    category: 'ecommerce',
    description: 'Dynamic product grid filtered by category or top curator picks.',
    iconName: 'ShoppingBag',
    defaultContent: {
      badge: 'Atelier Spotlight',
      title: 'Featured Masterpieces & Bestsellers',
      subtitle: 'Handcrafted with hypoallergenic titanium, 18K gold finishes, and museum-grade laser precision.',
      filterCategory: 'all',
      itemLimit: 4,
      viewMode: 'grid',
      viewAllLink: '/shop'
    }
  },
  best_sellers: {
    label: 'Best Sellers',
    category: 'ecommerce',
    description: 'Ranked top selling products with badge tags.',
    iconName: 'Award',
    defaultContent: {
      title: 'Top Rated Best Sellers',
      subtitle: 'Proven crowd favorites with 5-star verified customer acclaim.',
      itemLimit: 4,
      showRanking: true
    }
  },
  new_arrivals: {
    label: 'New Arrivals',
    category: 'ecommerce',
    description: 'Latest collection drops and fresh workshop releases.',
    iconName: 'Flame',
    defaultContent: {
      title: 'Fresh From The Workshop',
      subtitle: 'Newly released designs crafted with state-of-the-art precision tools.',
      itemLimit: 4,
      tagText: 'NEW DROP'
    }
  },
  custom_gifts: {
    label: 'Custom Gifts Atelier',
    category: 'bespoke',
    description: 'Interactive custom ordering workflow with 3-step proofing roadmap.',
    iconName: 'Gift',
    defaultContent: {
      badge: 'Bespoke Studio',
      title: 'Turn Your Special Memories Into Tangible Art',
      subtitle: 'Upload custom sketches, song wavelengths, coordinates, or personalized dedications. Our master artisans hand-inspect every commission before laser etching.',
      ctaText: 'Start Custom Commission',
      ctaLink: '/custom-products',
      steps: [
        {
          step: '01',
          title: 'Submit Design Brief',
          desc: 'Choose your metal, solid wood base, custom engraving text, or upload artwork.'
        },
        {
          step: '02',
          title: 'Approve 3D Render',
          desc: 'Receive a high-resolution 3D proof in under 6 hours on your dashboard.'
        },
        {
          step: '03',
          title: 'Artisan Laser Fabrication',
          desc: 'Precision crafted in our master studio and delivered in a signature velvet box.'
        }
      ]
    }
  },
  couple_websites: {
    label: 'Couple Websites & Subdomains',
    category: 'bespoke',
    description: 'Interactive feature spotlight for custom romantic subdomains and anniversaries.',
    iconName: 'Heart',
    defaultContent: {
      badge: 'Digital Love Sanctuary',
      title: 'Private Interactive Couple Websites',
      subtitle: 'Celebrate your relationship journey with a dedicated subdomain, live second-by-second anniversary clock, ambient soundtrack playback, and encrypted photo vault.',
      subdomainExample: 'alex-and-maya.harconxs.com',
      ctaText: 'Build Your Sanctuary',
      ctaLink: '/couple-websites',
      features: [
        'Live Second-by-Second Anniversary Clock & Milestones',
        'Interactive Memory Wall & High-Definition Photo Vault',
        'Ambient Romantic Song Player with Spotify Sync',
        'Passcode Protection & Private Visitor Guestbook',
        'Instant Subdomain Deployment with Lifetime Cloud Hosting'
      ]
    }
  },
  bot_panels: {
    label: 'Bot Panels & Automation',
    category: 'bespoke',
    description: 'Digital automation panels and workflows.',
    iconName: 'Cpu',
    defaultContent: {
      title: 'Digital Systems',
      subtitle: 'Dedicated systems and workflows.'
    }
  },
  testimonials: {
    label: 'Patron Testimonials',
    category: 'social',
    description: 'Verified patron quotes with avatar pictures and product context.',
    iconName: 'Quote',
    defaultContent: {
      title: 'Echoes From Our Patrons',
      subtitle: 'Read genuine notes from individuals who trusted HARCONXS for life milestones.',
      testimonials: [
        {
          author: 'Vikram & Ananya S.',
          location: 'Mumbai, MH',
          product: 'Eternal Couple Website & Subdomain',
          quote: 'Our anniversary subdomain brought tears to my wife’s eyes. The music player and live second counter made our dinner unforgettable.',
          rating: 5
        },
        {
          author: 'Kabir Mehta',
          location: 'Bengaluru, KA',
          product: 'Laser Engraved Obsidian Keepsake',
          quote: 'The craftsmanship is staggering. The wood grain and fiber-laser engraving were flawlessly sharp. Shipped in premium velvet within 48h.',
          rating: 5
        }
      ]
    }
  },
  reviews: {
    label: 'Customer Reviews Rating',
    category: 'social',
    description: 'Aggregated review score, star breakdown, and verified purchase cards.',
    iconName: 'Star',
    defaultContent: {
      title: 'Verified Customer Reviews',
      subtitle: 'Transparent evaluations collected after confirmed parcel delivery.',
      averageRating: 4.9,
      totalReviewsCount: 1284
    }
  },
  faq: {
    label: 'FAQ Accordion',
    category: 'social',
    description: 'Searchable question and answer accordion for delivery, bespoke, and returns.',
    iconName: 'HelpCircle',
    defaultContent: {
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
        }
      ]
    }
  },
  support: {
    label: 'Client Care & Support',
    category: 'social',
    description: 'Order tracking, direct concierge support, and FAQ solutions.',
    iconName: 'HelpCircle',
    defaultContent: {
      badge: 'Client Care & Concierge',
      title: 'Here For You Every Step of the Way',
      subtitle: 'Track your live order milestones, explore frequently asked questions, or connect with our dedicated concierge team.',
      trackingPlaceholder: 'Enter your Order ID (e.g. HX-8291) or Phone...',
      faqItems: [
        {
          question: 'How fast is turnaround for personalized & custom items?',
          answer: 'Digital 3D proofs are delivered within 6 hours. Once approved, laser fabrication takes 24 to 48 hours, followed by 3-5 days insured express delivery.'
        },
        {
          question: 'How do Couple Website subdomains work?',
          answer: 'You choose a unique name (e.g. yournames.harconxs.com). Your private website is generated in 60 seconds with instant SSL, music player, and memory gallery.'
        }
      ]
    }
  },
  trust_benefits: {
    label: 'Trust & Value Pillars',
    category: 'social',
    description: 'Key guarantees including 100% insured transit, laser craftsmanship, and signature packaging.',
    iconName: 'ShieldCheck',
    defaultContent: {
      pillars: [
        {
          icon: 'Award',
          title: 'Master Craftsmanship',
          desc: 'Laser-calibrated precision with surgical titanium, sterling silver & 18K gold.'
        },
        {
          icon: 'Truck',
          title: 'Pan-India Insured Transit',
          desc: 'Express dispatch via BlueDart & Delhivery with real-time GPS tracking.'
        },
        {
          icon: 'Gift',
          title: 'Signature Gift Packaging',
          desc: 'Complimentary archival velvet gift boxes, wax seal & satin ribbon.'
        },
        {
          icon: 'ShieldCheck',
          title: 'Encrypted & Secure',
          desc: '256-bit SSL encrypted checkout with 100% buyer protection guarantee.'
        }
      ]
    }
  },
  cta: {
    label: 'Call To Action (CTA)',
    category: 'hero',
    description: 'Conversion-focused section with trust badges and direct concierge buttons.',
    iconName: 'ArrowRightCircle',
    defaultContent: {
      badge: 'Private Concierge Available',
      title: 'Celebrate Your Cherished Moments With HARCONXS',
      subtitle: 'From engraved keepsake jewelry to lifetime interactive couple memory websites, create an unforgettable tribute today.',
      primaryBtnText: 'Shop All Collections',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'Start Custom Commission',
      secondaryBtnLink: '/custom-products'
    }
  },
  newsletter: {
    label: 'Newsletter Atelier Circle',
    category: 'social',
    description: 'Email capture form with discount code incentive and spam disclaimer.',
    iconName: 'Mail',
    defaultContent: {
      title: 'Join The HARCONXS Atelier Circle',
      subtitle: 'Receive exclusive early-access drops, private bespoke discounts, and secret collection previews directly in your inbox.',
      inputPlaceholder: 'Enter your patron email address...',
      buttonText: 'Subscribe to Atelier Circle'
    }
  },
  footer: {
    label: 'Site Footer',
    category: 'footer',
    description: 'Brand summary, navigation columns, payment security badges, and copyright.',
    iconName: 'ShieldCheck',
    defaultContent: {
      brandName: 'HARCONXS',
      tagline: 'Artisanal atelier and bespoke digital sanctuaries.',
      supportEmail: 'concierge@harconxs.com'
    }
  }
};

export const SECTION_TYPE_METADATA = SECTION_METADATA_DEFINITIONS;
