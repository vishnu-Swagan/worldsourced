const SAMPLES = [
  {
    role: "Procurement lead",
    city: "Dubai",
    category: "Physical products",
    quote:
      "Needed specialty components with a tight window. Clear fee corridor, no surprise travel line items, status updates we could show leadership.",
  },
  {
    role: "Operations manager",
    city: "Singapore",
    category: "Physical services",
    quote:
      "On-ground QC and a factory walk-through mattered more than another email thread. Brief Studio made the ask unambiguous.",
  },
  {
    role: "Founder",
    city: "Berlin",
    category: "Digital products",
    quote:
      "Region-locked licenses were blocking a pilot. Desk triage was honest about timelines before we committed budget.",
  },
  {
    role: "Finance ops",
    city: "Mumbai",
    category: "Digital services",
    quote:
      "Asked for banking-setup advisory — framed as legitimate intros and process help, not shortcuts. That framing built trust.",
  },
  {
    role: "Supply chain analyst",
    city: "New York",
    category: "Physical products",
    quote:
      "Small-lot textile samples from East Asia with packaging specs attached. Fee radar matched what we later approved.",
  },
  {
    role: "IT director",
    city: "London",
    category: "Digital services",
    quote:
      "Cloud + integration retainers sourced as a package. Ops track kept stakeholders aligned without weekly chase emails.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-400">
            Testimonials
          </p>
          <span className="rounded-full border border-dashed border-gold-400/35 bg-gold-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-400">
            Sample stories for layout
          </span>
        </div>
        <h2 className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
          How briefs tend to land
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-mist">
          Fictional composite stories for layout only — generic roles and cities,
          not claimed real clients. Replace with verified quotes when you have them.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLES.map((t) => (
            <article
              key={`${t.role}-${t.city}`}
              className="glass card-lift flex flex-col rounded-2xl p-6"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                {t.category}
              </p>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-950/90">
                “{t.quote}”
              </blockquote>
              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <p className="text-sm font-semibold text-ink-950">{t.role}</p>
                <p className="text-xs text-mist">{t.city}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-mist/70">
                  Sample / demo
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
