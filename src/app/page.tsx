import Link from "next/link";
import MissionHero from "@/components/MissionHero";
import EstimatorSection from "@/components/EstimatorSection";
import TrustStrip from "@/components/TrustStrip";
import Testimonials from "@/components/Testimonials";
import ClientStories from "@/components/ClientStories";
import FaqAccordion from "@/components/FaqAccordion";
import {
  CATEGORIES,
  CATEGORY_FEES,
  CATEGORY_ITEMS,
  CATEGORY_LABELS,
} from "@/lib/fees";

const steps = [
  {
    n: "01",
    title: "File the brief",
    body: "Brief Studio captures intent, budget, scout region, and deadline — draft saves locally.",
  },
  {
    n: "02",
    title: "Desk triage",
    body: "We validate markets, constraints, and fee corridor before anyone books a seat.",
  },
  {
    n: "03",
    title: "Source / travel",
    body: "Operators engage suppliers or fly out. Travel burn is ours — not your invoice theater.",
  },
  {
    n: "04",
    title: "Quote lock",
    body: "You approve landed cost + sourcing fee. Status flips to Confirmed.",
  },
  {
    n: "05",
    title: "Deliver",
    body: "Goods, licenses, services, or advisory outcomes land. Ops theater shows every beat.",
  },
];

export default function HomePage() {
  return (
    <>
      <MissionHero />

      <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl reveal">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-400">
            Protocol
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Five beats from brief to delivery
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`glass card-lift group rounded-2xl p-5 reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <span className="font-mono text-xs font-semibold text-cyan-300">
                {s.n}
              </span>
              <h3 className="mt-2 font-display text-base font-semibold text-ink-950">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="source" className="border-y border-[var(--border)] bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-400">
              What we source
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
              Anything from anywhere
            </h2>
            <p className="mt-3 text-mist">
              Physical goods and on-ground ops. Digital licenses and cloud work.
              Financial solutions and banking setups under digital services —
              framed as legitimate sourcing and advisory, not shortcuts.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {CATEGORIES.map((id) => {
              const fee = CATEGORY_FEES[id];
              const items = CATEGORY_ITEMS[id];
              return (
                <article
                  key={id}
                  className="glass card-lift flex flex-col rounded-2xl p-6"
                >
                  <h3 className="font-display text-lg font-semibold text-ink-950">
                    {CATEGORY_LABELS[id]}
                  </h3>
                  <p className="mt-2 font-display text-2xl font-semibold text-gold-300">
                    {fee.minPct}–{fee.maxPct}%{" "}
                    <span className="font-sans text-sm font-normal text-mist">
                      ${fee.minFee} min
                    </span>
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-[var(--border)] bg-white/70 px-2.5 py-1 text-[11px] leading-snug text-mist"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <EstimatorSection />

      <TrustStrip />

      <Testimonials />

      <ClientStories />

      <section
        id="trust"
        className="border-t border-[var(--border)] bg-gradient-to-b from-white to-ink-900"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
                Coverage doctrine
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
                Travel & ops handled by us
              </h2>
              <p className="mt-4 leading-relaxed text-mist">
                When a mission needs boots on the ground, WorldSourced operators
                handle flights, lodging, meals, and visas. Those burns are{" "}
                <strong className="text-ink-950">company operating costs</strong> —
                not passed through as client line items unless already inside
                your agreed sourcing fee.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-mist">
                {[
                  "Transparent fee % by category & complexity",
                  "Ops theater timeline — submitted → delivered",
                  "Owner-operated: Ganesh Kamankar, Nashik",
                  "hello@worldsourced.app",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-[10px] text-cyan-300">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-gold relative overflow-hidden rounded-3xl p-8">
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-cyan-400/5 to-transparent" />
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-300">
                Operator cost policy
              </p>
              <blockquote className="mt-4 font-display text-2xl font-medium leading-snug text-ink-950 sm:text-3xl">
                “You buy the outcome. We absorb the journey.”
              </blockquote>
              <p className="mt-4 text-sm text-mist">
                Tickets · Stay · Food · Visa — covered by WorldSourced. Your
                invoice centers on sourcing fee + agreed product/service cost.
              </p>
              <Link
                href="/order"
                className="magnetic-cta mt-8 inline-flex rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-ink-950"
              >
                File a brief now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FaqAccordion />
    </>
  );
}
