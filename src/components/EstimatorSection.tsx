"use client";

import { useState } from "react";
import FeeEstimator from "./FeeEstimator";
import { Category, CATEGORIES, CATEGORY_LABELS } from "@/lib/fees";

export default function EstimatorSection() {
  const [cat, setCat] = useState<Category>("physical_products");
  return (
    <section id="estimator" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
            Fee radar
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Preview the mission fee
          </h2>
          <p className="mt-3 text-mist">
            Indicative bands. Rush 1.25× · Urgent 1.5×. Final quote after desk
            review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                cat === c
                  ? "border-gold-400 bg-gold-400/15 text-gold-300"
                  : "border-[var(--border)] text-mist"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>
      <FeeEstimator lockedCategory={cat} />
    </section>
  );
}
