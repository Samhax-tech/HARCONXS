import { 
  CoupleTemplateId, 
  CoupleSiteThemeConfig, 
  CoupleSiteSection, 
  CoupleSitePage,
  CoupleSiteSettings
} from '../types';

export interface CoupleTemplateDefinition {
  id: CoupleTemplateId;
  name: string;
  category: string;
  tagline: string;
  description: string;
  previewImage: string;
  theme: CoupleSiteThemeConfig;
  defaultPages: Omit<CoupleSitePage, 'id' | 'site_id' | 'created_at' | 'updated_at'>[];
  defaultSections: Omit<CoupleSiteSection, 'id' | 'site_id' | 'page_id' | 'created_at' | 'updated_at'>[];
  defaultSettings: Partial<CoupleSiteSettings>;
}

// -----------------------------------------------------------------------------
// 1. CLASSIC ROMANCE TEMPLATE
// -----------------------------------------------------------------------------
export const CLASSIC_ROMANCE_TEMPLATE: CoupleTemplateDefinition = {
  id: 'classic-romance',
  name: 'Classic Romance',
  category: 'Romantic & Floral',
  tagline: 'Timeless floral serenity, soft blush tones, and delicate serif elegance.',
  description: 'An ethereal sanctuary featuring floating rose petals, soft ivory surfaces, gentle music accompaniment, and romantic story chapters.',
  previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  theme: {
    id: 'theme-classic-romance',
    name: 'Blush & Ivory Romance',
    palette: {
      primary: '#B76E79', // Rose gold
      secondary: '#E07A5F', // Terra cotta rose
      background: '#140E10', // Deep velvety espresso rose
      surface: '#201518', // Velvet dark wine
      textPrimary: '#FDF8F5', // Soft ivory
      textSecondary: '#D4B8BC', // Dusty rose
      accent: '#F4A261', // Warm champagne
      border: '#3D252C' // Subtle rose border
    },
    fonts: {
      heading: '"Playfair Display", Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif'
    },
    borderRadius: 'lg',
    ambientEffect: 'petals',
    headerStyle: 'floating'
  },
  defaultPages: [
    { slug: 'home', title: 'Sanctuary', sort_order: 0, is_home: true }
  ],
  defaultSections: [
    {
      section_type: 'hero',
      sort_order: 0,
      title: 'Our Timeless Sanctuary',
      subtitle: 'Where every heartbeat whispers your name',
      content: {
        heroBadge: 'Together Forever',
        heroQuote: '“In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.”',
        backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'Explore Our Story',
        showTimerPreview: true
      },
      is_visible: true
    },
    {
      section_type: 'countdown',
      sort_order: 1,
      title: 'Days of Loving You',
      subtitle: 'Every second by your side is our sweetest blessing',
      content: {
        anniversaryLabel: 'Celebrating Our Journey Since',
        showMilestones: true,
        milestones: [
          { label: 'First Date', date: '2022-06-14', note: 'Under the summer stars in Paris' },
          { label: 'Said Yes', date: '2023-11-20', note: 'A promise written in gold' },
          { label: 'Eternal Vows', date: '2024-05-18', note: 'Two souls, one forever' }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'story',
      sort_order: 2,
      title: 'The Chapters of Us',
      subtitle: 'From accidental glances to endless devotion',
      content: {
        chapters: [
          {
            number: 'Chapter I',
            title: 'Serendipity in Paris',
            date: 'June 2022',
            text: 'It was a rainy afternoon at a quaint corner café. Our eyes met through the fogged glass, and a simple shared umbrella changed the trajectory of our lives forever.',
            image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
          },
          {
            number: 'Chapter II',
            title: 'The Golden Promise',
            date: 'November 2023',
            text: 'Overlooking the Amalfi cliffs at twilight, on bended knee with hands trembling, a question was asked and an ecstatic "Yes!" echoed into the sunset.',
            image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'gallery',
      sort_order: 3,
      title: 'Moments Frozen in Amber',
      subtitle: 'A visual archive of laughter, travels, and silent embraces',
      content: {
        layout: 'masonry',
        items: [
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', caption: 'Sunset walk in Montmartre', date: 'July 2023' },
          { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80', caption: 'Quiet Sunday mornings at home', date: 'Sept 2023' },
          { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', caption: 'Our engagement night', date: 'Nov 2023' },
          { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80', caption: 'First trip to Kyoto together', date: 'Spring 2024' }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'love_letters',
      sort_order: 4,
      title: 'Sealed with a Promise',
      subtitle: 'Handwritten words that will outlive the stars',
      content: {
        letters: [
          {
            to: 'My Beloved',
            from: 'Your Forever',
            date: 'Our Anniversary',
            excerpt: 'I love you not only for who you are, but for who I am when I am with you...',
            waxSealColor: '#B76E79'
          }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'wishes_guestbook',
      sort_order: 5,
      title: 'Wishes & Blessings',
      subtitle: 'Leave a note of love for the couple',
      content: {
        allowPublicWishes: true,
        placeholderText: 'Write your heartfelt blessing or memory...'
      },
      is_visible: true
    }
  ],
  defaultSettings: {
    music_url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
    music_title: 'Clair de Lune (Acoustic Reverie)',
    music_autoplay: false,
    is_password_protected: false
  }
};

// -----------------------------------------------------------------------------
// 2. MINIMAL TEMPLATE
// -----------------------------------------------------------------------------
export const MINIMAL_TEMPLATE: CoupleTemplateDefinition = {
  id: 'minimal',
  name: 'Minimal',
  category: 'Modern & Architectural',
  tagline: 'Monochrome precision, stark breathing room, and pure typography.',
  description: 'A quiet, unembellished sanctuary designed with high spatial contrast, sharp hairline borders, and pure focus on imagery and text.',
  previewImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
  theme: {
    id: 'theme-minimal',
    name: 'Architectural Slate',
    palette: {
      primary: '#FAFAFA', // Pure snow
      secondary: '#A1A1AA', // Zinc muted
      background: '#09090B', // Pitch obsidian
      surface: '#121215', // Pure zinc charcoal
      textPrimary: '#FAFAFA', // Sharp white
      textSecondary: '#71717A', // Graphite
      accent: '#E4E4E7', // Silver highlight
      border: '#27272A' // Hairline rule
    },
    fonts: {
      heading: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      body: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
    },
    borderRadius: 'sm',
    ambientEffect: 'none',
    headerStyle: 'minimal'
  },
  defaultPages: [
    { slug: 'home', title: 'Index', sort_order: 0, is_home: true }
  ],
  defaultSections: [
    {
      section_type: 'hero',
      sort_order: 0,
      title: 'A & J',
      subtitle: 'Two lives in quiet alignment.',
      content: {
        heroBadge: 'EST. 2023',
        heroQuote: 'Love is not something you find. Love is something that finds you.',
        backgroundImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'View Timeline'
      },
      is_visible: true
    },
    {
      section_type: 'countdown',
      sort_order: 1,
      title: 'Elapsed Duration',
      subtitle: 'Time measured in presence.',
      content: {
        anniversaryLabel: 'Commenced',
        minimalistMode: true
      },
      is_visible: true
    },
    {
      section_type: 'timeline',
      sort_order: 2,
      title: 'Milestones',
      subtitle: 'Key coordinates in our continuum.',
      content: {
        milestones: [
          { date: '2023.01.12', title: 'First Encounter', detail: 'Tokyo, Japan (35.6762° N, 139.6503° E)' },
          { date: '2023.08.05', title: 'Shared Horizon', detail: 'Moved into our first apartment' },
          { date: '2024.04.19', title: 'The Commitment', detail: 'Exchanged vows in private ceremony' }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'gallery',
      sort_order: 3,
      title: 'Select Plates',
      subtitle: 'Documentary captures without filters.',
      content: {
        layout: 'grid',
        items: [
          { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80', caption: 'Morning light', date: '2024' },
          { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80', caption: 'Kyoto station', date: '2024' },
          { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80', caption: 'Shadows on wall', date: '2024' }
        ]
      },
      is_visible: true
    }
  ],
  defaultSettings: {
    is_password_protected: false,
    music_autoplay: false
  }
};

// -----------------------------------------------------------------------------
// 3. DARK LUXURY TEMPLATE
// -----------------------------------------------------------------------------
export const DARK_LUXURY_TEMPLATE: CoupleTemplateDefinition = {
  id: 'dark-luxury',
  name: 'Dark Luxury',
  category: 'High Jewellery & Haute Couture',
  tagline: 'Deep velvet obsidian, 24K gold foil borders, and royal majesty.',
  description: 'Inspired by fine heirloom jewellery ateliers: deep obsidian foundations, radiant gold typography, stardust ambient particles, and opulent memory vaults.',
  previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
  theme: {
    id: 'theme-dark-luxury',
    name: 'Obsidian & Gold Leaf',
    palette: {
      primary: '#D4AF37', // 24K Gold
      secondary: '#F3E5AB', // Pale champagne gold
      background: '#070709', // Deepest obsidian
      surface: '#111115', // Polished onyx
      textPrimary: '#FAF8F0', // Warm gold silk
      textSecondary: '#A8A29E', // Antique silver
      accent: '#FFD700', // Pure metallic shine
      border: '#2C261A' // Burnished brass border
    },
    fonts: {
      heading: '"Cinzel", "Playfair Display", Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif'
    },
    borderRadius: 'md',
    ambientEffect: 'stars',
    headerStyle: 'floating'
  },
  defaultPages: [
    { slug: 'home', title: 'Atelier Vault', sort_order: 0, is_home: true }
  ],
  defaultSections: [
    {
      section_type: 'hero',
      sort_order: 0,
      title: 'The Royal Covenant',
      subtitle: 'Forged in devotion, adorned in gold',
      content: {
        heroBadge: 'HAUTE ROMANCE',
        heroQuote: '“Two souls united not merely for a lifetime, but for eternity.”',
        backgroundImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'Enter The Vault'
      },
      is_visible: true
    },
    {
      section_type: 'countdown',
      sort_order: 1,
      title: 'Our Golden Era',
      subtitle: 'Counting every gilded moment in our sovereign reign',
      content: {
        anniversaryLabel: 'Enthroned Since',
        goldAccent: true
      },
      is_visible: true
    },
    {
      section_type: 'memory_vault',
      sort_order: 2,
      title: 'The Sovereign Reliquary',
      subtitle: 'Private letters, sealed confessions, and timeless vows',
      content: {
        vaultItems: [
          {
            title: 'The First Vow',
            date: 'May 2023',
            type: 'audio',
            description: 'Private recorded voice note from the balcony under moonlit Venice.',
            isLocked: false
          },
          {
            title: 'Anniversary Time Capsule',
            date: '2026 Milestone',
            type: 'capsule',
            description: 'Unlocks automatically on our 5th anniversary celebration.',
            isLocked: true
          }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'gallery',
      sort_order: 3,
      title: 'The Royal Collection',
      subtitle: 'Curated portraits framed in antique gold leaf',
      content: {
        layout: 'masonry',
        items: [
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', caption: 'Gala Night, Monaco', date: '2023' },
          { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', caption: 'Exchanging rings', date: '2024' },
          { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80', caption: 'The Grand Ballroom', date: '2024' }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'wishes_guestbook',
      sort_order: 4,
      title: 'The Golden Ledger',
      subtitle: 'Inscribe your tribute to the couple',
      content: {
        allowPublicWishes: true,
        placeholderText: 'Inscribe your royal blessings...'
      },
      is_visible: true
    }
  ],
  defaultSettings: {
    music_url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c1c41b8a53.mp3?filename=luxurious-cinematic-126243.mp3',
    music_title: 'Symphonie Royale in D Minor',
    music_autoplay: false,
    is_password_protected: false
  }
};

// -----------------------------------------------------------------------------
// 4. PHOTO STORY TEMPLATE
// -----------------------------------------------------------------------------
export const PHOTO_STORY_TEMPLATE: CoupleTemplateDefinition = {
  id: 'photo-story',
  name: 'Photo Story',
  category: 'Editorial & Visual Memoir',
  tagline: 'Full-bleed imagery, magazine layout, and narrative captions.',
  description: 'A visual-first editorial narrative featuring high-res imagery, parallax scrolling hero plates, filmstrip polaroids, and intimate captions.',
  previewImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
  theme: {
    id: 'theme-photo-story',
    name: 'Warm Editorial Film',
    palette: {
      primary: '#F97316', // Warm terracotta orange
      secondary: '#FDBA74', // Soft peach
      background: '#181412', // Warm espresso sepia
      surface: '#261F1B', // Dark roasted coffee
      textPrimary: '#FFF7ED', // Warm milk foam
      textSecondary: '#D6C7B8', // Soft warm parchment
      accent: '#FB923C', // Sun flare
      border: '#3F322B' // Sepia border
    },
    fonts: {
      heading: '"Cormorant Garamond", Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif'
    },
    borderRadius: 'lg',
    ambientEffect: 'sparkles',
    headerStyle: 'floating'
  },
  defaultPages: [
    { slug: 'home', title: 'Visual Memoir', sort_order: 0, is_home: true }
  ],
  defaultSections: [
    {
      section_type: 'hero',
      sort_order: 0,
      title: 'Our Life In 35mm',
      subtitle: 'Unfiltered, spontaneous, and endlessly in love',
      content: {
        heroBadge: 'PHOTO MEMOIR',
        heroQuote: '“We take photos as a return ticket to a moment otherwise gone.”',
        backgroundImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'View Gallery'
      },
      is_visible: true
    },
    {
      section_type: 'story',
      sort_order: 1,
      title: 'Framed Memories',
      subtitle: 'Stories behind our favorite shutter clicks',
      content: {
        chapters: [
          {
            number: 'Plate 01',
            title: 'Lost in Iceland',
            date: 'October 2023',
            text: 'Our van broke down right as the aurora borealis exploded across the Arctic sky. Freezing hands, hot cocoa in a cracked thermos, and the best night of our lives.',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
          },
          {
            number: 'Plate 02',
            title: 'Sunrise on Mount Batur',
            date: 'March 2024',
            text: 'Waking up at 3:00 AM to climb through volcanic mist. Watching the clouds turn lavender together.',
            image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'gallery',
      sort_order: 2,
      title: 'The Film Roll',
      subtitle: 'Click any photo to enlarge and read private notes',
      content: {
        layout: 'masonry',
        items: [
          { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80', caption: 'First road trip down Big Sur', date: 'Aug 2023' },
          { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80', caption: 'Cooking pasta disaster (burnt sauce)', date: 'Nov 2023' },
          { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80', caption: 'The ring caught in golden hour', date: 'Jan 2024' },
          { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80', caption: 'Dancing barefoot on the beach', date: 'June 2024' }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'countdown',
      sort_order: 3,
      title: 'Seconds of Sunshine',
      subtitle: 'Living in the present, counting every smile',
      content: {
        anniversaryLabel: 'Adventure Started',
        showMilestones: true
      },
      is_visible: true
    }
  ],
  defaultSettings: {
    is_password_protected: false
  }
};

// -----------------------------------------------------------------------------
// 5. TIMELINE TEMPLATE
// -----------------------------------------------------------------------------
export const TIMELINE_TEMPLATE: CoupleTemplateDefinition = {
  id: 'timeline',
  name: 'Timeline',
  category: 'Chronicle & Roadmap',
  tagline: 'Interactive chronological journey from day one to the horizon.',
  description: 'A timeline-centric sanctuary highlighting every milestone, trip, anniversary, and upcoming dream with interactive pins and date scrubbers.',
  previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
  theme: {
    id: 'theme-timeline',
    name: 'Twilight Slate & Cyan',
    palette: {
      primary: '#38BDF8', // Cyan sky
      secondary: '#818CF8', // Indigo violet
      background: '#0B1120', // Midnight navy
      surface: '#151F32', // Deep slate sapphire
      textPrimary: '#F8FAFC', // Crisp crystal
      textSecondary: '#94A3B8', // Slate blue
      accent: '#67E8F9', // Glowing teal
      border: '#1E293B' // Deep slate border
    },
    fonts: {
      heading: '"Plus Jakarta Sans", ui-sans-serif, sans-serif',
      body: 'ui-sans-serif, system-ui, sans-serif'
    },
    borderRadius: 'lg',
    ambientEffect: 'stars',
    headerStyle: 'floating'
  },
  defaultPages: [
    { slug: 'home', title: 'Our Journey', sort_order: 0, is_home: true }
  ],
  defaultSections: [
    {
      section_type: 'hero',
      sort_order: 0,
      title: 'Our Timeline Across The Stars',
      subtitle: 'Tracing the coordinates that brought our paths into orbit',
      content: {
        heroBadge: 'THE CHRONICLE',
        heroQuote: '“Every step led me to you, and every tomorrow belongs to us.”',
        backgroundImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'Explore Journey'
      },
      is_visible: true
    },
    {
      section_type: 'countdown',
      sort_order: 1,
      title: 'Mission Elapsed Time',
      subtitle: 'Real-time telemetry of our shared voyage',
      content: {
        anniversaryLabel: 'Launch Date'
      },
      is_visible: true
    },
    {
      section_type: 'timeline',
      sort_order: 2,
      title: 'The Flight Log',
      subtitle: 'Interactive chronicle of our relationship milestones',
      content: {
        milestones: [
          {
            date: 'August 14, 2022',
            title: 'Initial Rendezvous',
            detail: 'Met over pour-over coffee in Brooklyn. The two-hour chat stretched into a midnight walk.',
            tag: 'Day 1',
            icon: 'coffee'
          },
          {
            date: 'December 24, 2022',
            title: 'First Holiday Together',
            detail: 'Shared a snowed-in Christmas in Vermont with gingerbread baking and vinyl records.',
            tag: 'First Trip',
            icon: 'plane'
          },
          {
            date: 'October 10, 2023',
            title: 'Keys to Our Sanctuary',
            detail: 'Unpacked 42 cardboard boxes and danced in the empty living room.',
            tag: 'Home',
            icon: 'home'
          },
          {
            date: 'July 22, 2024',
            title: 'The Eternal Question',
            detail: 'She whispered yes beneath a canopy of lanterns on Lake Como.',
            tag: 'Engaged',
            icon: 'heart'
          }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'gallery',
      sort_order: 3,
      title: 'Expedition Archive',
      subtitle: 'Coordinates captured along the way',
      content: {
        layout: 'grid',
        items: [
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', caption: 'Brooklyn Bridge walk', date: '2022' },
          { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80', caption: 'Lake Como sunset', date: '2024' },
          { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80', caption: 'Vermont winter cabin', date: '2022' }
        ]
      },
      is_visible: true
    }
  ],
  defaultSettings: {
    is_password_protected: false
  }
};

// -----------------------------------------------------------------------------
// 6. MEMORY VAULT TEMPLATE
// -----------------------------------------------------------------------------
export const MEMORY_VAULT_TEMPLATE: CoupleTemplateDefinition = {
  id: 'memory-vault',
  name: 'Memory Vault',
  category: 'Encrypted & Secret Sanctuary',
  tagline: 'Passcode-protected sanctuary, hidden time capsules, and voice notes.',
  description: 'A private vault guarded by a secret couple passcode. Features encrypted voice notes, milestone time capsules unlockable on specific dates, and confidential polaroids.',
  previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  theme: {
    id: 'theme-memory-vault',
    name: 'Mystic Amethyst & Obsidian',
    palette: {
      primary: '#C084FC', // Soft glowing amethyst
      secondary: '#E879F9', // Violet fuchsia
      background: '#090514', // Deepest cosmic violet
      surface: '#150D2A', // Dark purple velvet
      textPrimary: '#F5F3FF', // Crystal lilac
      textSecondary: '#C4B5FD', // Soft lavender
      accent: '#F472B6', // Neon rose
      border: '#2E1A47' // Royal violet border
    },
    fonts: {
      heading: '"Playfair Display", Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif'
    },
    borderRadius: 'lg',
    ambientEffect: 'sparkles',
    headerStyle: 'floating'
  },
  defaultPages: [
    { slug: 'home', title: 'The Vault', sort_order: 0, is_home: true }
  ],
  defaultSections: [
    {
      section_type: 'hero',
      sort_order: 0,
      title: 'The Encrypted Sanctuary',
      subtitle: 'A private realm guarded for our eyes only',
      content: {
        heroBadge: 'SANCTUARY VAULT',
        heroQuote: '“What is secret between two lovers is preserved forever in the sacred quiet.”',
        backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'Unlock Relics'
      },
      is_visible: true
    },
    {
      section_type: 'memory_vault',
      sort_order: 1,
      title: 'Sealed Relics & Confessions',
      subtitle: 'Click any relic to reveal its secret message',
      content: {
        vaultItems: [
          {
            title: 'Midnight Voice Note (Amalfi)',
            date: 'June 2023',
            type: 'audio',
            description: 'A 2-minute recording of us laughing while listening to waves hit the rocks.',
            audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
            isLocked: false
          },
          {
            title: 'The Unsent Letter',
            date: 'November 2023',
            type: 'letter',
            description: 'The letter I wrote the night before asking you to marry me.',
            letterContent: 'I stayed awake until 4am watching you sleep, realizing that my entire world begins and ends with your peace.',
            isLocked: false
          },
          {
            title: '5-Year Future Time Capsule',
            date: 'Locked until May 2028',
            type: 'capsule',
            description: 'Contains our predictions, promises, and future dream destinations.',
            isLocked: true
          }
        ]
      },
      is_visible: true
    },
    {
      section_type: 'countdown',
      sort_order: 2,
      title: 'Our Sanctuary Pulse',
      subtitle: 'Seconds elapsed since our sanctuary was established',
      content: {
        anniversaryLabel: 'Established On',
        showMilestones: true
      },
      is_visible: true
    },
    {
      section_type: 'love_letters',
      sort_order: 3,
      title: 'Secret Love Letters',
      subtitle: 'Whispered thoughts encrypted in digital wax',
      content: {
        letters: [
          {
            to: 'My Sanctuary',
            from: 'Your Guardian',
            date: 'Special Edition',
            excerpt: 'Thank you for giving me a place where I can put down my armor and simply be loved.',
            waxSealColor: '#C084FC'
          }
        ]
      },
      is_visible: true
    }
  ],
  defaultSettings: {
    is_password_protected: true,
    passcode: '1234',
    passcode_hint: 'The year we first met (or test code: 1234)',
    music_url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
    music_title: 'Nocturne in Amethyst',
    music_autoplay: false
  }
};

// -----------------------------------------------------------------------------
// ALL REGISTERED COUPLE TEMPLATES
// -----------------------------------------------------------------------------
export const COUPLE_TEMPLATES: CoupleTemplateDefinition[] = [
  CLASSIC_ROMANCE_TEMPLATE,
  MINIMAL_TEMPLATE,
  DARK_LUXURY_TEMPLATE,
  PHOTO_STORY_TEMPLATE,
  TIMELINE_TEMPLATE,
  MEMORY_VAULT_TEMPLATE
];

export function getCoupleTemplateById(id: string): CoupleTemplateDefinition {
  return COUPLE_TEMPLATES.find(t => t.id === id) || CLASSIC_ROMANCE_TEMPLATE;
}
