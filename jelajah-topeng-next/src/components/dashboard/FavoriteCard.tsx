"use client";

import { TrendingUp } from "lucide-react";

export default function FavoriteCard({
  number,
  name,
  visits,
  onClick,
}: {
  number: string;
  name: string;
  visits: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-slate-100 p-4 text-left transition hover:bg-slate-50"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">{number}</span>
        <TrendingUp size={16} className="text-emerald-600" />
      </div>
      <h3 className="text-sm font-semibold leading-5 text-slate-800">{name}</h3>
      <p className="mt-2 text-xs text-slate-400">{visits}</p>
    </button>
  );
}
