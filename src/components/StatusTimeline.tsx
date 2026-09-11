import {
  ORDER_STATUSES,
  STATUS_LABELS,
  STATUS_NEXT_ACTION,
  OrderStatus,
} from "@/lib/fees";

type Event = {
  status: string;
  note?: string | null;
  createdAt: string | Date;
};

function fmtIST(d: string | Date) {
  return (
    new Date(d).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    }) + " IST"
  );
}

export default function StatusTimeline({
  current,
  events,
  cinematic = false,
}: {
  current: string;
  events: Event[];
  cinematic?: boolean;
}) {
  const currentIdx = Math.max(
    0,
    ORDER_STATUSES.indexOf(current as OrderStatus)
  );
  const eventMap = new Map(events.map((e) => [e.status, e]));
  const next =
    STATUS_NEXT_ACTION[current as OrderStatus] || "Awaiting desk update";

  return (
    <div>
      {cinematic && (
        <div className="mb-6 overflow-hidden rounded-xl border border-cyan-400/20 bg-white/90 text-ink-950 p-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </span>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
              Ops theater · live
            </p>
          </div>
          <p className="mt-2 text-sm text-ink-950">
            Estimated next action:{" "}
            <span className="text-gold-300">{next}</span>
          </p>
        </div>
      )}

      <ol className="relative">
        {ORDER_STATUSES.map((status, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const ev = eventMap.get(status);
          return (
            <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
              {i < ORDER_STATUSES.length - 1 && (
                <span
                  className={`absolute left-[13px] top-7 h-[calc(100%-12px)] w-px ${
                    i < currentIdx
                      ? "bg-gradient-to-b from-gold-400 to-cyan-400"
                      : "bg-ink-600"
                  }`}
                />
              )}
              <span
                className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  active
                    ? "border-gold-400 bg-gold-400 text-ink-950 shadow-glow"
                    : done
                    ? "border-cyan-400/60 bg-ink-900 text-cyan-300"
                    : "border-ink-600 bg-ink-900 text-mist"
                }`}
              >
                {done ? (i + 1).toString().padStart(2, "0") : "·"}
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className={`rounded-xl border px-4 py-3 transition ${
                    active
                      ? "border-gold-400/35 bg-gold-400/10"
                      : done
                      ? "border-[var(--border)] bg-ink-900/40"
                      : "border-transparent bg-transparent opacity-50"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      done ? "text-ink-950" : "text-mist"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                    {active && (
                      <span className="ml-2 rounded-full bg-cyan-400/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-cyan-300">
                        Active
                      </span>
                    )}
                  </p>
                  {ev ? (
                    <>
                      <p className="mt-1 font-mono text-[11px] text-mist">
                        {fmtIST(ev.createdAt)}
                      </p>
                      {ev.note && (
                        <p className="mt-2 border-l-2 border-cyan-400/40 pl-3 text-xs leading-relaxed text-mist">
                          <span className="text-cyan-300">Operator · </span>
                          {ev.note}
                        </p>
                      )}
                    </>
                  ) : (
                    !done && (
                      <p className="mt-1 text-[11px] text-mist/60">Pending</p>
                    )
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
