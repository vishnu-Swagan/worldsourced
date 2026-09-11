"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Category,
  Urgency,
  ScoutRegion,
  CATEGORY_ITEMS,
  CATEGORY_LABELS,
  SCOUT_LABELS,
  estimateFee,
  isCategory,
  normalizeCategory,
} from "@/lib/fees";
import AnimatedNumber from "@/components/AnimatedNumber";

const STEPS = ["Intent", "Brief", "Scout", "Contact", "Launch"];
const DRAFT_KEY = "ws-brief-draft-v2";

const INTENT_CARDS: {
  id: Category;
  icon: string;
  title: string;
  blurb: string;
}[] = [
  {
    id: "physical_products",
    icon: "◈",
    title: "Physical products",
    blurb: "Hardware, goods, samples from any market",
  },
  {
    id: "physical_services",
    icon: "◎",
    title: "Physical services",
    blurb: "On-site audits, QC, negotiations, scouting",
  },
  {
    id: "digital_products",
    icon: "⬡",
    title: "Digital products",
    blurb: "Licenses, SaaS, APIs, datasets, digital assets",
  },
  {
    id: "digital_services",
    icon: "✦",
    title: "Digital services",
    blurb: "Implementation, cloud, financial & banking setups",
  },
];

type Draft = {
  step: number;
  category: Category;
  title: string;
  description: string;
  sourceRegion: string;
  scout: ScoutRegion;
  destinationCountry: string;
  budgetUsd: number;
  deadline: string;
  urgency: Urgency;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

function OrderFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);

  const [category, setCategory] = useState<Category>("physical_products");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceRegion, setSourceRegion] = useState("");
  const [scout, setScout] = useState<ScoutRegion>("anywhere");
  const [destinationCountry, setDestinationCountry] = useState("India");
  const [budgetUsd, setBudgetUsd] = useState(5000);
  const [deadline, setDeadline] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("standard");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Draft;
        setStep(d.step || 0);
        if (d.category) setCategory(normalizeCategory(d.category));
        setTitle(d.title || "");
        setDescription(d.description || "");
        setSourceRegion(d.sourceRegion || "");
        if (d.scout) setScout(d.scout);
        setDestinationCountry(d.destinationCountry || "India");
        if (d.budgetUsd) setBudgetUsd(d.budgetUsd);
        setDeadline(d.deadline || "");
        if (d.urgency) setUrgency(d.urgency);
        setCompanyName(d.companyName || "");
        setContactName(d.contactName || "");
        setContactEmail(d.contactEmail || "");
        setContactPhone(d.contactPhone || "");
      }
    } catch {
      /* ignore */
    }
    const c = params.get("category");
    if (c && (isCategory(c) || ["products","software","services","custom"].includes(c)))
      setCategory(normalizeCategory(c));
    const v = params.get("value");
    if (v && !Number.isNaN(Number(v))) setBudgetUsd(Number(v));
    const u = params.get("urgency");
    if (u === "standard" || u === "rush" || u === "urgent") setUrgency(u);
    const country = params.get("country");
    if (country) setDestinationCountry(country);
    const s = params.get("scout");
    if (s && s in SCOUT_LABELS) setScout(s as ScoutRegion);
  }, [params]);

  useEffect(() => {
    const draft: Draft = {
      step,
      category,
      title,
      description,
      sourceRegion,
      scout,
      destinationCountry,
      budgetUsd,
      deadline,
      urgency,
      companyName,
      contactName,
      contactEmail,
      contactPhone,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setDraftSaved(true);
    const t = setTimeout(() => setDraftSaved(false), 1200);
    return () => clearTimeout(t);
  }, [
    step,
    category,
    title,
    description,
    sourceRegion,
    scout,
    destinationCountry,
    budgetUsd,
    deadline,
    urgency,
    companyName,
    contactName,
    contactEmail,
    contactPhone,
  ]);

  const fee = useMemo(
    () =>
      estimateFee({
        category,
        orderValueUsd: budgetUsd,
        urgency,
        destinationCountry,
        scoutRegion: scout,
      }),
    [category, budgetUsd, urgency, destinationCountry, scout]
  );

  function canNext() {
    if (step === 0) return !!category;
    if (step === 1)
      return title.trim().length >= 3 && description.trim().length >= 10;
    if (step === 2) return destinationCountry.trim().length >= 2;
    if (step === 3)
      return (
        contactName.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
      );
    return true;
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title,
          description,
          sourceRegion: sourceRegion || SCOUT_LABELS[scout],
          destinationCountry,
          budgetUsd,
          deadline: deadline || null,
          urgency,
          companyName: companyName || null,
          contactName,
          contactEmail,
          contactPhone: contactPhone || null,
          estimatedFeePct: fee.suggestedPct,
          estimatedFeeMin: fee.feeMin,
          estimatedFeeMax: fee.feeMax,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/order/success?code=${encodeURIComponent(data.orderCode)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
            Brief Studio
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Compose a sourcing mission
          </h1>
        </div>
        <p
          className={`font-mono text-[10px] uppercase tracking-wider transition ${
            draftSaved ? "text-cyan-300" : "text-mist/40"
          }`}
        >
          {draftSaved ? "Draft autosaved" : "Draft idle"}
        </p>
      </div>

      {/* Progress rail */}
      <div className="mt-8 flex gap-1.5">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => i <= step && setStep(i)}
            className={`flex-1 rounded-full px-1 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider transition sm:text-xs ${
              i === step
                ? "bg-gold-400 text-ink-950 shadow-glow"
                : i < step
                ? "bg-cyan-400/20 text-cyan-300"
                : "bg-white text-mist/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="glass rounded-2xl p-6 sm:p-8 lg:col-span-3">
          {step === 0 && (
            <div>
              <h2 className="font-display text-xl text-ink-950">Pick intent</h2>
              <p className="mt-1 text-sm text-mist">
                This morphs fee defaults and mission framing.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {INTENT_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setCategory(card.id)}
                    className={`card-lift rounded-2xl border p-5 text-left transition ${
                      category === card.id
                        ? "border-gold-400/50 bg-gold-400/10"
                        : "border-[var(--border)] bg-white/70 hover:border-cyan-400/30"
                    }`}
                  >
                    <span className="text-2xl text-cyan-300">{card.icon}</span>
                    <p className="mt-2 font-display font-semibold text-ink-950">
                      {card.title}
                    </p>
                    <p className="mt-1 text-xs text-mist">{card.blurb}</p>
                  </button>
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {CATEGORY_ITEMS[category].slice(0, 6).map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--border)] bg-white/80 px-2.5 py-1 text-[10px] text-mist"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-ink-950">Describe the need</h2>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Mission title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Precision servo motors — Osaka suppliers"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Brief details *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Specs, quantities, constraints, links, must-haves…"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
              <p className="text-xs text-mist">
                Category:{" "}
                <span className="text-gold-300">{CATEGORY_LABELS[category]}</span>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-ink-950">Scout & logistics</h2>
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Scout region
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(SCOUT_LABELS) as ScoutRegion[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setScout(r)}
                      className={`rounded-full border px-3 py-2 text-xs transition ${
                        scout === r
                          ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
                          : "border-[var(--border)] text-mist"
                      }`}
                    >
                      {SCOUT_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Preferred source note (optional)
                </label>
                <input
                  value={sourceRegion}
                  onChange={(e) => setSourceRegion(e.target.value)}
                  placeholder="City, supplier name, or ‘open’"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Destination country *
                </label>
                <input
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 flex justify-between text-[10px] uppercase tracking-[0.2em] text-mist">
                  <span>Budget (USD)</span>
                  <span className="font-mono text-gold-300">
                    ${budgetUsd.toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={100000}
                  step={100}
                  value={Math.min(100000, budgetUsd)}
                  onChange={(e) => setBudgetUsd(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  min={0}
                  value={budgetUsd}
                  onChange={(e) => setBudgetUsd(Number(e.target.value) || 0)}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 font-mono text-sm"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                    Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as Urgency)}
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="rush">Rush (1.25×)</option>
                    <option value="urgent">Urgent (1.5×)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl text-ink-950">Who to brief</h2>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Company
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Contact name *
                </label>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Email *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-mist">
                  Phone
                </label>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 …"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-sm">
              <h2 className="font-display text-xl text-ink-950">Launch checklist</h2>
              <div className="rounded-xl border border-[var(--border)] bg-white/85 text-ink-950 p-4">
                <dl className="space-y-2 text-mist">
                  <div className="flex justify-between gap-4">
                    <dt>Title</dt>
                    <dd className="text-right text-ink-950">{title}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Intent</dt>
                    <dd className="text-ink-950">{CATEGORY_LABELS[category]}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Scout</dt>
                    <dd className="text-ink-950">{SCOUT_LABELS[scout]}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Destination</dt>
                    <dd className="text-ink-950">{destinationCountry}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Contact</dt>
                    <dd className="text-right text-ink-950">
                      {contactName}
                      <br />
                      {contactEmail}
                    </dd>
                  </div>
                </dl>
              </div>
              <p className="text-xs leading-relaxed text-mist">
                Submitting issues a code like{" "}
                <span className="font-mono text-gold-300">WS-7K4M-92QX</span> and
                opens Ops theater tracking. Travel costs stay on WorldSourced.
              </p>
              {error && (
                <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between gap-3">
            <button
              type="button"
              disabled={step === 0 || submitting}
              onClick={() => setStep((s) => s - 1)}
              className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm text-mist disabled:opacity-40"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canNext()}
                onClick={() => setStep((s) => s + 1)}
                className="magnetic-cta rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950 disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={submit}
                className="magnetic-cta rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950 disabled:opacity-40"
              >
                {submitting ? "Launching…" : "Launch mission"}
              </button>
            )}
          </div>
        </div>

        {/* Live fee panel */}
        <aside className="glass-gold sticky top-24 h-fit rounded-2xl p-5 lg:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold-300">
            Live fee preview
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-ink-950">
            <AnimatedNumber value={fee.suggestedPct} decimals={1} />
            <span className="text-xl text-cyan-300">%</span>
          </p>
          <p className="mt-3 font-mono text-lg text-ink-950">
            $<AnimatedNumber value={fee.feeMin} />–$
            <AnimatedNumber value={fee.feeMax} />
          </p>
          <p className="mt-1 text-xs text-mist">
            Floor ${fee.minFeeFloor.toLocaleString()} · ×{fee.multiplier}
          </p>
          <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4 text-xs text-mist">
            <p>
              Intent:{" "}
              <span className="text-ink-950">{CATEGORY_LABELS[category]}</span>
            </p>
            <p>
              Budget:{" "}
              <span className="font-mono text-ink-950">
                ${budgetUsd.toLocaleString()}
              </span>
            </p>
            <p>
              Urgency: <span className="capitalize text-ink-950">{urgency}</span>
            </p>
            <p>
              ETA:{" "}
              <span className="font-mono text-cyan-300">
                {fee.etaMinDays}–{fee.etaMaxDays}d
              </span>
            </p>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-mist/80">
            Operator travel is company cost — not a surprise line on your bill.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-20 text-center text-mist">Loading Brief Studio…</div>
      }
    >
      <OrderFormInner />
    </Suspense>
  );
}
