"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto mt-10 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-red-600">Terjadi kesalahan</p>
      <h1 className="mt-2 text-xl font-bold text-slate-900">Data belum bisa dimuat</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Server data sedang tidak dapat dihubungi. Pastikan backend menyala, lalu coba lagi.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Coba lagi
        </button>
        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Ke Dashboard
        </Link>
      </div>
    </section>
  );
}
