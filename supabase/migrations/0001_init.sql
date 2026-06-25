-- InTooDeep CMS — initial schema
-- Tables: authors (approved writers) + posts. RLS locks writes to authors,
-- and public read to published posts only.

-- ---------- authors ----------
create table if not exists public.authors (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  name        text,
  user_id     uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ---------- posts ----------
create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  excerpt          text,
  content_html     text,
  cover_image_url  text,
  cover_image_alt  text,
  category         text,
  tags             text[],
  read_minutes     int,
  status           text not null default 'draft' check (status in ('draft','published')),
  -- SEO
  meta_title       text,
  meta_description text,
  og_image_url     text,
  canonical_url    text,
  noindex          boolean not null default false,
  -- authorship
  author_id        uuid references public.authors (id) on delete set null,
  author_name      text,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------- helper: is the current user an approved author? ----------
create or replace function public.is_author()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.authors a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- RLS ----------
alter table public.posts   enable row level security;
alter table public.authors enable row level security;

-- posts: anyone can read published; authors can read & write everything
drop policy if exists "posts public read" on public.posts;
create policy "posts public read"
  on public.posts for select
  using (status = 'published' or public.is_author());

drop policy if exists "posts author insert" on public.posts;
create policy "posts author insert"
  on public.posts for insert
  with check (public.is_author());

drop policy if exists "posts author update" on public.posts;
create policy "posts author update"
  on public.posts for update
  using (public.is_author())
  with check (public.is_author());

drop policy if exists "posts author delete" on public.posts;
create policy "posts author delete"
  on public.posts for delete
  using (public.is_author());

-- authors: an author can see the authors list (to manage the team)
drop policy if exists "authors read" on public.authors;
create policy "authors read"
  on public.authors for select
  using (public.is_author());

-- ---------- storage bucket for post images ----------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "post-images public read" on storage.objects;
create policy "post-images public read"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "post-images author upload" on storage.objects;
create policy "post-images author upload"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and public.is_author());

drop policy if exists "post-images author update" on storage.objects;
create policy "post-images author update"
  on storage.objects for update
  using (bucket_id = 'post-images' and public.is_author());

drop policy if exists "post-images author delete" on storage.objects;
create policy "post-images author delete"
  on storage.objects for delete
  using (bucket_id = 'post-images' and public.is_author());
