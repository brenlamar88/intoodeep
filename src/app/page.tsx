import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SubscribeForm } from "@/components/site/SubscribeForm";
import { StoryCard } from "@/components/site/StoryCard";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 60;

const AFLOAT = [
  ["Sunday “reset” hour after bedtime", "Lay out the week before it can ambush me."],
  ["One freezer meal on standby, always", "Saves the nights I have nothing left to give."],
  ["Saying yes when someone offers help", "Pride doesn’t fold laundry."],
  ["The 11pm “are you up?” text thread", "Two other single moms who just get it."],
];

const UNDER = [
  ["Pinterest-perfect birthday parties", "They never remembered the centerpiece anyway."],
  ["Pretending I’m fine for everyone else", "It cost more than it saved."],
  ["The color-coded everything", "One shared list beats five perfect systems."],
  ["Guilt about screen time on hard days", "Survival counts as good parenting."],
];

const CATEGORY_CARDS = [
  ["🕯️", "Grief & healing", "Loss, divorce, the life you didn’t plan for."],
  ["💸", "Money & benefits", "One income, real budgets, where to get help."],
  ["🧩", "Co-parenting", "Boundaries, custody, and keeping your peace."],
  ["🌅", "Coming up for air", "The reminder that you’re a person too."],
];

export default async function HomePage() {
  const posts = await getPublishedPosts(3);

  return (
    <>
      <SiteNav />

      {/* HERO */}
      <header
        className="relative overflow-hidden border-b border-[var(--line)]"
        style={{ background: "linear-gradient(180deg, #0d2a37 0%, var(--abyss) 90%)" }}
      >
        <div className="rays" aria-hidden>
          <span /><span /><span /><span />
        </div>
        <div className="wrap">
          <div className="relative pt-[90px] pb-20 max-w-[660px]">
            <div className="text-[12.5px] tracking-[2.6px] uppercase text-surface font-semibold mb-[22px]">
              Single motherhood · no filter
            </div>
            <h1 className="font-display font-medium leading-[1.07] tracking-[-0.5px] m-0 mb-[22px] text-[clamp(34px,5.3vw,58px)]">
              Some days you&apos;re <em className="not-italic font-normal italic text-surface-soft">in too deep.</em> You were never meant to swim it alone.
            </h1>
            <p className="text-[17px] text-[var(--foam-soft)] max-w-[540px] m-0 mb-[30px]">
              Honest stories, hard-won lessons, and a community of single moms in
              the deep end together — what keeps us afloat, what doesn&apos;t, and
              everything nobody warns you about.
            </p>
            <div id="join" className="scroll-mt-24">
              <SubscribeForm />
            </div>
            <div className="text-[13px] text-[var(--foam-soft)] mt-[13px]">
              A letter every Sunday morning. Free, and yours to leave anytime.
            </div>
          </div>
        </div>
      </header>

      {/* AFLOAT / UNDER LEDGER */}
      <section id="afloat" className="py-16 border-b border-[var(--line)] scroll-mt-20">
        <div className="wrap">
          <h2 className="font-display font-medium text-[30px] m-0 mb-1">
            What keeps me afloat. What was pulling me under.
          </h2>
          <p className="text-[15.5px] text-[var(--foam-soft)] max-w-[580px] m-0 mb-[34px]">
            The running ledger of single-mom life — the things that actually hold
            me up, and the ones I finally stopped letting drag me down.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
            <Ledger kind="afloat" title="Keeps me afloat" items={AFLOAT} />
            <Ledger kind="under" title="Was pulling me under" items={UNDER} />
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="py-16 border-b border-[var(--line)]">
        <div className="wrap">
          <div className="flex items-end justify-between gap-5 mb-[34px]">
            <h2 className="font-display font-medium text-[30px] m-0">Latest stories</h2>
            <Link href="/blog" className="text-[14px] text-surface font-medium whitespace-nowrap hover:text-surface-soft">
              All stories →
            </Link>
          </div>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <StoryCard key={post.id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-deep border border-[var(--line)] rounded-[16px] p-10 text-center">
              <p className="text-[var(--foam-soft)] m-0">
                The first stories are being written. Check back soon, or{" "}
                <Link href="/#join" className="text-surface-soft underline">
                  join the Sunday letter
                </Link>{" "}
                to know when they land.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* COMMUNITY BAND */}
      <section id="community" className="py-16 border-b border-[var(--line)] scroll-mt-20">
        <div className="wrap">
          <div
            className="relative overflow-hidden border border-[var(--line-strong)] rounded-[20px] px-11 py-[42px] flex items-center justify-between gap-7 flex-wrap"
            style={{ background: "linear-gradient(135deg,var(--deep-3),var(--deep))" }}
          >
            <div>
              <h2 className="font-display font-medium text-[28px] m-0 mb-2">Real Talk Tuesdays</h2>
              <p className="text-[15px] text-[var(--foam-soft)] m-0 max-w-[470px]">
                Every week, one reader shares her story — anonymously if she wants
                — and the rest of us show up in the comments.
              </p>
            </div>
            <Link href="/#join" className="bg-coral hover:bg-coral-soft text-abyss font-semibold text-[15px] px-[26px] py-[14px] rounded-full whitespace-nowrap">
              Share your story
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-16 border-b border-[var(--line)] scroll-mt-20">
        <div className="wrap">
          <div className="flex items-end justify-between gap-5 mb-[34px]">
            <h2 className="font-display font-medium text-[30px] m-0">Find what you need tonight</h2>
            <Link href="/blog" className="text-[14px] text-surface font-medium whitespace-nowrap hover:text-surface-soft">
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_CARDS.map(([ic, title, desc]) => (
              <Link key={title} href="/blog" className="bg-deep border border-[var(--line)] rounded-[14px] px-5 py-[22px] hover:border-[var(--line-strong)]">
                <span className="text-[22px] mb-3 block">{ic}</span>
                <h4 className="font-display font-medium text-[17px] m-0 mb-[6px]">{title}</h4>
                <p className="text-[13px] text-[var(--foam-soft)] m-0">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

function Ledger({
  kind,
  title,
  items,
}: {
  kind: "afloat" | "under";
  title: string;
  items: string[][];
}) {
  const isAfloat = kind === "afloat";
  return (
    <div className="bg-deep border border-[var(--line)] rounded-[16px] px-[26px] pt-[26px] pb-[14px]">
      <div
        className="inline-flex items-center gap-[9px] text-[12px] tracking-[1.5px] uppercase font-semibold mb-[18px]"
        style={{ color: isAfloat ? "var(--coral-soft)" : "var(--surface)" }}
      >
        <span
          className="w-[9px] h-[9px] rounded-full"
          style={{ background: isAfloat ? "var(--coral)" : "var(--surface)" }}
        />
        {title}
      </div>
      {items.map(([label, note], i) => (
        <div
          key={label}
          className={`flex gap-[13px] py-[13px] text-[15px] items-baseline ${i === 0 ? "" : "border-t border-[var(--line)]"}`}
        >
          <span
            className="flex-none w-[18px] font-display"
            style={{ color: isAfloat ? "var(--coral)" : "var(--surface)" }}
          >
            {isAfloat ? "✓" : "✕"}
          </span>
          <span className={isAfloat ? "" : "text-[var(--foam-soft)]"}>
            <span className={isAfloat ? "" : "line-through decoration-[rgba(143,222,222,0.5)]"}>
              {label}
            </span>
            <small className="block text-[var(--foam-soft)] text-[13px] no-underline mt-[2px]">
              {note}
            </small>
          </span>
        </div>
      ))}
    </div>
  );
}
