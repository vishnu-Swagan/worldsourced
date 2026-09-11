"use client";

import dynamic from "next/dynamic";
import {
  Category,
  CATEGORY_ITEMS,
  CATEGORY_LABELS,
  CATEGORY_TAGLINES,
} from "@/lib/fees";

const EarthGlobe = dynamic(() => import("./EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-gradient-to-br from-cyan-400/25 via-sky-100 to-gold-400/20" />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
          Spinning up Earth…
        </p>
      </div>
    </div>
  ),
});

const NODES: { id: Category; label: string; icon: string }[] = [
  { id: "physical_products", label: "Physical products", icon: "◈" },
  { id: "physical_services", label: "Physical services", icon: "◎" },
  { id: "digital_products", label: "Digital products", icon: "⬡" },
  { id: "digital_services", label: "Digital services", icon: "✦" },
];

export default function SourcingConstellation({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (c: Category) => void;
}) {
  const items = CATEGORY_ITEMS[active].slice(0, 5);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Soft bloom only — no bordered card / frosted frame around globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.16)_0%,rgba(251,191,36,0.08)_42%,transparent_70%)] blur-3xl"
      />

      <div className="relative">
        <EarthGlobe active={active} />
        {/* Soft vignette into page bg — not a widget chrome */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(247,248,251,0.15)_82%,rgba(247,248,251,0.55)_100%)]"
        />
        <p className="pointer-events-none absolute bottom-1 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-mist/80">
          Live sourcing routes · drag to orbit
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {NODES.map((n) => {
          const on = active === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelect(n.id)}
              className={`rounded-2xl border px-3 py-2.5 text-left transition duration-300 ${
                on
                  ? "border-gold-400/60 bg-ink-800/95 shadow-glow"
                  : "border-[var(--border)] bg-ink-900/80 hover:border-cyan-400/40 hover:shadow-glow-cyan"
              }`}
              aria-pressed={on}
            >
              <span
                className={`block text-sm ${on ? "text-gold-300" : "text-cyan-300"}`}
              >
                {n.icon}
              </span>
              <span
                className={`block text-[11px] font-semibold tracking-wide ${
                  on ? "text-ink-950" : "text-mist"
                }`}
              >
                {n.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-ink-900/70 p-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
          {CATEGORY_LABELS[active]} · examples
        </p>
        <p className="mt-1 text-xs text-mist">{CATEGORY_TAGLINES[active]}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-[var(--border)] bg-white/85 px-2.5 py-1 text-[10px] text-mist"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
