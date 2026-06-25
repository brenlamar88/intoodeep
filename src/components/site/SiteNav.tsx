import Link from "next/link";

export function SiteNav() {
  return (
    <div className="wrap">
      <nav className="flex items-center justify-between py-[22px] border-b border-[var(--line)]">
        <Link href="/" className="flex items-center gap-[11px]">
          <div
            aria-hidden
            className="w-[34px] h-[34px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 34% 30%, var(--coral-soft), var(--coral) 72%)",
              boxShadow: "0 0 0 4px rgba(255,127,99,0.12)",
            }}
          />
          <div className="font-display font-medium text-[20px] tracking-[0.2px]">
            In<b className="font-semibold">Too</b>Deep
          </div>
        </Link>
        <div className="hidden sm:flex gap-[26px] text-[14px] text-[var(--foam-soft)]">
          <Link href="/blog" className="hover:text-foam">Stories</Link>
          <Link href="/#afloat" className="hover:text-foam">Afloat &amp; under</Link>
          <Link href="/#categories" className="hover:text-foam">Resources</Link>
          <Link href="/#community" className="hover:text-foam">Community</Link>
        </div>
        <Link
          href="/#join"
          className="text-[14px] font-semibold text-abyss bg-coral hover:bg-coral-soft px-[18px] py-[9px] rounded-full"
        >
          Join free
        </Link>
      </nav>
    </div>
  );
}
