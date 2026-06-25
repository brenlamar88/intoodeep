# InTooDeep — Blog + CMS

A Next.js blog with a built-in, SEO-ready content management system for
**InTooDeep**, a community for single moms. Writers sign in with a magic link
(no passwords), write in a rich-text editor, and publish posts that are
search-engine optimized out of the box.

## Stack

- **Next.js 15** (App Router) — server-rendered for SEO, deployed on Vercel
- **Supabase** — Postgres database, magic-link auth, image storage
- **Tiptap** — rich-text (WYSIWYG) editor
- **Tailwind CSS** — styling, using the original InTooDeep palette

## What's included

**Public site** (`/`)
- The original InTooDeep homepage design, now pulling live posts
- `/blog` — index of all published stories
- `/blog/[slug]` — individual posts, fully SEO-optimized:
  - per-post `<title>` / meta description, Open Graph + Twitter cards
  - JSON-LD `Article` structured data (rich results in Google)
  - canonical URLs, optional `noindex`
- `sitemap.xml`, `robots.txt`, and an RSS feed at `/feed.xml`

**Admin CMS** (`/admin`)
- Magic-link sign in — invite-only (only emails in the `authors` table)
- Dashboard listing all posts with draft/published status
- Rich-text editor with headings, lists, quotes, links, and image uploads
- Live **SEO readiness score** + Google search preview as you type
- SEO controls: slug, meta title/description, social image, canonical, noindex
- Cover images and inline images upload to Supabase Storage

## Setup

### 1. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Set these same three variables in **Vercel → Project → Settings → Environment
Variables** for the deployed site.

### 2. Database

Run `supabase/migrations/0001_init.sql` against your Supabase project (SQL
Editor or CLI). It creates the `authors` and `posts` tables, Row-Level Security
policies, and the `post-images` storage bucket.

### 3. Add a writer

Insert the writer's email into the `authors` table:

```sql
insert into public.authors (email, name)
values ('writer@example.com', 'Her Name');
```

They can now go to `/admin`, enter that email, and click the magic link.

### 4. Supabase Auth settings

In **Supabase → Authentication → URL Configuration**, add your site URL to
**Redirect URLs** (e.g. `https://your-domain.com/auth/confirm`) so magic links
resolve correctly.

## Develop locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` (site) and `http://localhost:3000/admin` (CMS).
