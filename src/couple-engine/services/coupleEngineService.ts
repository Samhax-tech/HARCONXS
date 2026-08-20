import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  CoupleSiteBundle, 
  CoupleSite, 
  CoupleSitePage, 
  CoupleSiteSection, 
  CoupleSiteAsset, 
  CoupleSiteSettings,
  CoupleGuestbookEntryData,
  CoupleTemplateId 
} from '../types';
import { getCoupleTemplateById, COUPLE_TEMPLATES } from '../templates';

// Pre-seeded demo bundle generator for instant previews & offline runtime
export function generateSeedCoupleBundle(slug: string = 'sarah-and-james', templateId: CoupleTemplateId = 'classic-romance'): CoupleSiteBundle {
  const template = getCoupleTemplateById(templateId);
  const now = new Date().toISOString();
  
  const site: CoupleSite = {
    id: `seed-site-${slug}`,
    owner_id: 'seed-owner-001',
    slug: slug,
    custom_domain: null,
    title: 'Sarah & James — Timeless Sanctuary',
    partner1_name: 'Sarah Chen',
    partner2_name: 'James Harrison',
    partner1_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    partner2_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    anniversary_date: '2022-06-14T00:00:00.000Z',
    template_id: templateId,
    status: 'published',
    views_count: 1420,
    hearts_count: 184,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: now
  };

  const pages: CoupleSitePage[] = template.defaultPages.map((p, idx) => ({
    id: `seed-page-${idx}`,
    site_id: site.id,
    slug: p.slug,
    title: p.title,
    sort_order: p.sort_order,
    is_home: p.is_home,
    seo_meta: {
      title: `${site.partner1_name} & ${site.partner2_name} | ${site.title}`,
      description: template.tagline,
      og_image: template.previewImage
    },
    created_at: now,
    updated_at: now
  }));

  const activePage = pages.find(p => p.is_home) || pages[0];

  const sections: CoupleSiteSection[] = template.defaultSections.map((sec, idx) => ({
    id: `seed-sec-${idx}`,
    site_id: site.id,
    page_id: activePage.id,
    section_type: sec.section_type,
    sort_order: sec.sort_order,
    title: sec.title,
    subtitle: sec.subtitle,
    content: sec.content,
    styles: sec.styles,
    is_visible: sec.is_visible,
    created_at: now,
    updated_at: now
  }));

  const assets: CoupleSiteAsset[] = [
    {
      id: 'asset-1',
      site_id: site.id,
      asset_type: 'image',
      url: template.previewImage,
      alt_text: 'Couple Cover Photo',
      created_at: now
    }
  ];

  const settings: CoupleSiteSettings = {
    id: `seed-settings-${site.id}`,
    site_id: site.id,
    theme_id: template.theme.id,
    theme_config: template.theme,
    is_password_protected: template.defaultSettings.is_password_protected || false,
    passcode: template.defaultSettings.passcode || '',
    passcode_hint: template.defaultSettings.passcode_hint || '',
    music_url: template.defaultSettings.music_url,
    music_title: template.defaultSettings.music_title,
    music_autoplay: template.defaultSettings.music_autoplay || false,
    love_counter_start_date: site.anniversary_date || '2022-06-14T00:00:00.000Z',
    analytics_enabled: true,
    show_floating_share: true,
    created_at: now,
    updated_at: now
  };

  const guestbook: CoupleGuestbookEntryData[] = [
    {
      id: 'guest-1',
      site_id: site.id,
      author: 'Elena Rostova',
      message: 'Wishing you both a lifetime of unending sunsets, shared adventures, and pure bliss! Beautiful sanctuary.',
      hearts: 5,
      approved: true,
      created_at: '2024-02-14T12:00:00.000Z'
    },
    {
      id: 'guest-2',
      site_id: site.id,
      author: 'David & Clara',
      message: 'Still in awe of the Paris story. So happy for you two lovers!',
      hearts: 8,
      approved: true,
      created_at: '2024-03-01T15:30:00.000Z'
    }
  ];

  return {
    site,
    theme: template.theme,
    pages,
    activePage,
    sections,
    assets,
    settings,
    guestbook
  };
}

