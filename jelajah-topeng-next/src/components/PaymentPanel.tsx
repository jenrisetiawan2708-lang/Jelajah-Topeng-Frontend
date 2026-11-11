"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { fetchPayments, refreshPaymentStatus, removePayment } from "@/app/actions/payments";
import { PAYMENT_STATUS_LABEL, type PaymentDTO } from "@/lib/payment-schema";

const rupiah = (n: number) => `Rp${new Intl.NumberFormat("id-ID").format(n)}`;

function badgeCls(status: string) {
  if (status === "paid") return "bg-emerald-50 text-emerald-700";
  if (status === "pending") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

// Transaksi lunas / dikembalikan dikunci karena dipakai untuk angka pendapatan.
const canDelete = (status: string) => status !== "paid" && status !== "refunded";

export default function PaymentPanel() {
  const [items, setItems] = useState<PaymentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [confirmId, setConfirmId] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchPayments();
    if (res.ok) setItems(res.data);
    else setMessage({ type: "error", text: res.error });
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onRefresh(orderId: string) {
    setBusyId(orderId);
    setMessage(null);
    const res = await refreshPaymentStatus(orderId);
    setBusyId("");
    if (res.ok) {
      setItems((prev) => prev.map((p) => (p.orderId === orderId ? res.data : p)));
      setMessage({
        type: "ok",
        text: `Status ${orderId}: ${PAYMENT_STATUS_LABEL[res.data.status]}.`,
      });
    } else {
      setMessage({ type: "error", text: res.error });
    }
  }

  async function onDelete(orderId: string) {
    setBusyId(orderId);
    setMessage(null);
    const res = await removePayment(orderId);
    setBusyId("");
    setConfirmId("");
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.orderId !== orderId));
      setMessage({ type: "ok", text: `Tagihan ${orderId} berhasil dihapus.` });
    } else {
      setMessage({ type: "error", text: res.error });
    }
  }

  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header card */}
      <div className="flex flex-wrap items-start gap-x-3 gap-y-3 border-b border-slate-100 p-4 sm:items-center sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <CreditCard size={19} />
        </div>

        {/* min-w-0 + basis: boleh mengecil & teks turun baris, tidak melebar keluar card */}
        <div className="min-w-0 flex-1 basis-[12rem]">
          <h2 className="break-words text-sm font-bold text-slate-900">Transaksi Pengunjung</h2>
          <p className="break-words text-xs text-slate-400">
            Pengunjung membeli tiket lewat aplikasi mobile dan membayar di halaman Midtrans
            (Sandbox). Admin memantau statusnya di sini.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={13} /> Muat ulang
        </button>
      </div>

      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`break-words px-4 pt-4 text-sm sm:px-5 ${
            message.type === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="divide-y divide-slate-100">
        {loading ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">Memuat transaksi...</p>
        ) : items.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">
            Belum ada transaksi dari pengunjung.
          </p>
        ) : (
          items.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-4 sm:px-5"
            >
              {/* Info transaksi: full lebar di HP, berbagi baris di layar lebar */}
              <div className="min-w-0 flex-1 basis-full sm:basis-[14rem]">
                <p className="break-words text-sm font-semibold text-slate-800">{p.itemName}</p>
                <p className="mt-1 break-all text-xs text-slate-500">
                  {p.customerName || "Pengunjung"}
                  {p.customerEmail ? ` · ${p.customerEmail}` : ""}
                </p>
                <p className="mt-1 break-all text-xs text-slate-400">
                  {p.orderId} ·{" "}
                  {new Date(p.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              {/* Nominal + status */}
              <div className="flex shrink-0 items-center gap-3">
                <p className="text-sm font-semibold text-slate-800">{rupiah(p.amount)}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${badgeCls(p.status)}`}
                >
                  {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
                </span>
              </div>

              {/* Tombol aksi: boleh turun baris kalau sempit */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void onRefresh(p.orderId)}
                  disabled={busyId === p.orderId}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  {busyId === p.orderId ? "Mengecek..." : "Cek Status"}
                </button>

                {canDelete(p.status) &&
                  (confirmId === p.orderId ? (
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-500">Hapus tagihan ini?</span>
                      <button
                        type="button"
                        onClick={() => void onDelete(p.orderId)}
                        disabled={busyId === p.orderId}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {busyId === p.orderId ? "Menghapus..." : "Ya, hapus"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId("")}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Batal
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(p.orderId)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}