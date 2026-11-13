"use client";

import { CreditCard } from "lucide-react";

export default function TransactionRow({
  id,
  name,
  location,
  amount,
  status,
  onClick,
}: {
  id: string;
  name: string;
  location: string;
  amount: string;
  status: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <CreditCard size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-emerald-700">{id}</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">{name}</p>
        <p className="text-xs text-slate-400">{location}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-800">{amount}</p>
        <span
          className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
            status === "Terverifikasi"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {status}
        </span>
      </div>
    </button>
  );
}
