export type CoupleTemplateId = 
  | 'classic-romance'
  | 'minimal'
  | 'dark-luxury'
  | 'photo-story'
  | 'timeline'
  | 'memory-vault';

export type CoupleSiteStatus = 'draft' | 'published' | 'archived';

export interface CoupleSite {
  id: string;
  owner_id: string;
  slug: string;
  custom_domain?: string | null;
  title: string;
  partner1_name: string;
  partner2_name: string;
  partner1_photo?: string | null;
  partner2_photo?: string | null;
  anniversary_date?: string | null;
  template_id: CoupleTemplateId | string;
  status: CoupleSiteStatus;
  views_count?: number;
  hearts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CoupleSitePage {
  id: string;
  site_id: string;
  slug: string; // 'home', 'story', 'gallery', 'timeline', 'vault', 'guestbook'
  title: string;
  sort_order: number;
  is_home: boolean;
  seo_meta?: {
    title?: string;
    description?: string;
    og_image?: string;
  };
  created_at: string;
  updated_at: string;
}

export type CoupleSectionType = 
  | 'hero'
  | 'story'
  | 'countdown'
  | 'timeline'
  | 'gallery'
  | 'love_letters'
  | 'memory_vault'
  | 'wishes_guestbook'
  | 'music_player'
  | 'custom_text'
  | 'quote'
  | 'rsvp';

export interface CoupleSiteSection {
  id: string;
  site_id: string;
  page_id: string;
  section_type: CoupleSectionType;
  sort_order: number;
  title?: string;
  subtitle?: string;
  content: Record<string, any>;
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    paddingY?: 'compact' | 'normal' | 'generous';
    alignment?: 'left' | 'center' | 'right';
    borderBottom?: boolean;
    customClasses?: string;
  };
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoupleSiteAsset {
  id: string;
  site_id: string;
  asset_type: 'image' | 'audio' | 'video' | 'document';
  url: string;
  storage_path?: string;
  alt_text?: string;
  caption?: string;
  file_size?: number;
  created_at: string;
}

export interface CoupleSiteThemePalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
}

export interface CoupleSiteThemeFonts {
  heading: string;
  body: string;
}

export interface CoupleSiteThemeConfig {
  id: string;
  name: string;
  palette: CoupleSiteThemePalette;
  fonts: CoupleSiteThemeFonts;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  ambientEffect: 'petals' | 'stars' | 'sparkles' | 'none';
  headerStyle?: 'floating' | 'solid' | 'minimal' | 'hidden';
}

export interface CoupleSiteSettings {
  id: string;
  site_id: string;
  theme_id: string;
  theme_config: CoupleSiteThemeConfig;
  is_password_protected: boolean;
  passcode?: string;
  passcode_hint?: string;
  music_url?: string;
  music_title?: string;
  music_autoplay?: boolean;
  love_counter_start_date?: string;
  custom_css?: string;
  analytics_enabled?: boolean;
  show_floating_share?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoupleGuestbookEntryData {
  id: string;
  site_id: string;
  author: string;
  message: string;
  hearts: number;
  approved: boolean;
  created_at: string;
}

export interface CoupleSiteBundle {
  site: CoupleSite;
  theme: CoupleSiteThemeConfig;
  pages: CoupleSitePage[];
  activePage: CoupleSitePage;
  sections: CoupleSiteSection[];
  assets: CoupleSiteAsset[];
  settings: CoupleSiteSettings;
  guestbook?: CoupleGuestbookEntryData[];
}
