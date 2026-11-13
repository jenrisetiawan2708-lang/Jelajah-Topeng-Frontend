"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, Grid2X2, Pencil, Search, ShieldCheck, TrendingUp } from "lucide-react";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/ui/StatCard";
import RecordForm from "@/components/records/RecordForm";
import RecordDetail from "@/components/records/RecordDetail";
import { MENU_BY_ID } from "@/lib/menu";
import { MENU_ICONS } from "@/components/layout/menu-icons";
import { CONTENT_PROFILES, type RecordDTO, type RecordKind } from "@/lib/content-config";

type Mode =
  | { type: "none" }
  | { type: "add" }
  | { type: "view"; item: RecordDTO }
  | { type: "edit"; item: RecordDTO };

const GREEN = ["Aktif", "Selesai", "Dikonfirmasi", "Terverifikasi", "Tersedia", "Terbit", "Terkirim"];
const AMBER = [
  "Menunggu Review",
  "Menunggu konfirmasi",
  "Draft",
  "Berlangsung",
  "Perlu verifikasi",
  "Perlu dilengkapi",
];

const PAGE_SIZE = 3;

export default function RecordPage({
  kind,
  title,
  description,
  records,
  initialQuery = "",
}: {
  kind: RecordKind;
  title: string;
  description: string;
  records: RecordDTO[];
  initialQuery?: string;
}) {
  const profile = CONTENT_PROFILES[kind];
  const Icon = MENU_ICONS[kind];

  const [query, setQuery] = useState(initialQuery);
  const [sortAZ, setSortAZ] = useState(false);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<Mode>({ type: "none" });

  const closeModal = () => setMode({ type: "none" });

  const firstStatus = profile.statuses[0];
  const secondStatus = profile.statuses[1] ?? profile.statuses[0];

  const matchingItems = records
    .filter((item) =>
      `${item.name} ${item.description} ${item.location} ${item.status}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sortAZ
        ? a.name.localeCompare(b.name, "id")
        : b.createdAt.localeCompare(a.createdAt),
    );
  const pageCount = Math.max(1, Math.ceil(matchingItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleItems = matchingItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Data contoh memakai epoch (1970), jadi tidak dianggap sebagai pembaruan.
  const latestUpdate = records.reduce<string | undefined>((latest, item) => {
    const timestamp = Date.parse(item.createdAt);
    if (timestamp <= 0) return latest;
    return !latest || timestamp > Date.parse(latest) ? item.createdAt : latest;
  }, undefined);

  const formattedLatestUpdate = latestUpdate
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(latestUpdate))
    : null;

  const modalTitle =
    mode.type === "add" ? "Tambah Data Baru" : mode.type === "edit" ? "Edit Data" : "Detail Data";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Konsol Kuratorial
            </span>
            <span className="text-xs text-slate-400">• Diperbarui hari ini</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setMode({ type: "add" })}
          className="flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 sm:px-5 sm:py-3 sm:text-sm"
        >
          + Tambah Data Baru
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Data"
          value={String(records.length)}
          subtitle="Data tersimpan di server"
          icon={Grid2X2}
        />
        <StatCard
          title={firstStatus}
          value={String(records.filter((i) => i.status === firstStatus).length)}
          subtitle={`Data berstatus ${firstStatus.toLowerCase()}`}
          icon={ShieldCheck}
        />
        <StatCard
          title={secondStatus}
          value={String(records.filter((i) => i.status === secondStatus).length)}
          subtitle={`Data berstatus ${secondStatus.toLowerCase()}`}
          icon={Eye}
        />
        <StatCard
          title="Pembaruan Terakhir"
          value={formattedLatestUpdate ?? "Belum diperbarui"}
          subtitle={
            latestUpdate
              ? "Tanggal & waktu perubahan terakhir"
              : "Belum ada data yang ditambah atau diedit"
          }
          icon={TrendingUp}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4 sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon size={19} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Data {title}</h2>
            <p className="text-xs text-slate-400">Data tersimpan di server.</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
            <div className="flex h-10 w-full items-center gap-2 rounded-xl bg-slate-50 px-3 sm:w-[280px]">
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari data..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="button"
              aria-pressed={sortAZ}
              onClick={() => {
                setSortAZ((v) => !v);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
            >
              {sortAZ ? "Urutan A–Z" : "Filter: terbaru"}
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {visibleItems.length ? (
            visibleItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                  {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1 basis-[160px]">
                  <h3 className="break-words text-sm font-semibold text-slate-800">{item.name}</h3>
                  <p className="mt-1 break-words text-xs text-slate-400">
                    {[item.location, item.description].filter(Boolean).join(" · ") ||
                      "Data kuratorial Jelajah Topeng"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    GREEN.includes(item.status)
                      ? "bg-emerald-50 text-emerald-700"
                      : AMBER.includes(item.status)
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status}
                </span>
                <button
                  type="button"
                  aria-label={`Lihat ${item.name}`}
                  onClick={() => setMode({ type: "view", item })}
                  className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-emerald-700"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Edit ${item.name}`}
                  onClick={() => setMode({ type: "edit", item })}
                  className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-emerald-700"
                >
                  <Pencil size={15} />
                </button>
              </div>
            ))
          ) : (
            <p className="px-6 py-8 text-center text-sm text-slate-500">
              Tidak ada data yang cocok.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-slate-400">
            Menampilkan{" "}
            <b className="text-slate-700">
              {matchingItems.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, matchingItems.length)}
            </b>{" "}
            dari <b className="text-slate-700">{matchingItems.length}</b> data
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={currentPage === n ? "page" : undefined}
                onClick={() => setPage(n)}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  currentPage === n
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((v) => Math.min(v + 1, pageCount))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href={MENU_BY_ID.dashboard.href}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {mode.type !== "none" && (
        <Modal title={modalTitle} onClose={closeModal}>
          {mode.type === "view" ? (
            <RecordDetail
              kind={kind}
              item={mode.item}
              onClose={closeModal}
              onEdit={() => setMode({ type: "edit", item: mode.item })}
            />
          ) : (
            <RecordForm
              key={mode.type === "edit" ? mode.item.id : "new"}
              kind={kind}
              item={mode.type === "edit" ? mode.item : null}
              onClose={closeModal}
              onSaved={() => {
                closeModal();
                setPage(1);
              }}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
