"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessInner() {
  const params = useSearchParams();
  const code = params.get("code") || "—";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-2xl text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.25)]">
        ✓
      </div>
      <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-cyan-300">
        Mission filed
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-950">
        Brief received
      </h1>
      <p className="mt-3 text-mist">
        Save your order ID. Ops theater will show every status beat.
      </p>
      <p className="mt-8 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-6 py-5 font-mono text-2xl font-semibold tracking-[0.12em] text-gold-300 sm:text-3xl">
        {code}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/track/${encodeURIComponent(code)}`}
          className="magnetic-cta rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950"
        >
          Open Ops theater
        </Link>
        <Link
          href="/"
          className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm text-mist"
        >
          Mission Control
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-mist">…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
