import { useState } from "react";
import Login from "./components/Login";
import { LOCAL_ADMIN_KEY, LOCAL_SESSION_KEY } from "./lib/localAuth";
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
  Pencil,
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
} from "lucide-react";

import logo from "./assets/logo-jelajah-topeng.png";

type Page =
  | "login"
  | "dashboard"
  | "exploration"
  | "panji"
  | "materi"
  | "booking"
  | "progres"
  | "ticketing"
  | "payment"
  | "notification"
  | "faq"
  | "users"
  | "profile";

function App() {
  const [globalQuery, setGlobalQuery] = useState("");
  const [page, setPage] = useState<Page>(() => {
    try {
      return localStorage.getItem(LOCAL_SESSION_KEY) ||
        sessionStorage.getItem(LOCAL_SESSION_KEY)
        ? "dashboard"
        : "login";
    } catch {
      return "login";
    }
  });

  const navigate = (target: Page) => {
    if (target === "login") {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      sessionStorage.removeItem(LOCAL_SESSION_KEY);
      setPage("login");
      return;
    }

    setPage(target);
  };

  // =========================================================
  // LOGIN
  // =========================================================

  if (page === "login") {
    return <Login onLogin={() => setPage("dashboard")} />;
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
    login: "Login",
    dashboard: "Dashboard",
    exploration: "Eksplorasi Kampung",
    panji: "Jejak Sang Panji",
    materi: "Belajar dengan Maestro",
    booking: "Jadwal & Booking",
    progres: "Progres Budaya",
    ticketing: "Ticketing Online",
    payment: "Pembayaran & Transaksi",
    notification: "Kelola Notifikasi",
    faq: "FAQ & Pusat Bantuan",
    users: "Profil Pengguna",
    profile: "Profil Admin",
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <div className="flex min-h-screen">
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="fixed left-0 top-0 z-30 flex h-screen w-[255px] flex-col border-r border-slate-200 bg-white">
          {/* BRAND */}
          <div className="flex h-[100px] items-center border-b border-slate-100 px-6">
            <div className="flex items-center gap-3">
              <img
                src={logo}
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
                Raden Arya, S.Sn
              </p>

              <p className="text-[11px] text-slate-400">Super Admin Panji</p>
            </div>

            <ShieldCheck size={17} className="text-emerald-700" />
          </button>
        </aside>

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        <div className="ml-[255px] flex min-h-screen flex-1 flex-col">
          {/* =================================================
              TOPBAR
          ================================================= */}
          <header className="sticky top-0 z-20 flex h-[78px] items-center border-b border-slate-200 bg-white px-8">
            {/* LEFT - NAMA APLIKASI */}
            <div className="flex items-center">
              <span className="text-sm font-semibold text-slate-700">
                Jelajah Topeng
              </span>
            </div>

            {/* RIGHT SIDE */}
            <div className="ml-auto flex items-center gap-5">
              {/* SEARCH */}
              <div className="flex h-10 w-[330px] items-center gap-2 rounded-xl bg-slate-50 px-3">
                <Search size={17} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari maestro, reservasi, data..."
                  value={globalQuery}
                  onChange={(event) => setGlobalQuery(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              {/* SYSTEM STATUS */}
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 lg:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Sistem Online
              </div>

              {/* NOTIFICATION */}
              <button
                type="button"
                onClick={() => navigate("notification")}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700"
                title="Notifikasi"
              >
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {/* SETTINGS */}
              <button
                type="button"
                onClick={() => navigate("profile")}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700"
                title="Pengaturan Profil"
              >
                <Settings size={20} />
              </button>

              <div className="h-7 w-px bg-slate-200" />

              {/* LOGOUT - MENGGANTIKAN PROFIL RADEN ARYA */}
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(LOCAL_ADMIN_KEY);
                  localStorage.removeItem(LOCAL_SESSION_KEY);
                  sessionStorage.removeItem(LOCAL_SESSION_KEY);
                  navigate("login");
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* =================================================
              BREADCRUMB - DI BAWAH NAVBAR
          ================================================= */}
          <div className="border-b border-slate-200 bg-white px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => navigate("dashboard")}
                className="font-medium text-slate-500 transition hover:text-emerald-700"
              >
                Jelajah Topeng
              </button>

              <ChevronRight size={15} className="text-slate-300" />

              <span className="font-semibold text-slate-800">
                {pageNames[page]}
              </span>
            </div>
          </div>

          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="flex-1 p-8">
            {page === "dashboard" && <Dashboard navigate={navigate} query={globalQuery} />}

            {page === "exploration" && (
              <GenericPage
                kind="exploration"
                title="Eksplorasi Kampung"
                description="Jelajahi peta interaktif, detail titik lokasi, sejarah kampung, tokoh, tradisi, dan dokumentasi budaya."
                icon={Compass}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "panji" && (
              <GenericPage
                kind="panji"
                title="Jejak Sang Panji"
                description="Ikuti pemberhentian cerita Panji, kumpulkan clue, buka galeri budaya, lalu raih reward."
                icon={Landmark}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "materi" && (
              <GenericPage
                kind="materi"
                title="Belajar dengan Maestro"
                description="Temukan profil maestro, materi bertahap, detail video/artikel/PDF, progres modul, dan jadwal sesi."
                icon={BookOpen}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "booking" && (
              <GenericPage
                kind="booking"
                title="Kalender Jadwal & Booking"
                description="Pilih sesi maestro di kalender, kirim formulir konfirmasi, dan lihat riwayat booking."
                icon={CalendarDays}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "progres" && (
              <GenericPage
                kind="progres"
                title="Progres Budaya"
                description="Pantau misi dan modul yang selesai, koleksi lencana, sertifikat, serta riwayat aktivitas."
                icon={TrendingUp}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "ticketing" && (
              <GenericPage
                kind="ticketing"
                title="Ticketing Online"
                description="Pilih paket kunjungan, jumlah peserta, tanggal, isi data pemesan, lalu lanjut checkout."
                icon={Ticket}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "payment" && (
              <GenericPage
                kind="payment"
                title="Checkout & Pembayaran"
                description="Tinjau ringkasan checkout, status pembayaran, e-ticket/QR code, dan riwayat pembelian."
                icon={CreditCard}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "notification" && (
              <GenericPage
                kind="notification"
                title="Notifikasi"
                description="Lihat pengingat jadwal, status booking, pembaruan misi, dan informasi perjalanan budaya."
                icon={Bell}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "faq" && (
              <GenericPage
                kind="faq"
                title="Bantuan / FAQ"
                description="Temukan panduan akun, eksplorasi, booking maestro, tiket, checkout, dan pembayaran."
                icon={CircleHelp}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "users" && (
              <GenericPage
                kind="users"
                title="Profil Pengguna"
                description="Kelola informasi profil pengguna yang dipakai untuk konfirmasi booking dan pembelian tiket."
                icon={Users}
                navigate={navigate}
                query={globalQuery}
                onQueryChange={setGlobalQuery}
              />
            )}

            {page === "profile" && <ProfilePage navigate={navigate} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// DASHBOARD
// =============================================================

function Dashboard({ navigate, query }: { navigate: (page: Page) => void; query: string }) {
  const [period, setPeriod] = useState("30 Hari Terakhir");
  const [showPeriods, setShowPeriods] = useState(false);
  const transactions = [
    { id: "#TRX-2024-889", name: "SMA Taruna Nusantara", location: "Kampung Topeng Malang", amount: "Rp3.600.000", status: "Terverifikasi" },
    { id: "#TRX-2024-890", name: "Dr. Helena Meyer", location: "Sanggar Cirebon Slangit", amount: "Rp850.000", status: "Menunggu" },
    { id: "#TRX-2024-882", name: "Komunitas Tari Sekar", location: "Sentra Topeng Kayu Bobung", amount: "Rp2.450.000", status: "Terverifikasi" },
    { id: "#TRX-2024-891", name: "Bpk. Bambang Sutrisno", location: "Padepokan Klaten Panji", amount: "Rp600.000", status: "Terverifikasi" },
  ];
  const visibleTransactions = transactions.filter((item) =>
    `${item.id} ${item.name} ${item.location} ${item.amount} ${item.status}`
      .toLowerCase().includes(query.trim().toLowerCase()),
  );
  const masterclasses = [
    { time: "09:00", title: "Pahat Karakter Wajah Panji", maestro: "Ki Suwito", place: "Kampung Topeng Malang" },
    { time: "13:00", title: "Sungging Alami Pigmen Getah", maestro: "Mbah Rasimun", place: "Padepokan Klaten Panji" },
    { time: "15:30", title: "Koreografi Tari Panji", maestro: "Dra. Endang", place: "Sanggar Cirebon" },
  ].filter((item) =>
    `${item.title} ${item.maestro} ${item.place}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-700">
            Dashboard Kuratorial
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Selamat Datang, Raden Arya!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Pantau aktivitas Jelajah Topeng dalam satu dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              type="button"
              aria-expanded={showPeriods}
              onClick={() => setShowPeriods((open) => !open)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
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
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
          >
            + Buat Reservasi Baru
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          title="Total Kunjungan"
          value="24.580"
          subtitle="+14.2% dari bulan lalu"
          icon={Users}
          onClick={() => navigate("exploration")}
        />

        <StatCard
          title="Tiket Terverifikasi"
          value="1.824"
          subtitle="+8.5% dari bulan lalu"
          icon={Ticket}
          onClick={() => navigate("ticketing")}
        />

        <StatCard
          title="Sesi Maestro Aktif"
          value="42"
          subtitle="5 perlu konfirmasi"
          icon={CalendarDays}
          onClick={() => navigate("booking")}
        />

        <StatCard
          title="Pendapatan Budaya"
          value="Rp148,6 Juta"
          subtitle="+18.4% dari bulan lalu"
          icon={WalletCards}
          onClick={() => navigate("payment")}
        />
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid grid-cols-[1.6fr_1fr] gap-6">
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
            {visibleTransactions.length ? visibleTransactions.map((item) => (
              <TransactionRow key={item.id} {...item} onClick={() => navigate("payment")} />
            )) : <p className="p-6 text-sm text-slate-500">Tidak ada transaksi yang cocok dengan pencarian.</p>}
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
            {masterclasses.length ? masterclasses.map((item) => (
              <Masterclass key={item.time} {...item} onClick={() => navigate("booking")} />
            )) : <p className="text-sm text-slate-500">Tidak ada jadwal yang cocok dengan pencarian.</p>}
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
              Berdasarkan aktivitas pengunjung
            </p>
          </div>

          <button
            onClick={() => navigate("exploration")}
            className="text-xs font-semibold text-emerald-700"
          >
            Kelola Sentra
          </button>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <FavoriteCard
            number="01"
            name="Kampung Topeng Malang"
            visits="8.420 kunjungan"
            onClick={() => navigate("exploration")}
          />

          <FavoriteCard
            number="02"
            name="Sanggar Cirebon Slangit"
            visits="6.280 kunjungan"
            onClick={() => navigate("exploration")}
          />

          <FavoriteCard
            number="03"
            name="Padepokan Klaten Panji"
            visits="5.120 kunjungan"
            onClick={() => navigate("exploration")}
          />

          <FavoriteCard
            number="04"
            name="Sentra Kayu Bobung"
            visits="4.760 kunjungan"
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
  icon: any;
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
        {value}
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
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50">
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
  return (
    <button type="button" onClick={onClick} className="flex w-full gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:bg-slate-50">
      <div className="flex w-14 flex-col items-center justify-center rounded-xl bg-emerald-50">
        <span className="text-xs font-bold text-emerald-700">{time}</span>
        <span className="mt-1 text-[9px] text-slate-400">WIB</span>
      </div>

      <div>
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
    <button type="button" onClick={onClick} className="w-full rounded-xl border border-slate-100 p-4 text-left transition hover:bg-slate-50">
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
// GENERIC PAGE
// =============================================================

type DataRecord = {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  amount: string;
  status: string;
  createdAt: string;
};

type DataDraft = Omit<DataRecord, "id" | "createdAt">;

const EMPTY_DRAFT: DataDraft = {
  name: "",
  description: "",
  location: "",
  date: "",
  amount: "",
  status: "Aktif",
};

type GenericPageKind = Exclude<Page, "login" | "dashboard" | "profile">;

type ContentProfile = {
  fields: [string, string, string, string, string];
  statuses: string[];
  records: DataDraft[];
};

// Labels and starter records follow the visitor journeys in the IA. The
// existing page layout stays the same; only the meaning of its fields changes.
const CONTENT_PROFILES: Record<GenericPageKind, ContentProfile> = {
  exploration: {
    fields: ["Nama kampung / titik lokasi", "Sejarah, tokoh, atau tradisi", "Alamat / wilayah", "Tahun berdiri / waktu kunjungan", "Jumlah kunjungan"],
    statuses: ["Aktif", "Perlu verifikasi", "Nonaktif"],
    records: [
      { name: "Kampung Topeng Malang", description: "Sejarah topeng Malangan, tokoh perajin, tradisi, dan dokumentasi kampung.", location: "Kedungmonggo, Pakisaji, Malang", date: "1930", amount: "8420", status: "Aktif" },
      { name: "Sanggar Cirebon Slangit", description: "Sejarah tari topeng Cirebon dan profil maestro setempat.", location: "Slangit, Cirebon", date: "2000", amount: "6280", status: "Aktif" },
      { name: "Sentra Topeng Kayu Bobung", description: "Dokumentasi pembuatan topeng kayu dan tradisi kerajinan.", location: "Bobung, Gunungkidul", date: "1970", amount: "4760", status: "Aktif" },
    ],
  },
  panji: {
    fields: ["Nama pemberhentian", "Clue / cerita yang ditemukan", "Lokasi pemberhentian", "Urutan pemberhentian", "Poin reward"],
    statuses: ["Terkunci", "Belum dikunjungi", "Selesai"],
    records: [
      { name: "Makam Mbah Reni", description: "Temukan petunjuk tentang asal-usul topeng Panji di titik ini.", location: "Kampung Topeng Malang", date: "1", amount: "50", status: "Belum dikunjungi" },
      { name: "Sanggar Topeng", description: "Kenali proses pembuatan topeng dan kumpulkan clue berikutnya.", location: "Kampung Topeng Malang", date: "2", amount: "75", status: "Terkunci" },
      { name: "Galeri Topeng", description: "Amati koleksi topeng untuk membuka rangkaian petunjuk.", location: "Kampung Topeng Malang", date: "3", amount: "100", status: "Terkunci" },
      { name: "Situs Ken Dedes", description: "Selesaikan cerita Panji dan buka reward perjalanan.", location: "Malang", date: "4", amount: "150", status: "Terkunci" },
    ],
  },
  materi: {
    fields: ["Judul materi / sesi", "Ringkasan materi", "Nama maestro / sanggar", "Tanggal sesi / urutan materi", "Durasi (menit)"],
    statuses: ["Aktif", "Draft", "Penuh"],
    records: [
      { name: "Pahat Karakter Wajah Panji", description: "Materi bertahap membentuk karakter topeng dari kayu.", location: "Ki Suwito · Kampung Topeng Malang", date: "Materi 1", amount: "90", status: "Aktif" },
      { name: "Sungging Alami Pigmen Getah", description: "Video dan artikel teknik pewarnaan tradisional.", location: "Mbah Rasimun · Padepokan Klaten Panji", date: "Materi 2", amount: "60", status: "Aktif" },
      { name: "Koreografi Tari Panji", description: "Panduan gerak tari dalam format video dan PDF.", location: "Dra. Endang · Sanggar Cirebon", date: "Materi 3", amount: "75", status: "Aktif" },
    ],
  },
  booking: {
    fields: ["Nama sesi / pemesan", "Catatan konfirmasi", "Maestro / lokasi", "Tanggal dan jam sesi", "Jumlah peserta"],
    statuses: ["Menunggu konfirmasi", "Dikonfirmasi", "Penuh", "Selesai"],
    records: [
      { name: "Pahat Karakter Wajah Panji", description: "Booking sesi langsung dengan maestro.", location: "Ki Suwito · Kampung Topeng Malang", date: "09:00 WIB", amount: "12 peserta", status: "Dikonfirmasi" },
      { name: "Sungging Alami Pigmen Getah", description: "Menunggu konfirmasi jadwal dari maestro.", location: "Mbah Rasimun · Padepokan Klaten Panji", date: "13:00 WIB", amount: "8 peserta", status: "Menunggu konfirmasi" },
      { name: "Koreografi Tari Panji", description: "Sesi pengenalan gerak tari topeng.", location: "Dra. Endang · Sanggar Cirebon", date: "15:30 WIB", amount: "10 peserta", status: "Dikonfirmasi" },
    ],
  },
  progres: {
    fields: ["Nama misi / modul", "Target dan ringkasan capaian", "Nama peserta / kelompok", "Tanggal aktivitas", "Poin / capaian"],
    statuses: ["Belum mulai", "Berlangsung", "Selesai"],
    records: [
      { name: "Selesaikan materi dasar topeng", description: "Tuntaskan seluruh materi bertahap untuk mendapat lencana.", location: "Pengunjung Jelajah Topeng", date: "Minggu ini", amount: "2 dari 4 materi", status: "Berlangsung" },
      { name: "Kumpulkan clue Jejak Sang Panji", description: "Selesaikan pemberhentian untuk membuka reward.", location: "Peserta Jejak Panji", date: "Minggu ini", amount: "0 dari 5 clue", status: "Belum mulai" },
      { name: "Ikuti sesi bersama maestro", description: "Riwayat keikutsertaan sesi budaya.", location: "Komunitas Tari Sekar", date: "Bulan ini", amount: "100 poin", status: "Selesai" },
    ],
  },
  ticketing: {
    fields: ["Nama paket kunjungan", "Detail paket dan fasilitas", "Kampung / lokasi tujuan", "Tanggal kunjungan", "Harga per paket (Rp)"],
    statuses: ["Tersedia", "Habis", "Draft"],
    records: [
      { name: "Tur Kampung Topeng", description: "Tur kampung, galeri topeng, dan pengenalan sejarah.", location: "Kampung Topeng Malang", date: "Pilih saat pesan", amount: "150000", status: "Tersedia" },
      { name: "Workshop Pembuatan Topeng", description: "Kunjungan dan praktik bersama perajin lokal.", location: "Sentra Topeng Kayu Bobung", date: "Pilih saat pesan", amount: "250000", status: "Tersedia" },
      { name: "Paket Jelajah Sanggar", description: "Kunjungan sanggar dan pertunjukan budaya.", location: "Sanggar Cirebon Slangit", date: "Pilih saat pesan", amount: "200000", status: "Tersedia" },
    ],
  },
  payment: {
    fields: ["Kode / nama pemesan", "Rincian tiket dan pembayaran", "Paket / lokasi tujuan", "Tanggal transaksi", "Total pembayaran (Rp)"],
    statuses: ["Menunggu pembayaran", "Terverifikasi", "Gagal"],
    records: [
      { name: "TRX-2026-001 · SMA Taruna Nusantara", description: "Checkout Tur Kampung Topeng · 24 peserta.", location: "Kampung Topeng Malang", date: "5 Oktober 2026", amount: "3600000", status: "Terverifikasi" },
      { name: "TRX-2026-002 · Dr. Helena Meyer", description: "Checkout Workshop Pembuatan Topeng · 2 peserta.", location: "Sentra Topeng Kayu Bobung", date: "5 Oktober 2026", amount: "500000", status: "Menunggu pembayaran" },
    ],
  },
  notification: {
    fields: ["Judul notifikasi", "Isi pemberitahuan", "Penerima / fitur", "Jadwal kirim", "Jumlah penerima"],
    statuses: ["Draft", "Terjadwal", "Terkirim"],
    records: [
      { name: "Pengingat jadwal maestro", description: "Sesi Pahat Karakter Wajah Panji dimulai pukul 09:00 WIB.", location: "Peserta booking", date: "Hari ini · 08:00 WIB", amount: "12 pengguna", status: "Terkirim" },
      { name: "Booking berhasil dikonfirmasi", description: "Simpan detail jadwal dan tunjukkan konfirmasi saat hadir.", location: "Pemesan sesi maestro", date: "Saat status berubah", amount: "8 pengguna", status: "Terjadwal" },
      { name: "Misi baru tersedia", description: "Jelajahi pemberhentian berikutnya untuk mengumpulkan clue.", location: "Peserta Jejak Sang Panji", date: "Belum dijadwalkan", amount: "Semua peserta", status: "Draft" },
    ],
  },
  faq: {
    fields: ["Pertanyaan", "Jawaban / panduan", "Kategori bantuan", "Tanggal pembaruan", "Kata kunci"],
    statuses: ["Terbit", "Draft", "Perlu diperbarui"],
    records: [
      { name: "Bagaimana cara memesan tiket kunjungan?", description: "Pilih paket, tentukan jumlah peserta dan tanggal, isi data pemesan, lalu lanjutkan checkout.", location: "Ticketing Online", date: "5 Oktober 2026", amount: "tiket, booking", status: "Terbit" },
      { name: "Bagaimana cara booking sesi maestro?", description: "Pilih sesi yang tersedia di kalender, isi formulir konfirmasi, lalu cek riwayat booking.", location: "Belajar dengan Maestro", date: "5 Oktober 2026", amount: "maestro, jadwal", status: "Terbit" },
      { name: "Di mana e-ticket dan QR code saya?", description: "E-ticket tersedia pada riwayat pembelian setelah pembayaran terverifikasi.", location: "Pembayaran", date: "5 Oktober 2026", amount: "e-ticket, QR", status: "Terbit" },
    ],
  },
  users: {
    fields: ["Nama pengguna", "Informasi profil", "Email pengguna", "Tanggal bergabung", "Kontak"],
    statuses: ["Aktif", "Perlu dilengkapi", "Nonaktif"],
    records: [
      { name: "Raden Arya", description: "Profil pengunjung Jelajah Topeng.", location: "raden.arya@example.com", date: "5 Oktober 2026", amount: "+62 812-3456-7890", status: "Aktif" },
      { name: "Komunitas Tari Sekar", description: "Profil kelompok untuk booking dan pembelian tiket.", location: "sekar@example.com", date: "5 Oktober 2026", amount: "-", status: "Perlu dilengkapi" },
    ],
  },
};

function GenericPage({
  kind,
  title,
  description,
  icon: Icon,
  navigate,
  query,
  onQueryChange,
}: {
  kind: GenericPageKind;
  title: string;
  description: string;
  icon: any;
  navigate: (page: Page) => void;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const profile = CONTENT_PROFILES[kind];
  const storageKey = `jelajah-topeng:content:${kind}`;
  const [items, setItems] = useState<DataRecord[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) {
        return parsed.flatMap((item, index): DataRecord[] => {
          if (typeof item === "string") {
            return [{
              id: `legacy-${index}-${item}`,
              name: item,
              description: "Data kuratorial Jelajah Topeng",
              location: "",
              date: "",
              amount: "",
              status: "Aktif",
              createdAt: new Date(0).toISOString(),
            }];
          }
          if (item && typeof item === "object" && "name" in item && typeof item.name === "string") {
            const record = item as Partial<DataRecord>;
            return [{
              id: record.id ?? `saved-${index}-${record.name}`,
              name: item.name,
              description: record.description ?? "",
              location: record.location ?? "",
              date: record.date ?? "",
              amount: record.amount ?? "",
              status: record.status ?? "Aktif",
              createdAt: record.createdAt ?? new Date(0).toISOString(),
            }];
          }
          return [];
        });
      }
      return profile.records.map((record, index) => ({
        ...record,
        id: `seed-${kind}-${index}`,
        createdAt: new Date(0).toISOString(),
      }));
    } catch {
      return [];
    }
  });
  const [sortAZ, setSortAZ] = useState(false);
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DataDraft>(EMPTY_DRAFT);
  const [selectedItem, setSelectedItem] = useState<DataRecord | null>(null);
  const [message, setMessage] = useState("");
  const pageSize = 3;
  const matchingItems = items
    .filter((item) => `${item.name} ${item.description} ${item.location} ${item.status}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sortAZ
      ? a.name.localeCompare(b.name, "id")
      : b.createdAt.localeCompare(a.createdAt));
  const pageCount = Math.max(1, Math.ceil(matchingItems.length / pageSize));
  const firstStatus = profile.statuses[0];
  const secondStatus = profile.statuses[1] ?? profile.statuses[0];
  // createdAt diperbarui setiap kali data ditambah atau diedit.
  // Data lama/seed memakai epoch (1970), jadi tidak dianggap sebagai pembaruan.
  const latestUpdate = items.reduce<string | undefined>((latest, item) => {
    const timestamp = Date.parse(item.createdAt);
    if (timestamp <= 0) return latest;
    return !latest || timestamp > Date.parse(latest)
      ? item.createdAt
      : latest;
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

  function saveItems(nextItems: DataRecord[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextItems));
      setItems(nextItems);
      setMessage("Data tersimpan di browser ini.");
    } catch {
      setMessage(
        "Data tidak dapat disimpan. Periksa ruang penyimpanan browser.",
      );
    }
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    if (items.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== selectedItem?.id)) {
      setMessage("Data dengan nama tersebut sudah ada.");
      return;
    }
    const now = new Date().toISOString();
    const record: DataRecord = {
      ...draft,
      name,
      description: draft.description.trim(),
      location: draft.location.trim(),
      amount: draft.amount.trim(),
      id: selectedItem?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: now,
    };
    saveItems(adding ? [...items, record] : items.map((item) => item.id === record.id ? record : item));
    setAdding(false);
    setEditing(false);
    setSelectedItem(null);
    setDraft(EMPTY_DRAFT);
    setPage(1);
  }

  function openEdit(item: DataRecord) {
    setSelectedItem(item);
    setDraft({
      name: item.name,
      description: item.description,
      location: item.location,
      date: item.date,
      amount: item.amount,
      status: item.status,
    });
    setAdding(false);
    setEditing(true);
  }

  function deleteSelected() {
    if (!selectedItem) return;
    saveItems(items.filter((item) => item.id !== selectedItem.id));
    setSelectedItem(null);
    setEditing(false);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Konsol Kuratorial
            </span>
            <span className="text-xs text-slate-400">
              • Diperbarui hari ini
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setSelectedItem(null);
            setEditing(false);
            setDraft(EMPTY_DRAFT);
            setAdding(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + Tambah Data Baru
        </button>
      </div>

      {message && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-5">
        <StatCard
          title="Total Data"
          value={String(items.length)}
          subtitle="Data tersimpan di browser"
          icon={Grid2X2}
        />
        <StatCard
          title={firstStatus}
          value={String(items.filter((item) => item.status === firstStatus).length)}
          subtitle={`Data berstatus ${firstStatus.toLowerCase()}`}
          icon={ShieldCheck}
        />
        <StatCard
          title={secondStatus}
          value={String(items.filter((item) => item.status === secondStatus).length)}
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
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon size={19} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Data {title}</h2>
            <p className="text-xs text-slate-400">
              Data tersimpan di browser ini.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex h-10 w-[280px] items-center gap-2 rounded-xl bg-slate-50 px-3">
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
              <div key={item.id} className="flex items-center gap-4 px-6 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                  {String((currentPage - 1) * pageSize + index + 1).padStart(
                    2,
                    "0",
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {[item.location, item.description].filter(Boolean).join(" · ") || "Data kuratorial Jelajah Topeng"}
                  </p>
                </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${["Aktif", "Selesai", "Dikonfirmasi", "Terverifikasi", "Tersedia", "Terbit", "Terkirim"].includes(item.status) ? "bg-emerald-50 text-emerald-700" : ["Menunggu Review", "Menunggu konfirmasi", "Draft", "Berlangsung", "Perlu verifikasi", "Perlu dilengkapi"].includes(item.status) ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
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

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">
            Menampilkan{" "}
            <b className="text-slate-700">
              {matchingItems.length ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, matchingItems.length)}
            </b>{" "}
            dari <b className="text-slate-700">{matchingItems.length}</b> data
          </p>
          <div className="flex gap-2">
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
            if (e.target === e.currentTarget) {
              setAdding(false);
              setEditing(false);
              setSelectedItem(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="data-dialog-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="data-dialog-title"
              className="text-lg font-bold text-slate-900"
            >
              {adding ? "Tambah Data Baru" : editing ? "Edit Data" : "Detail Data"}
            </h2>
            {adding || editing ? (
              <form onSubmit={handleSave} className="mt-4 space-y-3">
                <label
                  htmlFor="new-data"
                  className="block text-sm font-medium text-slate-700"
                >
                  {profile.fields[0]}
                </label>
                <input
                  id="new-data"
                  autoFocus
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600"
                />
                <label className="block text-sm font-medium text-slate-700">
                  {profile.fields[1]}
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  {profile.fields[2]}
                  <input
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-700">
                    {profile.fields[3]}
                    <input
                      type="text"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                      placeholder={profile.fields[3]}
                      className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    {profile.fields[4]}
                    <input
                      value={draft.amount}
                      onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                      placeholder={profile.fields[4]}
                      className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600"
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Status
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                    className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600"
                  >
                    {profile.statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setAdding(false); setEditing(false); setSelectedItem(null); }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!draft.name.trim()}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {editing ? "Simpan Perubahan" : "Simpan"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <dl className="mt-5 space-y-3 text-sm">
                  <div><dt className="text-xs text-slate-400">{profile.fields[0]}</dt><dd className="font-semibold text-slate-800">{selectedItem?.name}</dd></div>
                  <div><dt className="text-xs text-slate-400">{profile.fields[1]}</dt><dd className="text-slate-700">{selectedItem?.description || "—"}</dd></div>
                  <div><dt className="text-xs text-slate-400">{profile.fields[2]}</dt><dd className="text-slate-700">{selectedItem?.location || "—"}</dd></div>
                  <div className="grid grid-cols-2 gap-3"><div><dt className="text-xs text-slate-400">{profile.fields[3]}</dt><dd className="text-slate-700">{selectedItem?.date || "—"}</dd></div><div><dt className="text-xs text-slate-400">{profile.fields[4]}</dt><dd className="text-slate-700">{selectedItem?.amount || "—"}</dd></div></div>
                  <div><dt className="text-xs text-slate-400">Status</dt><dd className="text-slate-700">{selectedItem?.status}</dd></div>
                </dl>
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} /> Hapus
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                    >Tutup</button>
                    <button
                      type="button"
                      onClick={() => selectedItem && openEdit(selectedItem)}
                      className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                    ><Pencil size={14} /> Edit</button>
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
  firstName: "Raden",
  lastName: "Arya, S.Sn",
  title: "Super Admin & Kepala Kurator Pelestarian Seni Tari Panji",
  email: "raden.arya@jelajahtopeng.id",
  phone: "+62 812-3456-7890",
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

function ProfilePage({ navigate }: { navigate: (page: Page) => void }) {
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

  function resetLocalCredentials() {
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    localStorage.removeItem(LOCAL_SESSION_KEY);
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
    navigate("login");
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Administrasi Sistem
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Profil Admin & Pengaturan Akun
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Perubahan profil disimpan di browser ini.
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
        <div className="flex items-center gap-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white">{`${profile.firstName[0] ?? "A"}${profile.lastName[0] ?? ""}`}</div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Admin
              </span>
            </div>
            <p className="mt-2 font-medium text-emerald-700">{profile.title}</p>
            <p className="mt-2 text-sm text-slate-400">{profile.email}</p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-6">
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
          <div className="grid grid-cols-2 gap-4">
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
              <p className="text-xs text-slate-400">
                Akun demo lokal
              </p>
            </div>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Reset akan menghapus kredensial lokal dan meminta kamu membuat kata sandi baru.
          </p>
          <button
            type="button"
            onClick={resetLocalCredentials}
            className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            Atur Ulang Kredensial Lokal
          </button>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Status Autentikasi</h2>
            <p className="mt-1 text-sm text-slate-400">
              "Login demo lokal aktif di browser ini. Tidak melindungi data di website publik."
            </p>
          </div>
          <span
            className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
          >
            Demo lokal
          </span>
        </div>
      </section>

      <button
        type="button"
        onClick={() => navigate("login")}
        className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        <LogOut size={17} />
        Keluar
      </button>
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
