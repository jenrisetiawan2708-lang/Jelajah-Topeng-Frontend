"use client";

import { useActionState, useEffect, useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { deleteRecord, saveRecord } from "@/app/actions/records";
import type { DashboardSummary } from "@/lib/dal";
import {
  CONTENT_PROFILES,
  KINDS,
  WILAYAH_SUGGESTIONS,
  type FieldErrors,
  type FormState,
  type RecordDTO,
  type RecordDraft,
  type RecordKind,
  type RecordsByKind,
} from "@/lib/content-config";
import { checkRecord, type FieldKey } from "@/lib/schemas";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Compass,
  CreditCard,
  Eye,
  Grid2X2,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Pencil,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Ticket,
  TrendingUp,
  Trash2,
  User,
  UserCog,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";

import logo from "@/assets/logo-jelajah-topeng.png";
import AdminActionButton from "@/components/AdminActionButton";
import RefundPage from "@/components/RefundPage";
import { useToast } from "@/components/ToastProvider";
import type { RefundDTO } from "@/lib/refund-schema";

type Page =
  | "dashboard"
  | "exploration"
  | "panji"
  | "materi"
  | "booking"
  | "progres"
  | "ticketing"
  | "payment"
  | "refund"
  | "notification"
  | "faq"
  | "users"
  | "profile";

// Deskripsi tiap halaman: dipakai sebagai subjudul halaman dan untuk pencarian.
const PAGE_DESCRIPTIONS: Record<Page, string> = {
  dashboard: "Pantau aktivitas Jelajah Topeng dalam satu dashboard.",
  exploration:
    "Jelajahi peta interaktif, detail titik lokasi, sejarah kampung, tokoh, tradisi, dan dokumentasi budaya.",
  panji:
    "Ikuti pemberhentian cerita Panji, kumpulkan clue, buka galeri budaya, lalu raih reward.",
  materi:
    "Temukan profil maestro, materi bertahap, detail video/artikel/PDF, progres modul, dan jadwal sesi.",
  booking:
    "Pilih sesi maestro di kalender, kirim formulir konfirmasi, dan lihat riwayat booking.",
  progres:
    "Pantau misi dan modul yang selesai, koleksi lencana, sertifikat, serta riwayat aktivitas.",
  ticketing:
    "Pilih paket kunjungan, jumlah peserta, tanggal, isi data pemesan, lalu lanjut checkout.",
  payment:
    "Tinjau ringkasan checkout, status pembayaran, e-ticket/QR code, dan riwayat pembelian.",
  refund:
    "Pantau pengajuan refund, verifikasi bukti, dan catat status penyelesaian refund tiket budaya.",
  notification:
    "Lihat pengingat jadwal, status booking, pembaruan misi, dan informasi perjalanan budaya.",
  faq: "Temukan panduan akun, eksplorasi, booking maestro, tiket, checkout, dan pembayaran.",
  users:
    "Kelola informasi profil pengguna yang dipakai untuk konfirmasi booking dan pembelian tiket.",
  profile:
    "Profil admin dan pengaturan akun: identitas, jabatan, dan keamanan.",
};

function App({
  dashboardSummary,
  records,
  refunds,
  userEmail,
  userRole,
}: {
  dashboardSummary: DashboardSummary;
  records: RecordsByKind;
  refunds: RefundDTO[];
  userEmail: string;
  userRole: "admin" | "user";
}) {
  const [globalQuery, setGlobalQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");

  const navigate = (target: Page) => {
    setSidebarOpen(false);
    setPage(target);
  };

  if (userRole !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Login berhasil
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Akses admin diperlukan
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Akun {userEmail} sudah terautentikasi, tetapi tidak memiliki peran
            admin. Data dashboard tidak dikirim ke akun ini.
          </p>
          <form action={signOutAction} className="mt-6">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Keluar
            </button>
          </form>
        </section>
      </main>
    );
  }

  // =========================================================
  // SIDEBAR
  // =========================================================

  const mainMenus = [
    {
      id: "dashboard" as Page,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "exploration" as Page,
      label: "Eksplorasi Kampung",
      icon: Compass,
    },
    {
      id: "panji" as Page,
      label: "Jejak Sang Panji",
      icon: Landmark,
    },
    {
      id: "materi" as Page,
      label: "Belajar dengan Maestro",
      icon: BookOpen,
    },
    {
      id: "booking" as Page,
      label: "Jadwal & Booking",
      icon: CalendarDays,
    },
    {
      id: "progres" as Page,
      label: "Progres Budaya",
      icon: TrendingUp,
    },
  ];

  const operationalMenus = [
    {
      id: "ticketing" as Page,
      label: "Ticketing Online",
      icon: Ticket,
    },
    {
      id: "payment" as Page,
      label: "Pembayaran & Transaksi",
      icon: CreditCard,
    },
    {
      id: "refund" as Page,
      label: "Manajemen Refund",
      icon: Receipt,
    },
    {
      id: "notification" as Page,
      label: "Kelola Notifikasi",
      icon: Bell,
    },
    {
      id: "faq" as Page,
      label: "FAQ & Pusat Bantuan",
      icon: CircleHelp,
    },
  ];

  const systemMenus = [
    {
      id: "users" as Page,
      label: "Profil Pengguna",
      icon: Users,
    },
    {
      id: "profile" as Page,
      label: "Profil Admin",
      icon: UserCog,
    },
  ];

  const pageNames: Record<Page, string> = {
    dashboard: "Dashboard",
    exploration: "Eksplorasi Kampung",
    panji: "Jejak Sang Panji",
    materi: "Belajar dengan Maestro",
    booking: "Jadwal & Booking",
    progres: "Progres Budaya",
    ticketing: "Ticketing Online",
    payment: "Pembayaran & Transaksi",
    refund: "Manajemen Refund",
    notification: "Kelola Notifikasi",
    faq: "FAQ & Pusat Bantuan",
    users: "Profil Pengguna",
    profile: "Profil Admin",
  };

  // =========================================================
  // PENCARIAN GLOBAL (menu + isi data)
  // =========================================================

  const searchResults = buildSearchResults(
    globalQuery,
    [
      { heading: "Navigasi Utama", items: mainMenus },
      { heading: "Komersial & Operasional", items: operationalMenus },
      { heading: "Administrasi Sistem", items: systemMenus },
    ],
    dashboardSummary,
    records,
  );
  const menuResults = searchResults.filter((item) => item.type === "menu");
  const dataResults = searchResults.filter((item) => item.type === "data");
  const showSearchDropdown = searchOpen && globalQuery.trim().length >= 2;

  function selectSearchResult(result: SearchResult) {
    setSearchOpen(false);
    setGlobalQuery(result.query);
    navigate(result.page);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <div className="flex min-h-screen">
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen w-[255px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* BRAND */}
          <div className="flex h-[100px] items-center justify-between border-b border-slate-100 px-6">
            <div className="flex items-center gap-3">
              <img
                src={logo.src}
                alt="Logo Jelajah Topeng"
                className="h-11 w-11 object-contain"
              />

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[17px] font-bold leading-tight text-slate-900">
                    Jelajah Topeng
                  </h1>

                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>

                <p className="text-[12px] text-slate-400">
                  Admin Panel Kuratorial
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 lg:hidden"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* MENU */}
          <div className="flex-1 overflow-y-auto px-4 py-7">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigasi Utama
            </p>

            <nav className="space-y-1">
              {mainMenus.map((item) => {
                const Icon = item.icon;
                const active = page === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Komersial & Operasional
            </p>

            <nav className="space-y-1">
              {operationalMenus.map((item) => {
                const Icon = item.icon;
                const active = page === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Administrasi Sistem
            </p>

            <nav className="space-y-1">
              {systemMenus.map((item) => {
                const Icon = item.icon;
                const active = page === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* AKUN (khusus mobile: pengaturan & logout pindah ke sidebar) */}
            <div className="mt-8 lg:hidden">
              <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Akun
              </p>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => navigate("profile")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
                >
                  <Settings size={19} strokeWidth={1.8} />
                  <span>Pengaturan</span>
                </button>

                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={19} strokeWidth={1.8} />
                    <span>Logout</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* USER CARD */}
          <button
            onClick={() => navigate("profile")}
            className="mx-4 mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-left transition hover:bg-emerald-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
              RA
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Admin Jelajah Topeng
              </p>

              <p className="text-[11px] text-slate-400">Super Admin Panji</p>
            </div>

            <ShieldCheck size={17} className="text-emerald-700" />
          </button>
        </aside>

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[255px]">
          {/* =================================================
              TOPBAR
          ================================================= */}
          <header className="sticky top-0 z-20 flex h-[64px] items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:h-[78px] lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Buka menu"
            >
              <Menu size={22} />
            </button>

            {/* RIGHT SIDE */}
            <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4 lg:gap-5">
              {/* SEARCH GLOBAL */}
              <div
                className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setSearchOpen(false);
                  }
                }}
              >
                <div className="flex h-10 w-32 min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 transition-all focus-within:w-52 focus-within:ring-2 focus-within:ring-emerald-100 sm:w-56 sm:focus-within:w-56 lg:w-[330px] lg:focus-within:w-[330px]">
                  <Search size={17} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari menu atau data..."
                    value={globalQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                      setGlobalQuery(event.target.value);
                      setSearchOpen(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setSearchOpen(false);
                      if (event.key === "Enter" && searchResults[0]) {
                        event.preventDefault();
                        selectSearchResult(searchResults[0]);
                      }
                    }}
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                  {globalQuery && (
                    <button
                      type="button"
                      aria-label="Hapus pencarian"
                      onClick={() => {
                        setGlobalQuery("");
                        setSearchOpen(false);
                      }}
                      className="shrink-0 text-slate-400 hover:text-slate-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {showSearchDropdown && (
                  <div
                    onMouseDown={(event) => event.preventDefault()}
                    className="absolute right-0 top-12 z-50 max-h-[70vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:w-[400px]"
                  >
                    {searchResults.length ? (
                      <>
                        {menuResults.length > 0 && (
                          <div>
                            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Menu
                            </p>
                            {menuResults.map((result) => (
                              <SearchResultRow
                                key={result.key}
                                result={result}
                                onSelect={selectSearchResult}
                              />
                            ))}
                          </div>
                        )}
                        {dataResults.length > 0 && (
                          <div>
                            <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Data
                            </p>
                            {dataResults.map((result) => (
                              <SearchResultRow
                                key={result.key}
                                result={result}
                                onSelect={selectSearchResult}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="px-3 py-4 text-sm text-slate-500">
                        Tidak ada hasil untuk “{globalQuery.trim()}”.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* SYSTEM STATUS */}
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 lg:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Sistem Online
              </div>

              {/* NOTIFICATION (desktop saja) */}
              <button
                type="button"
                onClick={() => navigate("notification")}
                className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 lg:flex"
                title="Notifikasi"
              >
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {/* SETTINGS (desktop saja) */}
              <button
                type="button"
                onClick={() => navigate("profile")}
                className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 lg:flex"
                title="Pengaturan Profil"
              >
                <Settings size={20} />
              </button>

              <div className="hidden h-7 w-px bg-slate-200 lg:block" />

              {/* LOGOUT (desktop saja) */}
              <form action={signOutAction} className="hidden lg:block">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </header>

          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            {/* BREADCRUMBS (di bawah topbar, atas judul halaman) */}
            <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm">
                <li className="shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate("dashboard")}
                    className="font-medium text-slate-500 transition hover:text-emerald-700"
                  >
                    Jelajah Topeng
                  </button>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={16} className="text-slate-400" />
                </li>
                <li
                  aria-current="page"
                  className="font-semibold text-slate-900"
                >
                  {pageNames[page]}
                </li>
              </ol>
            </nav>

            {page === "dashboard" && (
              <>
                <Dashboard
                  navigate={navigate}
                  query={globalQuery}
                  summary={dashboardSummary}
                />
                <AdminActionButton />
              </>
            )}

            {page === "exploration" && (
              <GenericPage
                kind="exploration"
                title="Eksplorasi Kampung"
                description={PAGE_DESCRIPTIONS.exploration}
                icon={Compass}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.exploration}
              />
            )}

            {page === "panji" && (
              <GenericPage
                kind="panji"
                title="Jejak Sang Panji"
                description={PAGE_DESCRIPTIONS.panji}
                icon={Landmark}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.panji}
              />
            )}

            {page === "materi" && (
              <GenericPage
                kind="materi"
                title="Belajar dengan Maestro"
                description={PAGE_DESCRIPTIONS.materi}
                icon={BookOpen}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.materi}
              />
            )}

            {page === "booking" && (
              <GenericPage
                kind="booking"
                title="Kalender Jadwal & Booking"
                description={PAGE_DESCRIPTIONS.booking}
                icon={CalendarDays}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.booking}
              />
            )}

            {page === "progres" && (
              <GenericPage
                kind="progres"
                title="Progres Budaya"
                description={PAGE_DESCRIPTIONS.progres}
                icon={TrendingUp}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.progres}
              />
            )}

            {page === "ticketing" && (
              <GenericPage
                kind="ticketing"
                title="Ticketing Online"
                description={PAGE_DESCRIPTIONS.ticketing}
                icon={Ticket}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.ticketing}
              />
            )}

            {page === "payment" && (
              <GenericPage
                kind="payment"
                title="Checkout & Pembayaran"
                description={PAGE_DESCRIPTIONS.payment}
                icon={CreditCard}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.payment}
              />
            )}

            {page === "refund" && <RefundPage refunds={refunds} />}

            {page === "notification" && (
              <GenericPage
                kind="notification"
                title="Notifikasi"
                description={PAGE_DESCRIPTIONS.notification}
                icon={Bell}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.notification}
              />
            )}

            {page === "faq" && (
              <GenericPage
                kind="faq"
                title="Bantuan / FAQ"
                description={PAGE_DESCRIPTIONS.faq}
                icon={CircleHelp}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.faq}
              />
            )}

            {page === "users" && (
              <GenericPage
                kind="users"
                title="Profil Pengguna"
                description={PAGE_DESCRIPTIONS.users}
                icon={Users}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
                records={records.users}
              />
            )}

            {page === "profile" && (
              <ProfilePage userEmail={userEmail} userRole={userRole} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// SEARCH RESULT ROW
// =============================================================

function SearchResultRow({
  result,
  onSelect,
}: {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(result)}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-emerald-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {result.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-400">
          {result.subtitle}
        </p>
      </div>
      <ChevronRight size={15} className="shrink-0 text-slate-300" />
    </button>
  );
}

// =============================================================
// DASHBOARD
// =============================================================

function Dashboard({
  navigate,
  query,
  summary,
}: {
  navigate: (page: Page) => void;
  query: string;
  summary: DashboardSummary;
}) {
  const [period, setPeriod] = useState("30 Hari Terakhir");
  const [showPeriods, setShowPeriods] = useState(false);
  const visibleTransactions = summary.transactions.filter((item) =>
    `${item.id} ${item.name} ${item.location} ${item.amount} ${item.status}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const masterclasses = summary.masterclasses.filter((item) =>
    `${item.title} ${item.maestro} ${item.place}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-700">
            Dashboard Kuratorial
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Selamat Datang, Admin!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {PAGE_DESCRIPTIONS.dashboard}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              aria-expanded={showPeriods}
              onClick={() => setShowPeriods((open) => !open)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 sm:px-4 sm:py-3 sm:text-sm"
            >
              {period}
            </button>
            {showPeriods && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {[
                  "7 Hari Terakhir",
                  "30 Hari Terakhir",
                  "90 Hari Terakhir",
                ].map((option) => (
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
            onClick={() => navigate("booking")}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 sm:px-4 sm:py-3 sm:text-sm"
          >
            + Buat Reservasi Baru
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Kunjungan"
          value={summary.visits.toLocaleString("id-ID")}
          subtitle="Data belum tersedia"
          icon={Users}
          onClick={() => navigate("exploration")}
        />

        <StatCard
          title="Tiket Terverifikasi"
          value={summary.verifiedTickets.toLocaleString("id-ID")}
          subtitle="Data belum tersedia"
          icon={Ticket}
          onClick={() => navigate("ticketing")}
        />

        <StatCard
          title="Sesi Maestro Aktif"
          value={summary.activeSessions.toLocaleString("id-ID")}
          subtitle="Jadwal belum dikonfirmasi"
          icon={CalendarDays}
          onClick={() => navigate("booking")}
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
          onClick={() => navigate("payment")}
        />
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* TRANSACTIONS */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Transaksi Reservasi & Workshop Budaya
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Aktivitas transaksi terbaru
              </p>
            </div>

            <button
              onClick={() => navigate("payment")}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {visibleTransactions.length ? (
              visibleTransactions.map((item) => (
                <TransactionRow
                  key={item.id}
                  {...item}
                  onClick={() => navigate("payment")}
                />
              ))
            ) : (
              <p className="p-6 text-sm text-slate-500">
                Tidak ada transaksi yang cocok dengan pencarian.
              </p>
            )}
          </div>
        </section>

        {/* MASTERCLASS */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Masterclass Hari Ini
              </h2>

              <p className="mt-1 text-xs text-slate-400">Jadwal sesi budaya</p>
            </div>

            <button
              onClick={() => navigate("booking")}
              className="text-xs font-semibold text-emerald-700"
            >
              Lihat Jadwal
            </button>
          </div>

          <div className="space-y-4 p-6">
            {masterclasses.length ? (
              masterclasses.map((item) => (
                <Masterclass
                  key={item.time}
                  {...item}
                  onClick={() => navigate("booking")}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Tidak ada jadwal yang cocok dengan pencarian.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* FAVORIT */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Statistik Sentra Favorit
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Lokasi yang tercantum pada wireframe
            </p>
          </div>

          <button
            onClick={() => navigate("exploration")}
            className="text-xs font-semibold text-emerald-700"
          >
            Kelola Sentra
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FavoriteCard
            number="01"
            name="Makam Mbah Reni"
            visits="Jumlah kunjungan belum tersedia"
            onClick={() => navigate("exploration")}
          />

          <FavoriteCard
            number="02"
            name="Situs Sumur Windu"
            visits="Jumlah kunjungan belum tersedia"
            onClick={() => navigate("exploration")}
          />

          <FavoriteCard
            number="03"
            name="Mandala Empu Purwa"
            visits="Jumlah kunjungan belum tersedia"
            onClick={() => navigate("exploration")}
          />

          <FavoriteCard
            number="04"
            name="Situs Joko Lolo"
            visits="Jumlah kunjungan belum tersedia"
            onClick={() => navigate("exploration")}
          />
        </div>
      </section>
    </div>
  );
}

// =============================================================
// STAT CARD
// =============================================================

function StatCard({
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

// =============================================================
// TRANSACTION ROW
// =============================================================

function TransactionRow({
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

// =============================================================
// MASTERCLASS
// =============================================================
function Masterclass({
  time,
  title,
  maestro,
  place,
  onClick,
}: {
  time: string;
  title: string;
  maestro: string;
  place: string;
  onClick: () => void;
}) {
  const [dateLabel, timeLabel] = time.split(" · ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:bg-slate-50"
    >
      <div className="flex w-24 shrink-0 flex-col items-center justify-center self-stretch rounded-xl bg-emerald-50 px-2 py-3 text-center">
        <span className="text-[11px] font-bold leading-tight text-emerald-700">
          {dateLabel}
        </span>

        {timeLabel && (
          <span className="mt-1 text-[10px] font-semibold leading-tight text-emerald-700">
            {timeLabel}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-xs text-emerald-700">{maestro}</p>
        <p className="mt-1 text-xs text-slate-400">{place}</p>
      </div>
    </button>
  );
}
// =============================================================
// FAVORITE
// =============================================================

function FavoriteCard({
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

// =============================================================
// GENERIC PAGE: helper
// =============================================================

type GenericPageKind = RecordKind;

const EMPTY_DRAFT: RecordDraft = {
  name: "",
  description: "",
  location: "",
  date: "",
  amount: "",
  status: "Aktif",
  correctAnswer: "",
  correctClue: "",
  imageUrl: "",
  eventDate: "",
};

function inputCls(size: string, error?: string) {
  return `mt-2 ${size} w-full rounded-lg border px-3 text-sm outline-none ${
    error
      ? "border-red-400 focus:border-red-500"
      : "border-slate-300 focus:border-emerald-600"
  }`;
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <span role="alert" className="mt-1 block text-xs font-normal text-red-600">
      {message}
    </span>
  ) : null;
}

// =============================================================
// PENCARIAN GLOBAL: helper
// =============================================================

type SearchResult = {
  key: string;
  type: "menu" | "data";
  title: string;
  subtitle: string;
  page: Page;
  // Teks yang dipasang ke kolom pencarian setelah hasil dipilih.
  query: string;
};

function buildSearchResults(
  rawQuery: string,
  groups: { heading: string; items: { id: Page; label: string }[] }[],
  summary: DashboardSummary,
  records: RecordsByKind,
): SearchResult[] {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 2) return [];

  const results: SearchResult[] = [];
  const labelOf: Partial<Record<Page, string>> = {};
  groups.forEach((group) =>
    group.items.forEach((item) => {
      labelOf[item.id] = item.label;
    }),
  );

  // 1) Menu: judul menu, judul grup sidebar, atau deskripsi halaman
  for (const group of groups) {
    const groupMatches = group.heading.toLowerCase().includes(q);
    for (const item of group.items) {
      const matches =
        groupMatches ||
        item.label.toLowerCase().includes(q) ||
        PAGE_DESCRIPTIONS[item.id].toLowerCase().includes(q);
      if (matches) {
        results.push({
          key: `menu-${item.id}`,
          type: "menu",
          title: item.label,
          subtitle: group.heading,
          page: item.id,
          query: "",
        });
      }
    }
  }

  // 2) Isi data tiap halaman (dari server)
  const dataResults: SearchResult[] = [];
  for (const kind of KINDS) {
    for (const record of records[kind]) {
      const haystack = [
        record.name,
        record.description,
        record.location,
        record.date,
        record.amount,
        record.status,
      ]
        .join(" ")
        .toLowerCase();
      if (haystack.includes(q)) {
        dataResults.push({
          key: `data-${kind}-${record.id}`,
          type: "data",
          title: record.name,
          subtitle: `${labelOf[kind] ?? kind} · ${record.status}`,
          page: kind,
          query: record.name,
        });
      }
    }
  }

  // 3) Isi dashboard: transaksi & masterclass
  for (const item of summary.transactions) {
    if (
      `${item.id} ${item.name} ${item.location} ${item.amount} ${item.status}`
        .toLowerCase()
        .includes(q)
    ) {
      dataResults.push({
        key: `trx-${item.id}`,
        type: "data",
        title: item.name,
        subtitle: `Dashboard · Transaksi ${item.id}`,
        page: "dashboard",
        query: item.name,
      });
    }
  }
  for (const item of summary.masterclasses) {
    if (
      `${item.title} ${item.maestro} ${item.place}`.toLowerCase().includes(q)
    ) {
      dataResults.push({
        key: `mc-${item.time}-${item.title}`,
        type: "data",
        title: item.title,
        subtitle: `Dashboard · Masterclass ${item.maestro}`,
        page: "dashboard",
        query: item.title,
      });
    }
  }

  return [...results, ...dataResults.slice(0, 8)];
}

// =============================================================
// GENERIC PAGE
// =============================================================

function GenericPage({
  kind,
  title,
  description,
  icon: Icon,
  navigate,
  query,
  onQueryChange,
  records,
}: {
  kind: GenericPageKind;
  title: string;
  description: string;
  icon: LucideIcon;
  navigate: (page: Page) => void;
  query: string;
  onQueryChange: (value: string) => void;
  records: RecordDTO[];
}) {
  const profile = CONTENT_PROFILES[kind];
  const toast = useToast();

  // Field "Tahun" diganti satu kalender berlabel "Tanggal" (tahun ikut dari situ).
  const yearAsDate = profile.fields[3] === "Tahun";
  const dateLabel = yearAsDate ? "Tanggal" : profile.fields[3];
  // Halaman yang belum punya field tanggal sama sekali dapat input tanggal tambahan.
  const extraDate =
    kind !== "panji" && !yearAsDate && !profile.fields.includes("Tanggal");
  const isDateInput = yearAsDate || profile.fields[3] === "Tanggal";

  // Data berasal dari server (props). Setelah Server Action memanggil
  // revalidatePath, props ini otomatis berganti tanpa refresh.
  const items = records;

  const [sortAZ, setSortAZ] = useState(false);
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RecordDraft>(EMPTY_DRAFT);
  const [selectedItem, setSelectedItem] = useState<RecordDTO | null>(null);
  const [imageError, setImageError] = useState("");

  // Hasil Server Action (useActionState): pesan error dari server + status loading
  const [state, formAction, pending] = useActionState(
    saveRecord,
    {} as FormState,
  );
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  // Field yang sudah diubah sejak submit terakhir (error server-nya disembunyikan)
  const [edited, setEdited] = useState<Record<string, boolean>>({});

  const pageSize = 3;
  const matchingItems = items
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
  const pageCount = Math.max(1, Math.ceil(matchingItems.length / pageSize));
  const firstStatus = profile.statuses[0];
  const secondStatus = profile.statuses[1] ?? profile.statuses[0];
  // createdAt diperbarui setiap kali data ditambah atau diedit.
  // Data contoh memakai epoch (1970), jadi tidak dianggap sebagai pembaruan.
  const latestUpdate = items.reduce<string | undefined>((latest, item) => {
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

  const currentPage = Math.min(page, pageCount);
  const visibleItems = matchingItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // ---- Validasi ----
  // Aturan yang sama dengan server (lib/schemas.ts). Di klien dipakai untuk
  // error merah langsung saat mengetik; server tetap memvalidasi ulang.
  const allErrors = checkRecord(kind, draft);
  const canSubmit = Object.keys(allErrors).length === 0;

  function fieldError(key: FieldKey): string | undefined {
    const live = allErrors[key];
    const value = (draft[key] ?? "").trim();
    if (live && value) return live; // error langsung saat sudah mengetik
    if (!edited[key]) return serverErrors[key]?.[0]; // error dari server
    return undefined;
  }

  function setField(key: FieldKey, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setEdited((current) => ({ ...current, [key]: true }));
  }

  function closeModal() {
    setAdding(false);
    setEditing(false);
    setSelectedItem(null);
    setDraft(EMPTY_DRAFT);
    setImageError("");
    setServerErrors({});
    setEdited({});
  }

  // Menanggapi hasil Server Action: toast + tutup modal / tampilkan error
  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) {
      toast.success(state.message ?? "Data berhasil disimpan");
      closeModal();
      setPage(1);
    } else {
      setServerErrors(state.errors ?? {});
      toast.error(state.message ?? "Gagal menyimpan data.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function submitForm(formData: FormData) {
    setEdited({});
    formAction(formData);
  }

  function openAdd() {
    setSelectedItem(null);
    setEditing(false);
    setDraft({ ...EMPTY_DRAFT, status: firstStatus });
    setServerErrors({});
    setEdited({});
    setImageError("");
    setAdding(true);
  }

  function openEdit(item: RecordDTO) {
    setSelectedItem(item);
    setDraft({
      name: item.name,
      description: item.description,
      location: item.location,
      date: item.date,
      amount: item.amount,
      status: item.status,
      correctAnswer: item.correctAnswer,
      correctClue: item.correctClue,
      imageUrl: item.imageUrl,
      eventDate: item.eventDate,
    });
    setServerErrors({});
    setEdited({});
    setAdding(false);
    setEditing(true);
  }

  // ---- Field form (dipakai di layout grid maupun layout biasa) ----
  const locationField = (
    <label className="block text-sm font-medium text-slate-700">
      {profile.fields[2]}
      <input
        name="location"
        list={profile.fields[2] === "Wilayah" ? "wilayah-list" : undefined}
        value={draft.location}
        onChange={(e) => setField("location", e.target.value)}
        placeholder={
          profile.fields[2] === "Wilayah" ? "Ketik atau pilih wilayah" : undefined
        }
        aria-invalid={!!fieldError("location")}
        className={inputCls("h-10", fieldError("location"))}
      />
      {profile.fields[2] === "Wilayah" && (
        <datalist id="wilayah-list">
          {WILAYAH_SUGGESTIONS.map((wilayah) => (
            <option key={wilayah} value={wilayah} />
          ))}
        </datalist>
      )}
      <FieldError message={fieldError("location")} />
    </label>
  );

  const dateField = (
    <label className="block text-sm font-medium text-slate-700">
      {dateLabel}
      {isDateInput ? (
        <input
          name="date"
          type="date"
          value={draft.date}
          onChange={(e) => setField("date", e.target.value)}
          aria-invalid={!!fieldError("date")}
          className={inputCls("h-10", fieldError("date"))}
        />
      ) : (
        <input
          name="date"
          value={draft.date}
          onChange={(e) => setField("date", e.target.value)}
          placeholder={profile.fields[3]}
          aria-invalid={!!fieldError("date")}
          className={inputCls("h-10", fieldError("date"))}
        />
      )}
      <FieldError message={fieldError("date")} />
    </label>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Konsol Kuratorial
            </span>
            <span className="text-xs text-slate-400">
              • Diperbarui hari ini
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 sm:px-5 sm:py-3 sm:text-sm"
        >
          + Tambah Data Baru
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Data"
          value={String(items.length)}
          subtitle="Data tersimpan di server"
          icon={Grid2X2}
        />
        <StatCard
          title={firstStatus}
          value={String(
            items.filter((item) => item.status === firstStatus).length,
          )}
          subtitle={`Data berstatus ${firstStatus.toLowerCase()}`}
          icon={ShieldCheck}
        />
        <StatCard
          title={secondStatus}
          value={String(
            items.filter((item) => item.status === secondStatus).length,
          )}
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
            <p className="text-xs text-slate-400">
              Data tersimpan di server.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
            <div className="flex h-10 w-full items-center gap-2 rounded-xl bg-slate-50 px-3 sm:w-[280px]">
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  onQueryChange(e.target.value);
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
                setSortAZ((value) => !value);
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
                  {String((currentPage - 1) * pageSize + index + 1).padStart(
                    2,
                    "0",
                  )}
                </div>
                <div className="min-w-[160px] flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {[item.location, item.description]
                      .filter(Boolean)
                      .join(" · ") || "Data kuratorial Jelajah Topeng"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    [
                      "Aktif",
                      "Selesai",
                      "Dikonfirmasi",
                      "Terverifikasi",
                      "Tersedia",
                      "Terbit",
                      "Terkirim",
                    ].includes(item.status)
                      ? "bg-emerald-50 text-emerald-700"
                      : [
                            "Menunggu Review",
                            "Menunggu konfirmasi",
                            "Draft",
                            "Berlangsung",
                            "Perlu verifikasi",
                            "Perlu dilengkapi",
                          ].includes(item.status)
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status}
                </span>
                <button
                  type="button"
                  aria-label={`Lihat ${item.name}`}
                  onClick={() => setSelectedItem(item)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-emerald-700"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Edit ${item.name}`}
                  onClick={() => openEdit(item)}
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
              {matchingItems.length ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, matchingItems.length)}
            </b>{" "}
            dari <b className="text-slate-700">{matchingItems.length}</b> data
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  onClick={() => setPage(pageNumber)}
                  className={`rounded-lg border px-3 py-2 text-xs ${currentPage === pageNumber ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 text-slate-700"}`}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(value + 1, pageCount))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate("dashboard")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {(adding || selectedItem) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="data-dialog-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="data-dialog-title"
              className="text-lg font-bold text-slate-900"
            >
              {adding
                ? "Tambah Data Baru"
                : editing
                  ? "Edit Data"
                  : "Detail Data"}
            </h2>
            {adding || editing ? (
              <form action={submitForm} className="mt-4 space-y-4">
                <input type="hidden" name="kind" value={kind} />
                <input
                  type="hidden"
                  name="id"
                  value={editing ? (selectedItem?.id ?? "") : ""}
                />

                {kind === "panji" ? (
                  <>
                    <label className="block text-sm font-medium text-slate-700">
                      Nama game
                      <input
                        name="name"
                        autoFocus
                        required
                        value={draft.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="Contoh: Teka-teki Topeng Panji"
                        aria-invalid={!!fieldError("name")}
                        className={inputCls("h-11", fieldError("name"))}
                      />
                      <FieldError message={fieldError("name")} />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Rincian atau isi game
                      <textarea
                        name="description"
                        value={draft.description}
                        onChange={(e) =>
                          setField("description", e.target.value)
                        }
                        placeholder="Tuliskan cerita, pertanyaan, atau instruksi permainan"
                        rows={4}
                        aria-invalid={!!fieldError("description")}
                        className={`${inputCls("", fieldError("description"))} py-2`}
                      />
                      <FieldError message={fieldError("description")} />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Jawaban yang benar
                      <input
                        name="correctAnswer"
                        value={draft.correctAnswer}
                        onChange={(e) =>
                          setField("correctAnswer", e.target.value)
                        }
                        placeholder="Masukkan jawaban yang benar"
                        aria-invalid={!!fieldError("correctAnswer")}
                        className={inputCls("h-11", fieldError("correctAnswer"))}
                      />
                      <FieldError message={fieldError("correctAnswer")} />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Clue jika jawaban benar
                      <textarea
                        name="correctClue"
                        value={draft.correctClue}
                        onChange={(e) =>
                          setField("correctClue", e.target.value)
                        }
                        placeholder="Petunjuk yang diberikan setelah pemain menjawab benar"
                        rows={3}
                        aria-invalid={!!fieldError("correctClue")}
                        className={`${inputCls("", fieldError("correctClue"))} py-2`}
                      />
                      <FieldError message={fieldError("correctClue")} />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Gambar yang relevan
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 500 * 1024) {
                            setImageError(
                              "Ukuran gambar maksimal 500 KB. Pilih gambar yang lebih kecil.",
                            );
                            e.target.value = "";
                            return;
                          }
                          setImageError("");
                          const reader = new FileReader();
                          reader.onload = () =>
                            setField("imageUrl", String(reader.result ?? ""));
                          reader.onerror = () =>
                            setImageError(
                              "Gambar tidak dapat dibaca. Coba pilih file lain.",
                            );
                          reader.readAsDataURL(file);
                        }}
                        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <span className="mt-1 block text-xs font-normal text-slate-400">
                        Format JPG, PNG, WEBP, atau GIF. Maksimal 500 KB.
                      </span>
                    </label>
                    {/* Gambar dikirim ke server lewat input tersembunyi */}
                    <input
                      type="hidden"
                      name="imageUrl"
                      value={draft.imageUrl}
                    />
                    {imageError && (
                      <p role="alert" className="text-sm text-red-600">
                        {imageError}
                      </p>
                    )}
                    {!imageError && <FieldError message={fieldError("imageUrl")} />}
                    {draft.imageUrl && (
                      <div className="space-y-2">
                        <img
                          src={draft.imageUrl}
                          alt="Pratinjau gambar game"
                          className="max-h-52 w-full rounded-xl border border-slate-200 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setField("imageUrl", "");
                            setImageError("");
                          }}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Hapus gambar
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-slate-700">
                      {profile.fields[0]}
                      <input
                        name="name"
                        autoFocus
                        required
                        value={draft.name}
                        onChange={(e) => setField("name", e.target.value)}
                        aria-invalid={!!fieldError("name")}
                        className={inputCls("h-11", fieldError("name"))}
                      />
                      <FieldError message={fieldError("name")} />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      {profile.fields[1]}
                      <textarea
                        name="description"
                        value={draft.description}
                        onChange={(e) =>
                          setField("description", e.target.value)
                        }
                        rows={3}
                        aria-invalid={!!fieldError("description")}
                        className={`${inputCls("", fieldError("description"))} py-2`}
                      />
                      <FieldError message={fieldError("description")} />
                    </label>

                    {yearAsDate ? (
                      // Eksplorasi: Wilayah (kiri) + Tanggal/kalender (kanan)
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {locationField}
                        {dateField}
                      </div>
                    ) : (
                      <>
                        {locationField}
                        <div
                          className={extraDate ? "grid grid-cols-2 gap-3" : ""}
                        >
                          {extraDate && (
                            <label className="block text-sm font-medium text-slate-700">
                              Tanggal
                              <input
                                name="eventDate"
                                type="date"
                                value={draft.eventDate}
                                onChange={(e) =>
                                  setField("eventDate", e.target.value)
                                }
                                aria-invalid={!!fieldError("eventDate")}
                                className={inputCls(
                                  "h-10",
                                  fieldError("eventDate"),
                                )}
                              />
                              <FieldError message={fieldError("eventDate")} />
                            </label>
                          )}
                          {dateField}
                        </div>
                      </>
                    )}

                    <label className="block text-sm font-medium text-slate-700">
                      {profile.fields[4]}
                      {profile.fields[4] === "Catatan" ? (
                        <textarea
                          name="amount"
                          rows={5}
                          value={draft.amount}
                          onChange={(e) => setField("amount", e.target.value)}
                          placeholder="Tulis catatan..."
                          aria-invalid={!!fieldError("amount")}
                          className={`${inputCls("", fieldError("amount"))} resize-y py-2`}
                        />
                      ) : (
                        <input
                          name="amount"
                          value={draft.amount}
                          onChange={(e) => setField("amount", e.target.value)}
                          placeholder={profile.fields[4]}
                          aria-invalid={!!fieldError("amount")}
                          className={inputCls("h-10", fieldError("amount"))}
                        />
                      )}
                      <FieldError message={fieldError("amount")} />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Status
                      <select
                        name="status"
                        value={draft.status}
                        onChange={(e) => setField("status", e.target.value)}
                        className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600"
                      >
                        {profile.statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                      <FieldError message={fieldError("status")} />
                    </label>
                  </>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit || pending}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {pending
                      ? "Menyimpan..."
                      : editing
                        ? "Simpan Perubahan"
                        : "Simpan"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {kind === "panji" ? (
                  <div className="mt-5 space-y-4 text-sm">
                    {selectedItem?.imageUrl && (
                      <img
                        src={selectedItem.imageUrl}
                        alt={`Gambar ${selectedItem.name}`}
                        className="max-h-64 w-full rounded-xl border border-slate-200 object-cover"
                      />
                    )}
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs text-slate-400">Nama game</dt>
                        <dd className="font-semibold text-slate-800">
                          {selectedItem?.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-400">
                          Rincian atau isi game
                        </dt>
                        <dd className="whitespace-pre-wrap text-slate-700">
                          {selectedItem?.description || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-400">
                          Jawaban yang benar
                        </dt>
                        <dd className="text-slate-700">
                          {selectedItem?.correctAnswer || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-400">
                          Clue jika jawaban benar
                        </dt>
                        <dd className="whitespace-pre-wrap text-slate-700">
                          {selectedItem?.correctClue || "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <dl className="mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="text-xs text-slate-400">
                        {profile.fields[0]}
                      </dt>
                      <dd className="font-semibold text-slate-800">
                        {selectedItem?.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">
                        {profile.fields[1]}
                      </dt>
                      <dd className="text-slate-700">
                        {selectedItem?.description || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">
                        {profile.fields[2]}
                      </dt>
                      <dd className="text-slate-700">
                        {selectedItem?.location || "—"}
                      </dd>
                    </div>
                    {extraDate && (
                      <div>
                        <dt className="text-xs text-slate-400">Tanggal</dt>
                        <dd className="text-slate-700">
                          {selectedItem?.eventDate || "—"}
                        </dd>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <dt className="text-xs text-slate-400">{dateLabel}</dt>
                        <dd className="text-slate-700">
                          {selectedItem?.date || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-400">
                          {profile.fields[4]}
                        </dt>
                        <dd className="whitespace-pre-wrap text-slate-700">
                          {selectedItem?.amount || "—"}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Status</dt>
                      <dd className="text-slate-700">{selectedItem?.status}</dd>
                    </div>
                  </dl>
                )}
                <div className="mt-6 flex justify-between">
                  {selectedItem && (
                    <DeleteRecordButton
                      kind={kind}
                      id={selectedItem.id}
                      onDone={closeModal}
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      onClick={() => selectedItem && openEdit(selectedItem)}
                      className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

// =============================================================
// TOMBOL HAPUS: Server Action + .bind() (kind & id dititipkan)
// =============================================================

function DeleteRecordButton({
  kind,
  id,
  onDone,
}: {
  kind: GenericPageKind;
  id: string;
  onDone: () => void;
}) {
  const toast = useToast();
  const [state, deleteAction, pending] = useActionState(
    deleteRecord.bind(null, kind, id),
    {} as FormState,
  );

  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) {
      toast.success(state.message ?? "Data berhasil dihapus");
      onDone();
    } else {
      toast.error(state.message ?? "Gagal menghapus data.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={deleteAction}>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={15} /> {pending ? "Menghapus..." : "Hapus"}
      </button>
    </form>
  );
}

// =============================================================
// PROFILE
// =============================================================

type AdminProfile = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
};

const PROFILE_STORAGE_KEY = "jelajah-topeng:admin-profile";
const DEFAULT_PROFILE: AdminProfile = {
  firstName: "Admin",
  lastName: "Jelajah Topeng",
  title: "Administrator",
  email: "",
  phone: "",
};

function readProfile(): AdminProfile {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    return saved
      ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
      : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function ProfilePage({
  userEmail,
  userRole,
}: {
  userEmail: string;
  userRole: "admin" | "user";
}) {
  const [profile, setProfile] = useState<AdminProfile>(readProfile);
  const [message, setMessage] = useState("");

  function updateProfile(field: keyof AdminProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function saveProfile() {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setMessage("Profil tersimpan di browser ini.");
    } catch {
      setMessage(
        "Profil tidak dapat disimpan. Periksa ruang penyimpanan browser.",
      );
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Administrasi Sistem
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Profil Admin & Pengaturan Akun
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Profil tampilan disimpan di browser ini. Peran akun berasal dari
            sesi server.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setProfile(readProfile());
              setMessage("");
            }}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={saveProfile}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white">{`${profile.firstName[0] ?? "A"}${profile.lastName[0] ?? ""}`}</div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {userRole === "admin" ? "Admin" : "Pengguna"}
              </span>
            </div>
            <p className="mt-2 font-medium text-emerald-700">{profile.title}</p>
            <p className="mt-2 text-sm text-slate-400">
              {userEmail || profile.email}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <User size={19} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Informasi Identitas & Jabatan
              </h2>
              <p className="text-xs text-slate-400">
                Edit lalu pilih Simpan Perubahan
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputBox
              label="Nama Depan"
              value={profile.firstName}
              onChange={(value) => updateProfile("firstName", value)}
            />
            <InputBox
              label="Nama Belakang & Gelar"
              value={profile.lastName}
              onChange={(value) => updateProfile("lastName", value)}
            />
            <InputBox
              label="Email Kedinasan"
              value={profile.email}
              onChange={(value) => updateProfile("email", value)}
            />
            <InputBox
              label="Nomor Telepon"
              value={profile.phone}
              onChange={(value) => updateProfile("phone", value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <LockKeyhole size={19} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Keamanan & Kata Sandi
              </h2>
              <p className="text-xs text-slate-400">Sesi dikelola Auth.js</p>
            </div>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Autentikasi email dan Google membuat cookie sesi di server.
            Kredensial tidak disimpan di localStorage.
          </p>
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Sesi server aktif
          </span>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Status Autentikasi</h2>
            <p className="mt-1 text-sm text-slate-400">
              Dashboard memverifikasi sesi pada server; data ringkasan dikirim
              sebagai DTO terbatas melalui DAL.
            </p>
          </div>
          <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Auth.js · {userRole}
          </span>
        </div>
      </section>

      <form action={signOutAction}>
        <button
          type="submit"
          className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </form>
    </div>
  );
}

function InputBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white"
      />
    </div>
  );
}

export default App;