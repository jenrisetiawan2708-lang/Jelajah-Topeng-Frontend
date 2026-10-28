"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import {
  CircleCheck,
  CircleX,
  Clock,
  CreditCard,
  Download,
  Receipt,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { decideRefund } from "@/app/actions/refunds";
import type { FormState } from "@/lib/content-config";
import { checkRefundReason, type RefundDTO } from "@/lib/refund-schema";
import { useToast } from "@/components/ToastProvider";

const PAGE_SIZE = 5;

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});
const dateTimeFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});
const monthFmt = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const canApprove = (r: RefundDTO) =>
  r.status === "Menunggu" || r.status === "Diproses";
const canReject = (r: RefundDTO) => r.status === "Menunggu";

function statusClass(status: string) {
  if (status === "Disetujui") return "bg-emerald-50 text-emerald-700";
  if (status === "Ditolak") return "bg-red-50 text-red-600";
  return "bg-slate-100 text-slate-600";
}

function exportCsv(rows: RefundDTO[]) {
  const head = [
    "ID Refund",
    "Nama Pengguna",
    "Destinasi",
    "Tanggal Pengajuan",
    "Nominal",
    "Alasan",
    "Metode",
    "Status",
  ];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [
    head,
    ...rows.map((r) => [
      r.code,
      r.requester,
      r.destination,
      dateFmt.format(new Date(r.filedAt)),
      r.amount,
      r.reason,
      r.method,
      r.status,
    ]),
  ].map((line) => line.map(esc).join(","));

  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-refund.csv";
  link.click();
  URL.revokeObjectURL(url);
}

// =============================================================
// HALAMAN
// =============================================================

