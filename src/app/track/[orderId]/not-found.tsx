import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-ink-950">Order not found</h1>
      <p className="mt-2 text-sm text-mist">
        Check the code and try again (format WS-XXXXXX).
      </p>
      <Link
        href="/track"
        className="mt-6 inline-block rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-ink-950"
      >
        Back to tracker
      </Link>
    </div>
  );
}
