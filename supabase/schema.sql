-- SRS Website CMS schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.

create extension if not exists "pgcrypto";

-- ---------- Product categories (the filter tabs on /products) ----------
create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Products ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_name text not null,
  romanized text not null,
  series text not null default '—',
  category text not null references product_categories(name) on update cascade,
  placeholder boolean not null default false,
  about text[] not null default '{}',
  closing text[] not null default '{}',
  product_code text not null default '—',
  material text not null default '—',
  dim_height text not null default '—',
  dim_width text not null default '—',
  dim_depth text not null default '—',
  weight text not null default '—',
  lead_time text not null default 'Enquire for availability.',
  images text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Collections (the six main "stories") ----------
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  sanskrit_name text not null default '',
  cover_url text,
  placeholder boolean not null default false,
  myth text not null default '',
  material_story text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Elements (Panch Bhuta's six elemental sub-chapters) ----------
create table if not exists elements (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references collections(id) on delete cascade,
  slug text not null,
  title text not null,
  sanskrit_name text not null default '',
  element text not null default '',
  cover_url text,
  placeholder boolean not null default false,
  myth text not null default '',
  material_story text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection_id, slug)
);

-- ---------- Films (belong to either a Collection or an Element) ----------
create table if not exists films (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references collections(id) on delete cascade,
  element_id uuid references elements(id) on delete cascade,
  slug text unique not null,
  title text not null,
  duration text not null default '',
  type text not null check (type in ('Brand Film', 'Process Film', 'Collection Film')),
  video_url text,
  poster_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint film_has_one_parent check (
    (collection_id is not null and element_id is null) or
    (collection_id is null and element_id is not null)
  )
);

-- ---------- Press & Exhibition entries ----------
create table if not exists press_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text not null default '',
  year text not null default '',
  status text not null check (status in ('Upcoming', 'Past')),
  category text not null check (category in ('Exhibition', 'Press')),
  placeholder boolean not null default false,
  description text not null default '',
  url text,
  image_url text,
  images text[] not null default '{}',
  logo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- updated_at auto-touch ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_collections_updated_at on collections;
create trigger trg_collections_updated_at before update on collections
  for each row execute function set_updated_at();

drop trigger if exists trg_elements_updated_at on elements;
create trigger trg_elements_updated_at before update on elements
  for each row execute function set_updated_at();

drop trigger if exists trg_films_updated_at on films;
create trigger trg_films_updated_at before update on films
  for each row execute function set_updated_at();

drop trigger if exists trg_press_entries_updated_at on press_entries;
create trigger trg_press_entries_updated_at before update on press_entries
  for each row execute function set_updated_at();

drop trigger if exists trg_product_categories_updated_at on product_categories;
create trigger trg_product_categories_updated_at before update on product_categories
  for each row execute function set_updated_at();

-- ---------- Home page content (singleton row) ----------
-- The hero (video + eyebrow + headline) and the homepage's curated
-- Featured Products picks — the parts of "/" that are genuinely
-- editorial choices, not derived from other tables. The rest of the
-- homepage (Stories, recent Press) is auto-derived from collections/
-- press_entries and stays that way, so this table only covers the
-- pieces that need a deliberate pick.
create table if not exists home_page (
  id boolean primary key default true check (id),
  hero_video_url text,
  hero_eyebrow text not null default '',
  hero_headline text not null default '',
  featured_product_slugs text[] not null default '{}',
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_home_page_updated_at on home_page;
create trigger trg_home_page_updated_at before update on home_page
  for each row execute function set_updated_at();

alter table home_page enable row level security;
create policy "Public read access" on home_page for select using (true);

-- ---------- Studio contact info (singleton row) ----------
-- Phone/WhatsApp/email/socials/address shown across Nav, Footer, the
-- floating contact widget, the Acquire form, and the Contact/Privacy/
-- Terms pages. Name and the website's own domain stay fixed in code
-- (src/lib/studio.ts's fallback) since those aren't really "contact
-- details" the studio would update through a form.
create table if not exists studio_info (
  id boolean primary key default true check (id),
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  instagram text not null default '',
  instagram_dm text not null default '',
  facebook text not null default '',
  address text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_studio_info_updated_at on studio_info;
create trigger trg_studio_info_updated_at before update on studio_info
  for each row execute function set_updated_at();

alter table studio_info enable row level security;
create policy "Public read access" on studio_info for select using (true);

-- ---------- Admin auth (single admin, no user accounts) ----------
-- Small key/value store for the login password + password-reset token,
-- mirroring the SRS Catalogue project's own single-password-gate pattern
-- (there it's a text blob in R2; here it's a table, since this project
-- already has a database). Never exposed to the public/publishable key —
-- only the server-side admin auth code (using the secret key) touches it.
create table if not exists admin_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_admin_settings_updated_at on admin_settings;
create trigger trg_admin_settings_updated_at before update on admin_settings
  for each row execute function set_updated_at();

alter table admin_settings enable row level security;
-- Deliberately no policies here at all — RLS with zero policies means
-- even the publishable key can never read or write this table. Only the
-- secret key (which bypasses RLS entirely) can, and that key only ever
-- lives in server-side code.

-- ---------- Row Level Security ----------
-- Public (publishable key) can only READ. All writes go through the
-- service_role key, used exclusively by the admin dashboard's server-side
-- code — never exposed to the browser.
alter table product_categories enable row level security;
alter table products enable row level security;
alter table collections enable row level security;
alter table elements enable row level security;
alter table films enable row level security;
alter table press_entries enable row level security;

create policy "Public read access" on product_categories for select using (true);
create policy "Public read access" on products for select using (true);
create policy "Public read access" on collections for select using (true);
create policy "Public read access" on elements for select using (true);
create policy "Public read access" on films for select using (true);

-- ---------- Exhibition city ----------
-- Exhibition cards show venue + city + year; press (publication) entries
-- don't use this field.
alter table press_entries add column if not exists city text not null default '';
create policy "Public read access" on press_entries for select using (true);
