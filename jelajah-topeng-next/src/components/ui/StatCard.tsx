"use client";

import type { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) onClick();
      }}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${onClick ? "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md" : ""}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={19} />
        </div>
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-slate-900">
        {value.startsWith("Rp") ? `Rp ${value.slice(2).trim()}` : value}
      </h3>

      <p className="mt-2 text-xs font-medium text-emerald-600">{subtitle}</p>
    </div>
  );
}
