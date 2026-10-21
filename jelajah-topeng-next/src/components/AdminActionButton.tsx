"use client";

import { useState, useTransition } from "react";
import { runAdminReport } from "@/app/actions/admin";

export default function AdminActionButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function run() {
    setMessage("");
    startTransition(async () => {
      const result = await runAdminReport();
      setMessage(result.ok ? result.message : `Error: ${result.error}`);
    });
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h2 className="font-bold text-slate-900">Server Action khusus admin</h2>
          <p className="mt-1 text-sm text-slate-500">
            Aksi ini memeriksa peran di server dan mengembalikan FORBIDDEN jika bukan admin.
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {pending ? "Memeriksa..." : "Coba aksi admin"}
        </button>
      </div>
      {message && <p className="mt-3 text-sm font-medium text-slate-700" role="status">{message}</p>}
    </section>
  );
}
