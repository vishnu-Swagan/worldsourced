"use client";

import { useState } from "react";
import Link from "next/link";
import SourcingConstellation from "./SourcingConstellation";
import { Category, CATEGORY_LABELS, CATEGORY_TAGLINES } from "@/lib/fees";

const HERO: Record<
  Category,
  { headline: string; accent: string; sub: string }
> = {
  physical_products: {
    headline: "Goods that don’t ship themselves.",
    accent: "We go get them.",
    sub: "Hardware, specialty SKUs, samples — sourced across borders with a clear fee.",
  },
  physical_services: {
    headline: "When email isn’t enough.",
    accent: "Boots on ground.",
    sub: "Factory visits, QC, vendor talks — operators travel; you don’t foot the ticket.",
  },
  digital_products: {
    headline: "Licenses locked behind regions.",
    accent: "We unlock access.",
    sub: "Enterprise tools, SaaS seats, APIs, datasets — negotiated and delivered.",
  },
  digital_services: {
    headline: "Stacks, teams, and rails.",
    accent: "Sourced end-to-end.",
    sub: "Implementation, cloud, cybersecurity, financial solutions & banking setups — legitimate advisory, clear fee.",
  },
};

export default function MissionHero() {
  const [cat, setCat] = useState<Category>("physical_products");
  const h = HERO[cat];

  return (
    <section
      id="constellation"
      className="grid-fade relative overflow-hidden border-b border-[var(--border)]"
    >
      {/* Soft cyan/gold bloom behind globe — not a card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/2 h-[65vmin] w-[65vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.14)_0%,rgba(251,191,36,0.06)_40%,transparent_70%)] blur-2xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-4 lg:py-20">
        <div className="reveal relative z-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Live globe · active routes
          </p>
          <h1 className="font-display text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.4rem]">
            {h.headline}{" "}
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-cyan-300 bg-clip-text text-transparent">
              {h.accent}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            {h.sub}
          </p>
          <p className="mt-3 max-w-xl text-sm text-mist/85">
            Request <strong className="font-medium text-ink-950">anything from anywhere</strong> —
            products, on-ground services, digital tools, financial solutions,
            banking setups, and more. Active example:{" "}
            <span className="font-medium text-gold-300">
              {CATEGORY_LABELS[cat]}
            </span>{" "}
            — {CATEGORY_TAGLINES[cat]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/order?category=${cat}`}
              className="magnetic-cta rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-ink-950"
            >
              Open Brief Studio
            </Link>
            <Link
              href="/#estimator"
              className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-ink-950 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Fee radar
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-8">
            {[
              ["50+", "Markets"],
              ["0", "Travel line-items*"],
              ["7", "Status stages"],
            ].map(([k, v], i) => (
              <div key={k} className={`reveal reveal-delay-${i + 1}`}>
                <dt className="font-display text-xl font-semibold text-gold-300 sm:text-2xl">
                  {k}
                </dt>
                <dd className="mt-1 text-[11px] text-mist sm:text-xs">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[10px] text-mist/60">
            *Operator tickets/stay/food/visa are company costs unless baked into
            fee.
          </p>
        </div>
        <div className="reveal reveal-delay-2 relative z-0 lg:-mr-6 lg:scale-110 xl:scale-[1.12]">
          <SourcingConstellation active={cat} onSelect={setCat} />
        </div>
      </div>
    </section>
  );
}
