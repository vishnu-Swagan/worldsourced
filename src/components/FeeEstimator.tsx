"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Category,
  Urgency,
  ScoutRegion,
  CATEGORIES,
  CATEGORY_LABELS,
  SCOUT_LABELS,
  estimateFee,
} from "@/lib/fees";
import AnimatedNumber from "./AnimatedNumber";

const COUNTRIES = [
  "India",
  "United States",
  "United Arab Emirates",
  "United Kingdom",
  "Germany",
  "Japan",
  "China",
  "Singapore",
  "Australia",
  "Canada",
  "Other",
];

export default function FeeEstimator({
  lockedCategory,
}: {
  lockedCategory?: Category;
}) {
  const [category, setCategory] = useState<Category>(lockedCategory || "physical_products");
  const [value, setValue] = useState(5000);
  const [urgency, setUrgency] = useState<Urgency>("standard");
  const [country, setCountry] = useState("India");
  const [scout, setScout] = useState<ScoutRegion>("anywhere");

  useEffect(() => {
    if (lockedCategory) setCategory(lockedCategory);
  }, [lockedCategory]);

  const result = useMemo(
    () =>
      estimateFee({
        category,
        orderValueUsd: value,
        urgency,
        destinationCountry: country,
        scoutRegion: scout,
      }),
    [category, value, urgency, country, scout]
  );

  return (
    <div className="glass-gold rounded-3xl p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          {!lockedCategory && (
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mist">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-ink-950"
              >
                {CATEGORIES.map((k) => (
                  <option key={k} value={k}>
                    {CATEGORY_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-mist">
              <span>Order value (USD)</span>
              <span className="font-mono text-gold-300">
                $<AnimatedNumber value={value} />
              </span>
            </label>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min={0}
              value={value}
              onChange={(e) => setValue(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 font-mono text-sm text-ink-950"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mist">
              Scout region
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SCOUT_LABELS) as ScoutRegion[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setScout(r)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    scout === r
                      ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
                      : "border-[var(--border)] text-mist hover:border-cyan-400/30"
                  }`}
                >
                  {SCOUT_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mist">
              Urgency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["standard", "rush", "urgent"] as Urgency[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-medium capitalize transition sm:text-sm ${
                    urgency === u
                      ? "border-gold-400 bg-gold-400/15 text-gold-300"
                      : "border-[var(--border)] text-mist hover:border-gold-400/40"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mist">
              Destination
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-ink-950"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 via-white to-ink-900 p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold-300">
              Mission fee preview
            </p>
            <p className="mt-3 font-display text-5xl font-semibold text-ink-950 sm:text-6xl">
              <AnimatedNumber value={result.suggestedPct} decimals={1} />
              <span className="text-2xl text-cyan-300">%</span>
            </p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-mist">
              Fee band (USD)
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink-950">
              $<AnimatedNumber value={result.feeMin} /> – $
              <AnimatedNumber value={result.feeMax} />
            </p>
            <p className="mt-1 text-xs text-mist">
              Floor ${result.minFeeFloor.toLocaleString()} · ×{result.multiplier}
            </p>
            <div className="mt-6 rounded-xl border border-cyan-400/20 bg-white/85 text-ink-950 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                ETA corridor
              </p>
              <p className="mt-1 font-mono text-lg text-ink-950">
                {result.etaMinDays}–{result.etaMaxDays}{" "}
                <span className="text-sm text-mist">biz days</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-mist">
                Flights, lodging, meals, visas ={" "}
                <strong className="text-gold-300">operator cost</strong>. Not
                itemized to you unless already inside the fee.
              </p>
            </div>
          </div>
          <Link
            href={`/order?category=${category}&value=${value}&urgency=${urgency}&country=${encodeURIComponent(country)}&scout=${scout}`}
            className="magnetic-cta mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-950"
          >
            Open Brief Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}
