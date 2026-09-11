import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink-950">
            WorldSourced
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cyan-300">
            Global sourcing · Nashik
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">
            Global sourcing OS for physical & digital products and services —
            including financial solutions and banking setups. You fund the
            outcome fee. We absorb operator travel as company cost.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950">
            Navigate
          </p>
          <ul className="mt-3 space-y-2 text-sm text-mist">
            <li>
              <Link href="/#constellation" className="hover:text-gold-300">
                Live globe
              </Link>
            </li>
            <li>
              <Link href="/#estimator" className="hover:text-gold-300">
                Fee radar
              </Link>
            </li>
            <li>
              <Link href="/#stories" className="hover:text-gold-300">
                Client stories
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-gold-300">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/order" className="hover:text-gold-300">
                Brief Studio
              </Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-gold-300">
                Ops track
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-gold-300">
                Admin desk
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-950">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-mist">
            <li>
              Owner: <span className="text-ink-950">Ganesh Kamankar</span>
            </li>
            <li>Nashik, India</li>
            <li>
              <a
                href="mailto:hello@worldsourced.app"
                className="hover:text-gold-300"
              >
                hello@worldsourced.app
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-4 text-center font-mono text-[10px] tracking-wider text-mist">
        © {new Date().getFullYear()} WorldSourced · Owner Ganesh Kamankar · Nashik · All rights reserved
      </div>
    </footer>
  );
}