// Local storage helper for caching / prototyping
const LOCAL_STORAGE_KEY_PREFIX = 'harconxs_couple_site_';

/**
 * Fetches a Couple Site Bundle by either its public slug or custom domain.
 * Evaluates Supabase first (with RLS), with fallback to local storage or demo presets.
 */
export async function fetchCoupleSiteBundle(
  identifier: string, 
  pageSlug: string = 'home',
  currentUserAuthId?: string | null
): Promise<CoupleSiteBundle | null> {
  const isDomain = identifier.includes('.');

  // 1. Try Supabase if configured
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('couple_sites').select('*');
      if (isDomain) {
        query = query.eq('custom_domain', identifier);
      } else {
        query = query.eq('slug', identifier);
      }

      const { data: siteRows, error: siteError } = await query;
      if (!siteError && siteRows && siteRows.length > 0) {
        const siteRow = siteRows[0];
        
        // Check visibility: public can only see 'published' sites, owners can see their own
        if (siteRow.status !== 'published' && siteRow.owner_id !== currentUserAuthId) {
          // Site is not published and viewer is not owner
          return null;
        }

        // Fetch settings
        const { data: settingsRows } = await supabase
          .from('couple_site_settings')
          .select('*')
          .eq('site_id', siteRow.id);
        const settingsRow = settingsRows?.[0];

        // Fetch pages
        const { data: pageRows } = await supabase
          .from('couple_site_pages')
          .select('*')
          .eq('site_id', siteRow.id)
          .order('sort_order', { ascending: true });

        const pages: CoupleSitePage[] = (pageRows || []).map((p: any) => ({
          id: p.id,
          site_id: p.site_id,
          slug: p.slug,
          title: p.title,
          sort_order: p.sort_order,
          is_home: p.is_home,
          seo_meta: p.seo_meta,
          created_at: p.created_at,
          updated_at: p.updated_at
        }));

        const activePage = pages.find(p => p.slug === pageSlug) || pages.find(p => p.is_home) || pages[0];

        // Fetch sections for active page
        let sections: CoupleSiteSection[] = [];
        if (activePage) {
          const { data: sectionRows } = await supabase
            .from('couple_site_sections')
            .select('*')
            .eq('site_id', siteRow.id)
            .eq('page_id', activePage.id)
            .eq('is_visible', true)
            .order('sort_order', { ascending: true });

          sections = (sectionRows || []).map((s: any) => ({
            id: s.id,
            site_id: s.site_id,
            page_id: s.page_id,
            section_type: s.section_type,
            sort_order: s.sort_order,
            title: s.title,
            subtitle: s.subtitle,
            content: s.content || {},
            styles: s.styles || {},
            is_visible: s.is_visible,
            created_at: s.created_at,
            updated_at: s.updated_at
          }));
        }

        // Fetch assets
        const { data: assetRows } = await supabase
          .from('couple_site_assets')
          .select('*')
          .eq('site_id', siteRow.id);

        const assets: CoupleSiteAsset[] = (assetRows || []).map((a: any) => ({
          id: a.id,
          site_id: a.site_id,
          asset_type: a.asset_type,
          url: a.url,
          storage_path: a.storage_path,
          alt_text: a.alt_text,
          caption: a.caption,
          file_size: a.file_size,
          created_at: a.created_at
        }));

        // Fetch guestbook
        const { data: guestbookRows } = await supabase
          .from('couple_site_guestbook')
          .select('*')
          .eq('site_id', siteRow.id)
          .eq('approved', true)
          .order('created_at', { ascending: false });

        const guestbook: CoupleGuestbookEntryData[] = (guestbookRows || []).map((g: any) => ({
          id: g.id,
          site_id: g.site_id,
          author: g.author,
          message: g.message,
          hearts: g.hearts,
          approved: g.approved,
          created_at: g.created_at
        }));

        const template = getCoupleTemplateById(siteRow.template_id);
        const themeConfig = settingsRow?.theme_config || template.theme;

        const site: CoupleSite = {
          id: siteRow.id,
          owner_id: siteRow.owner_id,
          slug: siteRow.slug,
          custom_domain: siteRow.custom_domain,
          title: siteRow.title,
          partner1_name: siteRow.partner1_name,
          partner2_name: siteRow.partner2_name,
          partner1_photo: siteRow.partner1_photo,
          partner2_photo: siteRow.partner2_photo,
          anniversary_date: siteRow.anniversary_date,
          template_id: siteRow.template_id,
          status: siteRow.status,
          views_count: siteRow.views_count,
          hearts_count: siteRow.hearts_count,
          created_at: siteRow.created_at,
          updated_at: siteRow.updated_at
        };

        const settings: CoupleSiteSettings = {
          id: settingsRow?.id || `settings-${site.id}`,
          site_id: site.id,
          theme_id: settingsRow?.theme_id || template.theme.id,
          theme_config: themeConfig,
          is_password_protected: settingsRow?.is_password_protected || false,
          passcode: settingsRow?.passcode,
          passcode_hint: settingsRow?.passcode_hint,
          music_url: settingsRow?.music_url || template.defaultSettings.music_url,
          music_title: settingsRow?.music_title || template.defaultSettings.music_title,
          music_autoplay: settingsRow?.music_autoplay ?? false,
          love_counter_start_date: settingsRow?.love_counter_start_date || site.anniversary_date || undefined,
          custom_css: settingsRow?.custom_css,
          analytics_enabled: settingsRow?.analytics_enabled ?? true,
          show_floating_share: settingsRow?.show_floating_share ?? true,
          created_at: settingsRow?.created_at || site.created_at,
          updated_at: settingsRow?.updated_at || site.updated_at
        };

        return {
          site,
          theme: themeConfig,
          pages,
          activePage: activePage || pages[0],
          sections,
          assets,
          settings,
          guestbook
        };
      }
    } catch {
      // Fall through to local fallback
    }
  }

  // 2. Local storage check
  try {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${identifier}`);
    if (cached) {
      const parsed: CoupleSiteBundle = JSON.parse(cached);
      return parsed;
    }
  } catch {
    // Continue to template lookup
  }

  // 3. Match against registered demo templates or standard slug
  const matchedTemplate = COUPLE_TEMPLATES.find(t => t.id === identifier);
  if (matchedTemplate) {
    return generateSeedCoupleBundle(identifier, matchedTemplate.id);
  }

  // Standard demo seed
  return generateSeedCoupleBundle(identifier, 'classic-romance');
}

/**
 * Submit guestbook entry with instant optimistic response and Supabase persistence
 */
export async function submitCoupleGuestbookWish(
  siteId: string, 
  author: string, 
  message: string, 
  hearts: number = 1
): Promise<CoupleGuestbookEntryData> {
  const newEntry: CoupleGuestbookEntryData = {
    id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    site_id: siteId,
    author: author.trim() || 'Anonymous Admirer',
    message: message.trim(),
    hearts: Math.max(1, hearts),
    approved: true,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('couple_site_guestbook').insert({
        site_id: siteId,
        author: newEntry.author,
        message: newEntry.message,
        hearts: newEntry.hearts,
        approved: true
      });
    } catch {
      // Supabase insert failed silently
    }
  }

  return newEntry;
}

/**
 * Like couple site (heart counter)
 */
export async function likeCoupleSite(siteId: string): Promise<number> {
  if (isSupabaseConfigured) {
    try {
      await supabase.rpc('increment_couple_site_hearts', { target_site_id: siteId });
    } catch {
      // Fall through
    }
  }
  return 1;
}

/**
 * Record view
 */
export async function recordCoupleSiteView(siteId: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.rpc('increment_couple_site_views', { target_site_id: siteId });
    } catch {
      // Fall through
    }
  }
}
