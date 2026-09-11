import Link from "next/link";

/**
 * Honest review placeholders — never hardcode fake live ratings as fact.
 */
export default function TrustStrip() {
  return (
    <section id="reviews" className="border-t border-[var(--border)] bg-ink-900/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
            Social proof
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Reviews, when you connect them
          </h2>
          <p className="mt-3 text-sm text-mist">
            Demo layout — connect your Google Business / Trustpilot to show live
            scores. We do not invent ratings.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Google placeholder */}
          <article className="glass relative overflow-hidden rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[var(--border)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-950">
                    Google reviews
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-mist">
                    Not connected
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-dashed border-[var(--border)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-mist">
                Placeholder
              </span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <div className="flex h-14 min-w-[3.5rem] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white/70 px-3 font-display text-2xl text-mist/40">
                —
              </div>
              <div>
                <p className="text-sm font-medium text-ink-950">Score slot empty</p>
                <p className="text-xs text-mist">Connect Google Business to show live rating</p>
              </div>
            </div>

            <p className="mt-5 rounded-xl bg-cyan-400/8 px-3 py-2 text-xs leading-relaxed text-mist">
              Demo layout — connect your Google Business / Trustpilot to show live
              score
            </p>

            <Link
              href="mailto:hello@worldsourced.app?subject=Connect%20Google%20reviews"
              className="mt-5 inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-950 transition hover:border-gold-400/40"
            >
              Connect reviews
            </Link>

            {/* Optional muted example — clearly labeled */}
            <div className="mt-6 border-t border-[var(--border)] pt-4">
              <span className="inline-flex rounded-md bg-ink-950/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-mist">
                Example preview
              </span>
              <p className="mt-2 text-xs text-mist/80">
                Layout preview only (not live data): e.g. 4.9 · 500+ reviews —
                replace when connected.
              </p>
            </div>
          </article>

          {/* Trustpilot placeholder */}
          <article className="glass relative overflow-hidden rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b67a]/12 text-sm font-bold text-[#00b67a] ring-1 ring-[#00b67a]/25">
                  ★
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-950">
                    Trustpilot
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-mist">
                    Not connected
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-dashed border-[var(--border)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-mist">
                Placeholder
              </span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <div className="flex h-14 min-w-[3.5rem] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white/70 px-3 font-display text-2xl text-mist/40">
                —
              </div>
              <div>
                <p className="text-sm font-medium text-ink-950">Score slot empty</p>
                <p className="text-xs text-mist">Connect Trustpilot to show live TrustScore</p>
              </div>
            </div>

            <p className="mt-5 rounded-xl bg-cyan-400/8 px-3 py-2 text-xs leading-relaxed text-mist">
              Demo layout — connect your Google Business / Trustpilot to show live
              score
            </p>

            <Link
              href="mailto:hello@worldsourced.app?subject=Connect%20Trustpilot"
              className="mt-5 inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-950 transition hover:border-gold-400/40"
            >
              Connect reviews
            </Link>

            <div className="mt-6 border-t border-[var(--border)] pt-4">
              <span className="inline-flex rounded-md bg-ink-950/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-mist">
                Example preview
              </span>
              <p className="mt-2 text-xs text-mist/80">
                Layout preview only (not live data): e.g. Excellent · 4.9 —
                replace when connected.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
