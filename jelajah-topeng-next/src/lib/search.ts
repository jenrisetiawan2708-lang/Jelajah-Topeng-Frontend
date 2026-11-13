import { KINDS, type RecordsByKind } from "@/lib/content-config";
import type { DashboardSummary } from "@/lib/dal";
import { MENU_BY_ID } from "@/lib/menu";

export type SearchEntry = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  text: string; // bahan pencarian (huruf kecil)
};

// Dibuat di server, lalu dikirim ke Topbar sebagai daftar ringan.
export function buildSearchIndex(
  records: RecordsByKind,
  summary: DashboardSummary,
): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const kind of KINDS) {
    const menu = MENU_BY_ID[kind];
    for (const record of records[kind]) {
      entries.push({
        key: `data-${kind}-${record.id}`,
        title: record.name,
        subtitle: `${menu.label} · ${record.status}`,
        href: `${menu.href}?q=${encodeURIComponent(record.name)}`,
        text: [
          record.name,
          record.description,
          record.location,
          record.date,
          record.amount,
          record.status,
        ]
          .join(" ")
          .toLowerCase(),
      });
    }
  }

  for (const item of summary.transactions) {
    entries.push({
      key: `trx-${item.id}`,
      title: item.name,
      subtitle: `Dashboard · Transaksi ${item.id}`,
      href: MENU_BY_ID.dashboard.href,
      text: `${item.id} ${item.name} ${item.location} ${item.amount} ${item.status}`.toLowerCase(),
    });
  }

  for (const item of summary.masterclasses) {
    entries.push({
      key: `mc-${item.time}-${item.title}`,
      title: item.title,
      subtitle: `Dashboard · Masterclass ${item.maestro}`,
      href: MENU_BY_ID.dashboard.href,
      text: `${item.title} ${item.maestro} ${item.place}`.toLowerCase(),
    });
  }

  return entries;
}
