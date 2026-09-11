"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/#constellation", label: "Constellation" },
  { href: "/#how", label: "Protocol" },
  { href: "/#estimator", label: "Fee radar" },
  { href: "/#stories", label: "Stories" },
  { href: "/#faq", label: "FAQ" },
  { href: "/track", label: "Ops track" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hideCta = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 text-ink-950 shadow-glow">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-semibold tracking-wide text-ink-950">
              WorldSourced
            </span>
            <span className="block text-[9px] uppercase tracking-[0.22em] text-cyan-300/80">
              Mission Control
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-[0.14em] text-mist transition hover:text-gold-300"
            >
              {l.label}
            </Link>
          ))}
          {!hideCta && (
            <Link
              href="/order"
              className="magnetic-cta rounded-full bg-gold-400 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-950"
            >
              Brief Studio
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="rounded-lg border border-[var(--border)] p-2 text-mist md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-ink-900 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-mist hover:text-gold-300"
              >
                {l.label}
              </Link>
            ))}
            {!hideCta && (
              <Link
                href="/order"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-full bg-gold-400 px-4 py-2 text-center text-sm font-semibold text-ink-950"
              >
                Brief Studio
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
