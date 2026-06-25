import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="pt-[54px] pb-10">
      <div className="wrap">
        <div className="flex justify-between gap-[30px] flex-wrap items-start mb-[34px]">
          <div className="max-w-[360px]">
            <h3 className="font-display font-medium text-[22px] m-0 mb-[10px]">
              One honest letter, every Sunday.
            </h3>
            <p className="text-[14px] text-[var(--foam-soft)] m-0 mb-4">
              No spam, no selling, no toxic positivity. Just the company of
              someone treading the same water.
            </p>
          </div>
          <div className="flex gap-[54px] flex-wrap">
            <div>
              <h5 className="text-[12px] tracking-[1.4px] uppercase text-[var(--foam-soft)] m-0 mb-[14px] font-semibold">
                Read
              </h5>
              <Link href="/blog" className="block text-[14px] mb-[10px] hover:text-coral-soft">Latest stories</Link>
              <Link href="/#afloat" className="block text-[14px] mb-[10px] hover:text-coral-soft">Afloat &amp; under</Link>
              <Link href="/blog" className="block text-[14px] mb-[10px] hover:text-coral-soft">All categories</Link>
            </div>
            <div>
              <h5 className="text-[12px] tracking-[1.4px] uppercase text-[var(--foam-soft)] m-0 mb-[14px] font-semibold">
                Community
              </h5>
              <Link href="/#community" className="block text-[14px] mb-[10px] hover:text-coral-soft">Share your story</Link>
              <Link href="/#join" className="block text-[14px] mb-[10px] hover:text-coral-soft">The Sunday letter</Link>
            </div>
            <div>
              <h5 className="text-[12px] tracking-[1.4px] uppercase text-[var(--foam-soft)] m-0 mb-[14px] font-semibold">
                About
              </h5>
              <Link href="/#" className="block text-[14px] mb-[10px] hover:text-coral-soft">Her story</Link>
              <Link href="/admin" className="block text-[14px] mb-[10px] hover:text-coral-soft">Writer login</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--line)] pt-[22px] text-[13px] text-[var(--foam-soft)] flex justify-between flex-wrap gap-[10px]">
          <span>InTooDeep · a community for single moms</span>
          <span>© {new Date().getFullYear()} · written from the deep end</span>
        </div>
      </div>
    </footer>
  );
}
