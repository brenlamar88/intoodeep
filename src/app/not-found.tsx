import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <section className="py-28">
        <div className="wrap text-center">
          <div className="text-[12.5px] tracking-[2.6px] uppercase text-surface font-semibold mb-4">
            Lost at sea
          </div>
          <h1 className="font-display font-medium text-[clamp(34px,5vw,52px)] m-0 mb-4">
            This page went under.
          </h1>
          <p className="text-[16px] text-[var(--foam-soft)] max-w-[460px] mx-auto m-0 mb-8">
            We couldn&apos;t find what you were looking for — but there&apos;s
            still plenty to read.
          </p>
          <Link href="/blog" className="inline-block bg-coral hover:bg-coral-soft text-abyss font-semibold text-[15px] px-[26px] py-[13px] rounded-full">
            Back to the stories
          </Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
