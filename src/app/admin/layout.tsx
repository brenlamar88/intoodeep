import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAuthor } from "@/lib/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in → this is the login page (middleware guards the rest).
  if (!user) {
    return <div className="min-h-screen bg-abyss text-foam">{children}</div>;
  }

  const author = await getCurrentAuthor();

  // Signed in but not an approved writer.
  if (!author) {
    return (
      <div className="min-h-screen bg-abyss text-foam flex items-center justify-center px-6">
        <div className="max-w-[440px] text-center">
          <h1 className="font-display font-medium text-[26px] m-0 mb-3">
            You&apos;re signed in, but not approved yet.
          </h1>
          <p className="text-[15px] text-[var(--foam-soft)] mb-6">
            The account <b>{user.email}</b> isn&apos;t on the writers list. Ask
            the site owner to add your email, then sign in again.
          </p>
          <form action="/auth/signout" method="post">
            <button className="bg-deep border border-[var(--line-strong)] text-foam px-5 py-3 rounded-[10px] text-[14px] cursor-pointer hover:border-coral">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-abyss text-foam">
      <header className="border-b border-[var(--line)]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-[10px]">
              <div
                aria-hidden
                className="w-[28px] h-[28px] rounded-full"
                style={{
                  background: "radial-gradient(circle at 34% 30%, var(--coral-soft), var(--coral) 72%)",
                }}
              />
              <span className="font-display font-medium text-[17px]">
                InTooDeep <span className="text-[var(--foam-soft)] font-body text-[13px]">CMS</span>
              </span>
            </Link>
            <nav className="hidden sm:flex gap-5 text-[14px] text-[var(--foam-soft)]">
              <Link href="/admin" className="hover:text-foam">Posts</Link>
              <Link href="/admin/posts/new" className="hover:text-foam">New post</Link>
              <Link href="/" className="hover:text-foam" target="_blank">View site ↗</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[13px] text-[var(--foam-soft)]">
              {author.name || author.email}
            </span>
            <form action="/auth/signout" method="post">
              <button className="text-[13px] text-[var(--foam-soft)] hover:text-coral-soft cursor-pointer">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
    </div>
  );
}
