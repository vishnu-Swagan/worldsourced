const STORIES = [
  {
    city: "Dubai",
    tag: "Physical products",
    src: "/videos/dubai.mp4",
  },
  {
    city: "Singapore",
    tag: "Digital services",
    src: "/videos/singapore.mp4",
  },
  {
    city: "Berlin",
    tag: "Physical services",
    src: "/videos/berlin.mp4",
  },
  {
    city: "New York",
    tag: "Digital products",
    src: "/videos/nyc.mp4",
  },
  {
    city: "Mumbai",
    tag: "Financial advisory",
    src: "/videos/mumbai.mp4",
  },
];

export default function ClientStories() {
  return (
    <section id="stories" className="border-t border-[var(--border)] bg-ink-900/25">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
            Client stories
          </p>
          <span className="rounded-full border border-dashed border-cyan-400/35 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
            Demo reel · Sample storyboard
          </span>
        </div>
        <h2 className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
          Motion placeholders by city
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-mist">
          Short text-on-gradient demos — not photoreal people, not claimed client
          footage. Swap these files when you have real stories.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s) => (
            <article
              key={s.city}
              className="glass card-lift overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-video bg-ink-950/5">
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  src={s.src}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink-950">
                    {s.city}
                  </h3>
                  <span className="rounded-full bg-gold-400/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold-400">
                    {s.tag}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  Placeholder demo reel — replace with real client footage
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
