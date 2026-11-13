"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Ticket, Users, WalletCards } from "lucide-react";
import AdminActionButton from "@/components/AdminActionButton";
import StatCard from "@/components/ui/StatCard";
import TransactionRow from "@/components/dashboard/TransactionRow";
import Masterclass from "@/components/dashboard/Masterclass";
import FavoriteCard from "@/components/dashboard/FavoriteCard";
import type { DashboardSummary } from "@/lib/dal";
import { MENU_BY_ID, type PageId } from "@/lib/menu";

const FAVORITES = [
  { number: "01", name: "Makam Mbah Reni" },
  { number: "02", name: "Situs Sumur Windu" },
  { number: "03", name: "Mandala Empu Purwa" },
  { number: "04", name: "Situs Joko Lolo" },
];

export default function DashboardView({ summary }: { summary: DashboardSummary }) {
  const router = useRouter();
  const go = (id: PageId) => router.push(MENU_BY_ID[id].href);

  const [period, setPeriod] = useState("30 Hari Terakhir");
  const [showPeriods, setShowPeriods] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-700">Dashboard Kuratorial</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Selamat Datang, Admin!
          </h1>
          <p className="mt-2 text-sm text-slate-500">{MENU_BY_ID.dashboard.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              aria-expanded={showPeriods}
              onClick={() => setShowPeriods((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 sm:px-4 sm:py-3 sm:text-sm"
            >
              {period}
            </button>
            {showPeriods && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {["7 Hari Terakhir", "30 Hari Terakhir", "90 Hari Terakhir"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setPeriod(option);
                      setShowPeriods(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => go("booking")}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 sm:px-4 sm:py-3 sm:text-sm"
          >
            + Buat Reservasi Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Kunjungan"
          value={summary.visits.toLocaleString("id-ID")}
          subtitle="Data belum tersedia"
          icon={Users}
          onClick={() => go("exploration")}
        />
        <StatCard
          title="Tiket Terverifikasi"
          value={summary.verifiedTickets.toLocaleString("id-ID")}
          subtitle="Data belum tersedia"
          icon={Ticket}
          onClick={() => go("ticketing")}
        />
        <StatCard
          title="Sesi Maestro Aktif"
          value={summary.activeSessions.toLocaleString("id-ID")}
          subtitle="Jadwal belum dikonfirmasi"
          icon={CalendarDays}
          onClick={() => go("booking")}
        />
        <StatCard
          title="Pendapatan Budaya"
          value={summary.revenue.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          })}
          subtitle="Data belum tersedia"
          icon={WalletCards}
          onClick={() => go("payment")}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Transaksi Reservasi & Workshop Budaya
              </h2>
              <p className="mt-1 text-xs text-slate-400">Aktivitas transaksi terbaru</p>
            </div>
            <button
              onClick={() => go("payment")}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Lihat Semua
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {summary.transactions.length ? (
              summary.transactions.map((item) => (
                <TransactionRow key={item.id} {...item} onClick={() => go("payment")} />
              ))
            ) : (
              <p className="p-6 text-sm text-slate-500">Belum ada transaksi.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Masterclass Hari Ini</h2>
              <p className="mt-1 text-xs text-slate-400">Jadwal sesi budaya</p>
            </div>
            <button
              onClick={() => go("booking")}
              className="text-xs font-semibold text-emerald-700"
            >
              Lihat Jadwal
            </button>
          </div>
          <div className="space-y-4 p-6">
            {summary.masterclasses.length ? (
              summary.masterclasses.map((item) => (
                <Masterclass key={item.time} {...item} onClick={() => go("booking")} />
              ))
            ) : (
              <p className="text-sm text-slate-500">Belum ada jadwal.</p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Statistik Sentra Favorit</h2>
            <p className="mt-1 text-xs text-slate-400">Lokasi yang tercantum pada wireframe</p>
          </div>
          <button
            onClick={() => go("exploration")}
            className="text-xs font-semibold text-emerald-700"
          >
            Kelola Sentra
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FAVORITES.map((item) => (
            <FavoriteCard
              key={item.number}
              number={item.number}
              name={item.name}
              visits="Jumlah kunjungan belum tersedia"
              onClick={() => go("exploration")}
            />
          ))}
        </div>
      </section>

      <AdminActionButton />
    </div>
  );
}
