export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  read_minutes: number | null;
  status: PostStatus;
  // SEO
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
  // authorship + timestamps
  author_id: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: string;
  email: string;
  name: string | null;
  user_id: string | null;
  created_at: string;
}

/** The categories shown on the homepage / used for tagging posts. */
export const CATEGORIES = [
  { slug: "the-deep-end", label: "The deep end" },
  { slug: "keeps-me-afloat", label: "Keeps me afloat" },
  { slug: "co-parenting", label: "Co-parenting" },
  { slug: "grief-healing", label: "Grief & healing" },
  { slug: "money-benefits", label: "Money & benefits" },
  { slug: "coming-up-for-air", label: "Coming up for air" },
] as const;
