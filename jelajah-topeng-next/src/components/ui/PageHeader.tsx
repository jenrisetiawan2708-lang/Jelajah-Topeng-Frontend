import type { ReactNode } from "react";

// Bagian atas halaman yang sama untuk semua halaman admin.
export default function PageHeader({
  eyebrow = "Konsol Kuratorial",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {eyebrow}
          </span>
          <span className="text-xs text-slate-400">• Diperbarui hari ini</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2 sm:gap-3">{actions}</div>}
    </div>
  );
}