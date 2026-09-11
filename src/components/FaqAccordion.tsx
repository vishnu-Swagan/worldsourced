"use client";

import { useState } from "react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How are sourcing fees calculated?",
    a: "Fees are a percentage of order value by category (physical products, physical services, digital products, digital services), with a published minimum floor. Rush and urgent multipliers apply. Use Fee radar on this page for a live corridor estimate — final fee is locked only after desk triage and your approval.",
  },
  {
    q: "Who pays operator travel, lodging, meals, and visas?",
    a: "WorldSourced. When a mission needs boots on the ground, operator travel is a company operating cost — not a separate client line item — unless it is already baked into the agreed sourcing fee you approve.",
  },
  {
    q: "What can you actually source?",
    a: "Physical goods (electronics, textiles, auto parts, lab gear, cosmetics ingredients, furniture, and more), on-ground services (QC, factory audits, trade-show presence, warehousing intros), digital products (licenses, plugins, datasets, media packs), and digital services including legitimate financial solutions and banking-setup advisory.",
  },
  {
    q: "Do you offer banking setups or financial solutions?",
    a: "Yes — framed as legitimate sourcing and advisory only: introductions, process design, KYC/compliance workflow help, and fintech rails advisory. We do not promise shortcuts around regulation, sanctioned jurisdictions, or fake credentials.",
  },
  {
    q: "What are typical timelines?",
    a: "Indicative ranges: physical products ~14–45 days, physical services ~21–60, digital products ~7–21, digital services ~18–50. Rush/urgent compresses the window. Complex regulatory or scarce SKUs take longer — we flag that at triage.",
  },
  {
    q: "How do I track an order?",
    a: "Every brief gets an order code. Use Ops track with that code to see the timeline: Submitted → Reviewing → Sourcing → Quoted → Confirmed → In progress → Delivered.",
  },
  {
    q: "When and how do I pay?",
    a: "You approve the quote (landed cost + sourcing fee) before Confirmed. Payment terms are confirmed in writing for your mission — typically fee deposit then balance on milestones. Product/service cost flows per the supplier path we agree with you.",
  },
  {
    q: "Which regions do you cover?",
    a: "Global desks with dense corridors across India, East Asia, Middle East, EU, US, LatAm, Africa, and Oceania. Fee radar lets you bias scout region (EU, US, East Asia, Middle East, or anywhere).",
  },
  {
    q: "What does Rush or Urgent change?",
    a: "Rush (~1.25×) and Urgent (~1.5×) raise the fee corridor and compress ETA. We still refuse missions that are illegal, sanctioned, or unsafe to accelerate.",
  },
  {
    q: "Who operates WorldSourced?",
    a: "Owner-operated by Ganesh Kamankar, based in Nashik, India. Contact hello@worldsourced.app for desk questions before filing a brief.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-400">
            FAQ
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Answers before you brief
          </h2>
          <p className="mt-3 text-mist">
            Fees, travel policy, legitimacy, timelines, and tracking — plain language.
          </p>
        </div>
        <div className="mx-auto max-w-3xl divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="px-5 sm:px-6">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-display text-base font-semibold text-ink-950 sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-xs text-mist transition ${
                      isOpen ? "bg-gold-400 text-ink-950" : "bg-white"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 pr-10 text-sm leading-relaxed text-mist">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
