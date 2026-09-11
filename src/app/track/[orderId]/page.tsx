import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatusTimeline from "@/components/StatusTimeline";
import {
  STATUS_LABELS,
  OrderStatus,
  categoryLabel,
} from "@/lib/fees";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const code = decodeURIComponent(params.orderId).trim().toUpperCase();
  const order = await prisma.order.findUnique({
    where: { orderCode: code },
    include: { statusHistory: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/track"
        className="text-xs uppercase tracking-[0.16em] text-mist hover:text-cyan-300"
      >
        ← Lookup
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
            Ops theater
          </p>
          <h1 className="mt-1 font-mono text-2xl font-semibold tracking-wider text-ink-950 sm:text-3xl">
            {order.orderCode}
          </h1>
          <p className="mt-2 font-display text-lg text-ink-950">{order.title}</p>
        </div>
        <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold-300">
          {STATUS_LABELS[order.status as OrderStatus] || order.status}
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="glass relative overflow-hidden rounded-2xl p-6 lg:col-span-3">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden opacity-30">
            <div className="h-full w-full bg-gradient-to-b from-cyan-400/20 to-transparent" />
          </div>
          <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-mist">
            Status timeline
          </h2>
          <StatusTimeline
            cinematic
            current={order.status}
            events={order.statusHistory.map((e) => ({
              status: e.status,
              note: e.note,
              createdAt: e.createdAt,
            }))}
          />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="glass rounded-2xl p-5 text-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-mist">
              Mission dossier
            </p>
            <dl className="mt-3 space-y-3 text-mist">
              <div>
                <dt className="text-[10px] uppercase tracking-wider">Category</dt>
                <dd className="text-ink-950">
                  {categoryLabel(order.category)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider">
                  Destination
                </dt>
                <dd className="text-ink-950">{order.destinationCountry}</dd>
              </div>
              {order.sourceRegion && (
                <div>
                  <dt className="text-[10px] uppercase tracking-wider">Scout</dt>
                  <dd className="text-ink-950">{order.sourceRegion}</dd>
                </div>
              )}
              {order.budgetUsd != null && (
                <div>
                  <dt className="text-[10px] uppercase tracking-wider">Budget</dt>
                  <dd className="font-mono text-ink-950">
                    ${order.budgetUsd.toLocaleString()}
                  </dd>
                </div>
              )}
              {order.estimatedFeeMin != null && (
                <div>
                  <dt className="text-[10px] uppercase tracking-wider">
                    Indicative fee
                  </dt>
                  <dd className="font-mono text-gold-300">
                    {order.estimatedFeePct}% · $
                    {order.estimatedFeeMin?.toLocaleString()}–$
                    {order.estimatedFeeMax?.toLocaleString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] uppercase tracking-wider">Filed</dt>
                <dd className="font-mono text-xs text-ink-950">
                  {order.createdAt.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  IST
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-cyan-400/15 bg-ink-900/80 p-5 text-xs leading-relaxed text-mist">
            Operator travel (tickets, stay, food, visa) is covered by
            WorldSourced as an operating cost — not billed as a separate
            client line item unless included in your sourcing fee. Travel
            costs stay on WorldSourced.
          </div>
        </div>
      </div>
    </div>
  );
}
