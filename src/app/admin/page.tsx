"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ORDER_STATUSES,
  STATUS_LABELS,
  CATEGORIES,
  CATEGORY_LABELS,
  OrderStatus,
  categoryLabel,
} from "@/lib/fees";

type OrderRow = {
  id: string;
  orderCode: string;
  status: string;
  category: string;
  title: string;
  contactName: string;
  contactEmail: string;
  companyName: string | null;
  destinationCountry: string;
  budgetUsd: number | null;
  estimatedFeePct: number | null;
  estimatedFeeMin: number | null;
  estimatedFeeMax: number | null;
  urgency: string;
  adminNotes: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [quoteFee, setQuoteFee] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setOrders(data.orders || []);
    setAuthed(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Invalid password");
      return;
    }
    setPassword("");
    await load();
  }

  async function logout() {
    await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthed(false);
    setOrders([]);
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filterStatus !== "ALL" && o.status !== filterStatus) return false;
      if (filterCat !== "ALL" && o.category !== filterCat) return false;
      if (q) {
        const hay = `${o.orderCode} ${o.title} ${o.contactName} ${o.contactEmail} ${o.companyName || ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [orders, filterStatus, filterCat, q]);

  async function updateStatus(opts?: { markQuoted?: boolean }) {
    if (!selected) return;
    setBusy(true);
    setMsg("");
    const status = opts?.markQuoted ? "QUOTED" : newStatus || selected.status;
    const noteText = opts?.markQuoted
      ? note ||
        `Quoted fee ${quoteFee ? `$${quoteFee}` : "(see notes)"} — awaiting client`
      : note || undefined;
    const res = await fetch(`/api/admin/orders/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        note: noteText,
        adminNotes: quoteFee
          ? `Quoted fee USD ${quoteFee}${selected.adminNotes ? ` | ${selected.adminNotes}` : ""}`
          : undefined,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setMsg("Update failed");
      return;
    }
    setMsg("Updated");
    setNote("");
    setQuoteFee("");
    await load();
    const refreshed = await fetch("/api/admin/orders").then((r) => r.json());
    const next = (refreshed.orders || []).find(
      (o: OrderRow) => o.id === selected.id
    );
    if (next) {
      setSelected(next);
      setNewStatus(next.status);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
          Admin desk
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-950">
          Authenticate
        </h1>
        <form onSubmit={login} className="glass mt-6 space-y-4 rounded-2xl p-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ADMIN_PASSWORD"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
          />
          {loginError && (
            <p className="text-xs text-red-300">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-gold-400 py-2.5 text-sm font-semibold text-ink-950"
          >
            Enter desk
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
            Vendor / admin desk
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-950">
            Mission queue
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs text-mist"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs text-mist"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search code, title, contact…"
          className="min-w-[200px] flex-1 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs"
        >
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs"
        >
          <option value="ALL">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {ORDER_STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() =>
                setFilterStatus(filterStatus === s ? "ALL" : s)
              }
              className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                filterStatus === s
                  ? "border-gold-400 bg-gold-400/15 text-gold-300"
                  : "border-[var(--border)] text-mist"
              }`}
            >
              {STATUS_LABELS[s]} {count}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] lg:col-span-3">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="bg-ink-900 text-[10px] uppercase tracking-wider text-mist">
              <tr>
                <th className="px-3 py-3">Code</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Fee est.</th>
                <th className="px-3 py-3">Budget</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-mist">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-mist">
                    No orders match
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => {
                    setSelected(o);
                    setNewStatus(o.status);
                    setMsg("");
                  }}
                  className={`cursor-pointer border-t border-[var(--border)] transition hover:bg-white/80 ${
                    selected?.id === o.id ? "bg-gold-400/10" : "bg-white/70"
                  }`}
                >
                  <td className="px-3 py-3 font-mono text-gold-300">
                    {o.orderCode}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] text-cyan-300">
                      {STATUS_LABELS[o.status as OrderStatus] || o.status}
                    </span>
                  </td>
                  <td className="max-w-[180px] truncate px-3 py-3 text-ink-950">
                    {o.title}
                  </td>
                  <td className="px-3 py-3 font-mono text-mist">
                    {o.estimatedFeePct != null
                      ? `${o.estimatedFeePct}% · $${o.estimatedFeeMin?.toLocaleString()}–$${o.estimatedFeeMax?.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-3 py-3 font-mono text-mist">
                    {o.budgetUsd != null
                      ? `$${o.budgetUsd.toLocaleString()}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          {!selected ? (
            <p className="text-sm text-mist">Select an order to manage.</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-mono text-lg text-gold-300">
                  {selected.orderCode}
                </p>
                <p className="mt-1 font-display text-ink-950">{selected.title}</p>
                <p className="mt-1 text-xs text-mist">
                  {selected.contactName} · {selected.contactEmail}
                  {selected.companyName ? ` · ${selected.companyName}` : ""}
                </p>
                <p className="mt-1 text-xs text-mist">
                  {categoryLabel(selected.category)}{" "}
                  · {selected.destinationCountry} · {selected.urgency}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-mist">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-mist">
                  Operator note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Shown on client Ops theater"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="rounded-xl border border-gold-400/25 bg-gold-400/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gold-300">
                  Mark quoted
                </p>
                <input
                  value={quoteFee}
                  onChange={(e) => setQuoteFee(e.target.value)}
                  placeholder="Quoted fee USD e.g. 850"
                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 font-mono text-sm"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => updateStatus({ markQuoted: true })}
                  className="mt-2 w-full rounded-full bg-gold-400 py-2 text-xs font-semibold text-ink-950 disabled:opacity-40"
                >
                  Mark quoted + save fee
                </button>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={() => updateStatus()}
                className="w-full rounded-full border border-cyan-400/40 py-2.5 text-sm font-medium text-cyan-300 disabled:opacity-40"
              >
                Update status
              </button>
              {msg && (
                <p className="text-center text-xs text-emerald-400">{msg}</p>
              )}
              {selected.adminNotes && (
                <p className="text-[11px] text-mist">
                  Admin notes: {selected.adminNotes}
                </p>
              )}
              <a
                href={`/track/${selected.orderCode}`}
                className="block text-center text-xs text-mist hover:text-gold-300"
                target="_blank"
                rel="noreferrer"
              >
                Open client tracker ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