export default function RefundPage({ refunds }: { refunds: RefundDTO[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua Status");
  const [month, setMonth] = useState("Semua Tanggal");
  const [method, setMethod] = useState("Semua Metode");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [dialog, setDialog] = useState<{
    type: "approve" | "reject";
    refund: RefundDTO;
  } | null>(null);

  const months = Array.from(new Set(refunds.map((r) => r.filedAt.slice(0, 7))))
    .sort()
    .reverse();
  const methods = Array.from(new Set(refunds.map((r) => r.method))).sort();

  const q = search.trim().toLowerCase();
  const filtered = refunds.filter((r) => {
    if (
      q &&
      !`${r.code} ${r.requester} ${r.destination} ${r.reason}`
        .toLowerCase()
        .includes(q)
    ) {
      return false;
    }
    if (status !== "Semua Status" && r.status !== status) return false;
    if (month !== "Semua Tanggal" && r.filedAt.slice(0, 7) !== month) return false;
    if (method !== "Semua Metode" && r.method !== method) return false;
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Data selalu diambil dari props terbaru, jadi panel ikut berubah setelah revalidate.
  const selected = refunds.find((r) => r.id === selectedId) ?? null;

  const count = (s: string) => refunds.filter((r) => r.status === s).length;

  function select(refund: RefundDTO) {
    setSelectedId(refund.id);
    setNote("");
  }

  const selectCls =
    "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 outline-none focus:border-emerald-600";

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Manajemen Refund
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manajemen Refund
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Pantau pengajuan refund, verifikasi bukti, dan catat status
            penyelesaian refund tiket budaya.
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportCsv(filtered)}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <Download size={16} /> Ekspor Laporan
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:w-[320px]">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari ID refund, nama pengguna, destinasi..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className={selectCls}
        >
          <option>Semua Status</option>
          <option>Menunggu</option>
          <option>Diproses</option>
          <option>Disetujui</option>
          <option>Ditolak</option>
        </select>
        <select
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setPage(1);
          }}
          className={selectCls}
        >
          <option value="Semua Tanggal">Semua Tanggal</option>
          {months.map((key) => (
            <option key={key} value={key}>
              {monthFmt.format(new Date(`${key}-01T00:00:00Z`))}
            </option>
          ))}
        </select>
        <select
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            setPage(1);
          }}
          className={selectCls}
        >
          <option>Semua Metode</option>
          {methods.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Total Pengajuan"
          value={refunds.length}
          subtitle="Semua pengajuan refund"
          icon={<Receipt size={19} />}
          tone="emerald"
        />
        <Stat
          title="Menunggu Review"
          value={count("Menunggu")}
          subtitle="Membutuhkan tindakan admin"
          icon={<Clock size={19} />}
          tone="slate"
        />
        <Stat
          title="Disetujui"
          value={count("Disetujui")}
          subtitle="Refund berhasil diproses"
          icon={<CircleCheck size={19} />}
          tone="emerald"
        />
        <Stat
          title="Ditolak"
          value={count("Ditolak")}
          subtitle="Pengajuan ditolak"
          icon={<CircleX size={19} />}
          tone="red"
        />
      </div>

      {/* TABEL + PANEL DETAIL */}
      <div
        className={`mt-6 grid grid-cols-1 gap-6 ${
          selected ? "xl:grid-cols-[minmax(0,1fr)_380px]" : ""
        }`}
      >
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-5">
            <h2 className="text-base font-bold text-slate-900">
              Daftar Pengajuan Refund
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              Menampilkan{" "}
              {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} dari{" "}
              {filtered.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">ID Refund</th>
                  <th className="px-3 py-3">Nama Pengguna</th>
                  <th className="px-3 py-3">Destinasi / Tiket</th>
                  <th className="px-3 py-3">Tanggal</th>
                  <th className="px-3 py-3">Nominal</th>
                  <th className="px-3 py-3">Alasan</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.length ? (
                  visible.map((r) => (
                    <tr
                      key={r.id}
                      className={r.id === selectedId ? "bg-emerald-50/40" : ""}
                    >
                      <td className="px-5 py-4 font-bold text-emerald-800">
                        #{r.code}
                      </td>
                      <td className="px-3 py-4 text-slate-800">{r.requester}</td>
                      <td className="px-3 py-4 text-slate-700">
                        {r.destination}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                        {dateFmt.format(new Date(r.filedAt))}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 font-bold text-slate-800">
                        {rupiah(r.amount)}
                      </td>
                      <td className="px-3 py-4 text-slate-500">{r.reason}</td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(r.status)}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => select(r)}
                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            Lihat Detail
                          </button>
                          {canApprove(r) && (
                            <button
                              type="button"
                              onClick={() =>
                                setDialog({ type: "approve", refund: r })
                              }
                              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                            >
                              Setujui
                            </button>
                          )}
                          {canReject(r) && (
                            <button
                              type="button"
                              onClick={() =>
                                setDialog({ type: "reject", refund: r })
                              }
                              className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Tolak
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Tidak ada pengajuan yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Menampilkan{" "}
              {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} dari{" "}
              {filtered.length} pengajuan
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-label="Halaman sebelumnya"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-lg border border-slate-200 px-2.5 py-2 text-slate-500 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
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
                onClick={() => setPage(currentPage + 1)}
                className="rounded-lg border border-slate-200 px-2.5 py-2 text-slate-500 disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* PANEL DETAIL: kolom kanan di layar lebar, overlay di layar kecil */}
        {selected && (
          <div
            className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 xl:static xl:z-auto xl:block xl:bg-transparent"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
          >
            <DetailPanel
              refund={selected}
              note={note}
              onNoteChange={setNote}
              onClose={() => setSelectedId(null)}
              onApprove={() => setDialog({ type: "approve", refund: selected })}
              onReject={() => setDialog({ type: "reject", refund: selected })}
            />
          </div>
        )}
      </div>

      {dialog && (
        <DecisionDialog
          key={`${dialog.type}-${dialog.refund.id}`}
          type={dialog.type}
          refund={dialog.refund}
          note={dialog.refund.id === selectedId ? note : ""}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

// =============================================================
// KARTU STATISTIK
// =============================================================

function Stat({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  tone: "emerald" | "slate" | "red";
}) {
  const toneCls = {
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-500",
    red: "bg-red-50 text-red-600",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneCls}`}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

// =============================================================
// PANEL DETAIL PENGAJUAN
// =============================================================

function DetailPanel({
  refund: r,
  note,
  onNoteChange,
  onClose,
  onApprove,
  onReject,
}: {
  refund: RefundDTO;
  note: string;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const decided = r.status === "Disetujui" || r.status === "Ditolak";

  return (
    <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-5 xl:h-auto xl:max-w-none xl:rounded-2xl xl:border xl:border-slate-200 xl:shadow-sm">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-slate-900">
            Detail Pengajuan Refund
          </h2>
          <p className="text-xs text-slate-400">#{r.code}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(r.status)}`}
        >
          {r.status}
        </span>
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-900">
        Informasi Pengguna
      </h3>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
          {initials(r.requester)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{r.requester}</p>
          <p className="text-xs text-slate-500">{r.participants}</p>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-900">
        Informasi Pesanan
      </h3>
      <div className="mt-3 rounded-xl border border-emerald-600 p-4">
        <p className="text-sm font-semibold text-slate-800">
          Rincian Pengajuan
        </p>
        <dl className="mt-3 space-y-2 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-400">Nomor transaksi</dt>
            <dd className="font-semibold text-slate-700">{r.trxCode}</dd>
          </div>
          <div>
            <dd className="font-semibold text-slate-800">{r.destination}</dd>
            <dd className="mt-1 text-slate-500">{r.visitInfo}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-400">Nominal pengajuan</dt>
            <dd className="font-bold text-slate-800">{rupiah(r.amount)}</dd>
          </div>
        </dl>
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-900">Alasan Refund</h3>
      <div className="mt-3 rounded-xl border border-emerald-600 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          Alasan pengajuan · {r.reason}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {r.reasonDetail || "—"}
        </p>
        <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
          Diajukan pada {dateTimeFmt.format(new Date(r.filedAt))} WIB
        </p>
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-900">Bukti Refund</h3>
      <div className="mt-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/60 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
          Jelajah Topeng / {r.method}
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-700">
          Pembayaran berhasil
        </p>
        <p className="text-xl font-bold text-emerald-700">
          {rupiah(r.amount)}
        </p>
        <p className="mt-2 text-[11px] text-slate-600">
          {r.trxCode} · {r.requester}
        </p>
        <p className="text-[11px] text-slate-600">{r.visitInfo}</p>
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-900">
        Metode Pembayaran
      </h3>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <CreditCard size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{r.method}</p>
          <p className="text-xs text-slate-500">{rupiah(r.amount)}</p>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-900">Timeline Status</h3>
      <ol className="mt-3 space-y-4 border-l border-slate-200 pl-4">
        <TimelineItem
          title="Pengajuan diterima"
          detail={`${dateTimeFmt.format(new Date(r.filedAt))} WIB`}
        />
        <TimelineItem
          title="Bukti diterima"
          detail={`${dateTimeFmt.format(new Date(r.proofAt))} WIB`}
        />
        {r.status === "Disetujui" || r.status === "Ditolak" ? (
          <TimelineItem
            title={r.status === "Disetujui" ? "Refund disetujui" : "Refund ditolak"}
            detail={
              r.decidedAt
                ? `${dateTimeFmt.format(new Date(r.decidedAt))} WIB`
                : ""
            }
            tone={r.status === "Disetujui" ? "emerald" : "red"}
          />
        ) : (
          <TimelineItem
            title={
              r.status === "Diproses"
                ? "Sedang diproses"
                : "Menunggu review admin"
            }
            detail="Sedang diproses"
          />
        )}
      </ol>

      <h3 className="mt-6 text-sm font-bold text-slate-900">Catatan Admin</h3>
      {decided ? (
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          {r.rejectReason && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              Alasan penolakan: {r.rejectReason}
            </p>
          )}
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs">
            {r.adminNote || "Tidak ada catatan."}
          </p>
        </div>
      ) : (
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Tambahkan catatan untuk tim operasional..."
          className="mt-3 w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      )}

      {(canApprove(r) || canReject(r)) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {canReject(r) && (
            <button
              type="button"
              onClick={onReject}
              className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Tolak Refund
            </button>
          )}
          {canApprove(r) && (
            <button
              type="button"
              onClick={onApprove}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Setujui Refund
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

function TimelineItem({
  title,
  detail,
  tone = "emerald",
}: {
  title: string;
  detail: string;
  tone?: "emerald" | "red";
}) {
  return (
    <li className="relative">
      <span
        className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${
          tone === "red" ? "bg-red-500" : "bg-emerald-600"
        }`}
      />
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </li>
  );
}

// =============================================================
// DIALOG KONFIRMASI SETUJUI / TOLAK (Server Action + useActionState)
// =============================================================

function DecisionDialog({
  type,
  refund,
  note,
  onClose,
}: {
  type: "approve" | "reject";
  refund: RefundDTO;
  note: string;
  onClose: () => void;
}) {
  const toast = useToast();
  const isReject = type === "reject";
  const [state, action, pending] = useActionState(decideRefund, {} as FormState);
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [edited, setEdited] = useState(false);

  // Error langsung di klien (aturan sama dengan server) + error dari server
  const liveError = isReject ? checkRefundReason(reason) : "";
  const serverError = !edited ? state.errors?.reason?.[0] : undefined;
  const shownError =
    isReject && (touched || state.ts) ? liveError || serverError || "" : "";

  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) {
      toast.success(state.message ?? "Refund berhasil diproses");
      onClose();
    } else {
      toast.error(state.message ?? "Gagal memproses refund.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="refund-dialog-title"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start gap-4 border-b border-slate-100 p-6">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              isReject ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isReject ? <CircleX size={24} /> : <CircleCheck size={24} />}
          </div>
          <div>
            <h2
              id="refund-dialog-title"
              className="text-lg font-bold text-slate-900"
            >
              {isReject ? "Konfirmasi Tolak Refund" : "Konfirmasi Setujui Refund"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isReject
                ? "Masukkan alasan penolakan untuk pengajuan ini."
                : "Pastikan data pengajuan sudah benar sebelum menyetujui pengembalian dana."}
            </p>
          </div>
        </div>

        <form action={action} className="space-y-4 p-6">
          <input type="hidden" name="id" value={refund.id} />
          <input type="hidden" name="decision" value={type} />
          <input type="hidden" name="note" value={note} />

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Receipt size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">#{refund.code}</p>
              <p className="text-xs text-slate-500">{refund.requester}</p>
            </div>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Nominal refund</dt>
              <dd className="font-bold text-slate-900">
                {rupiah(refund.amount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Metode</dt>
              <dd className="font-bold text-slate-900">{refund.method}</dd>
            </div>
          </dl>

          {isReject ? (
            <div>
              <label
                htmlFor="refund-reason"
                className="block text-sm font-bold text-slate-900"
              >
                Alasan penolakan
              </label>
              <textarea
                id="refund-reason"
                name="reason"
                required
                rows={4}
                value={reason}
                autoFocus
                onChange={(e) => {
                  setReason(e.target.value);
                  setEdited(true);
                }}
                onBlur={() => setTouched(true)}
                aria-invalid={!!shownError}
                placeholder="Pengajuan refund melewati batas waktu pembatalan, yaitu maksimal 24 jam sebelum jadwal kunjungan."
                className={`mt-2 w-full resize-y rounded-xl border px-3 py-2 text-sm outline-none ${
                  shownError
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-emerald-600"
                }`}
              />
              {shownError && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {shownError}
                </p>
              )}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Pengajuan refund akan diproses ke rekening asal pembayaran.
              Pastikan saldo dana operasional mencukupi.
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending || (isReject && !!liveError)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
                isReject
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              {pending
                ? "Memproses..."
                : isReject
                  ? "Tolak Refund"
                  : "Setujui Refund"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}