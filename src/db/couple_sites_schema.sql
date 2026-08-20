-- =============================================================================
-- HARCONXS COUPLE WEBSITE ENGINE - DATABASE SCHEMA & SUPABASE RLS POLICIES
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table: couple_sites
-- -----------------------------------------------------------------------------
create table if not exists public.couple_sites (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null,
  slug text unique not null,
  custom_domain text unique,
  title text not null,
  partner1_name text not null,
  partner2_name text not null,
  partner1_photo text,
  partner2_photo text,
  anniversary_date timestamptz,
  template_id text not null default 'classic-romance',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  views_count bigint default 0,
  hearts_count bigint default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_couple_sites_slug on public.couple_sites(slug);
create index if not exists idx_couple_sites_custom_domain on public.couple_sites(custom_domain);
create index if not exists idx_couple_sites_owner on public.couple_sites(owner_id);
create index if not exists idx_couple_sites_status on public.couple_sites(status);

-- -----------------------------------------------------------------------------
-- 2. Table: couple_site_pages
-- -----------------------------------------------------------------------------
create table if not exists public.couple_site_pages (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid references public.couple_sites(id) on delete cascade not null,
  slug text not null,
  title text not null,
  sort_order int default 0 not null,
  is_home boolean default false not null,
  seo_meta jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (site_id, slug)
);

create index if not exists idx_couple_pages_site on public.couple_site_pages(site_id);

-- -----------------------------------------------------------------------------
-- 3. Table: couple_site_sections
-- -----------------------------------------------------------------------------
create table if not exists public.couple_site_sections (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid references public.couple_sites(id) on delete cascade not null,
  page_id uuid references public.couple_site_pages(id) on delete cascade not null,
  section_type text not null,
  sort_order int default 0 not null,
  title text,
  subtitle text,
  content jsonb default '{}'::jsonb not null,
  styles jsonb default '{}'::jsonb,
  is_visible boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_couple_sections_site on public.couple_site_sections(site_id);
create index if not exists idx_couple_sections_page on public.couple_site_sections(page_id);

-- -----------------------------------------------------------------------------
-- 4. Table: couple_site_assets
-- -----------------------------------------------------------------------------
create table if not exists public.couple_site_assets (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid references public.couple_sites(id) on delete cascade not null,
  asset_type text not null check (asset_type in ('image', 'audio', 'video', 'document')),
  url text not null,
  storage_path text,
  alt_text text,
  caption text,
  file_size bigint,
  created_at timestamptz default now() not null
);

create index if not exists idx_couple_assets_site on public.couple_site_assets(site_id);

-- -----------------------------------------------------------------------------
-- 5. Table: couple_site_settings
-- -----------------------------------------------------------------------------
create table if not exists public.couple_site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid references public.couple_sites(id) on delete cascade not null unique,
  theme_id text not null default 'theme-classic-romance',
  theme_config jsonb default '{}'::jsonb not null,
  is_password_protected boolean default false not null,
  passcode text,
  passcode_hint text,
  music_url text,
  music_title text,
  music_autoplay boolean default false,
  love_counter_start_date timestamptz,
  custom_css text,
  analytics_enabled boolean default true,
  show_floating_share boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_couple_settings_site on public.couple_site_settings(site_id);

-- -----------------------------------------------------------------------------
-- 6. Table: couple_site_guestbook
-- -----------------------------------------------------------------------------
create table if not exists public.couple_site_guestbook (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid references public.couple_sites(id) on delete cascade not null,
  author text not null,
  message text not null,
  hearts int default 1,
  approved boolean default true,
  created_at timestamptz default now() not null
);

create index if not exists idx_couple_guestbook_site on public.couple_site_guestbook(site_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

alter table public.couple_sites enable row level security;
alter table public.couple_site_pages enable row level security;
alter table public.couple_site_sections enable row level security;
alter table public.couple_site_assets enable row level security;
alter table public.couple_site_settings enable row level security;
alter table public.couple_site_guestbook enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
       or email = auth.jwt()->>'email'
  );
end;
$$ language plpgsql security definer;

-- -----------------------------------------------------------------------------
-- RLS: couple_sites
-- -----------------------------------------------------------------------------
-- Public visitors may only see published sites
create policy "Public can view published couple sites"
  on public.couple_sites for select
  using (status = 'published' or auth.uid() = owner_id or public.is_admin());

-- Owners can insert their own sites
create policy "Users can create their own couple sites"
  on public.couple_sites for insert
  with check (auth.uid() = owner_id or public.is_admin());

-- Owners can update their own sites
create policy "Owners can update their own couple sites"
  on public.couple_sites for update
  using (auth.uid() = owner_id or public.is_admin());

-- Owners can delete their own sites
create policy "Owners can delete their own couple sites"
  on public.couple_sites for delete
  using (auth.uid() = owner_id or public.is_admin());

-- -----------------------------------------------------------------------------
-- RLS: couple_site_pages
-- -----------------------------------------------------------------------------
create policy "Public can view pages of published sites"
  on public.couple_site_pages for select
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_pages.site_id
        and (couple_sites.status = 'published' or couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "Owners can insert pages for their sites"
  on public.couple_site_pages for insert
  with check (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_pages.site_id
        and (couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "Owners can update pages for their sites"
  on public.couple_site_pages for update
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_pages.site_id
        and (couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "Owners can delete pages for their sites"
  on public.couple_site_pages for delete
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_pages.site_id
        and (couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: couple_site_sections
-- -----------------------------------------------------------------------------
create policy "Public can view sections of published sites"
  on public.couple_site_sections for select
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_sections.site_id
        and (couple_sites.status = 'published' or couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "Owners can manage sections of their sites"
  on public.couple_site_sections for all
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_sections.site_id
        and (couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: couple_site_assets
-- -----------------------------------------------------------------------------
create policy "Public can view assets of published sites"
  on public.couple_site_assets for select
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_assets.site_id
        and (couple_sites.status = 'published' or couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "Owners can manage assets of their sites"
  on public.couple_site_assets for all
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_assets.site_id
        and (couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: couple_site_settings
-- -----------------------------------------------------------------------------
create policy "Public can view settings of published sites"
  on public.couple_site_settings for select
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_settings.site_id
        and (couple_sites.status = 'published' or couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "Owners can manage settings of their sites"
  on public.couple_site_settings for all
  using (
    exists (
      select 1 from public.couple_sites
      where couple_sites.id = couple_site_settings.site_id
        and (couple_sites.owner_id = auth.uid() or public.is_admin())
    )
  );

-- -----------------------------------------------------------------------------
-- RLS: couple_site_guestbook
-- -----------------------------------------------------------------------------
create policy "Public can view approved guestbook wishes"
  on public.couple_site_guestbook for select
  using (approved = true or exists (
    select 1 from public.couple_sites
    where couple_sites.id = couple_site_guestbook.site_id
      and (couple_sites.owner_id = auth.uid() or public.is_admin())
  ));

create policy "Public can submit guestbook wishes"
  on public.couple_site_guestbook for insert
  with check (true);
