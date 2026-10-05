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
  Search,
  Settings,
  ShieldCheck,
  Ticket,
  TrendingUp,
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
      label: "Materi & Maestro",
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
      label: "Paket & Ticketing",
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
      label: "Akun Pengguna",
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
    materi: "Materi & Maestro",
    booking: "Jadwal & Booking",
    progres: "Progres Budaya",
    ticketing: "Paket & Ticketing",
    payment: "Pembayaran & Transaksi",
    notification: "Kelola Notifikasi",
    faq: "FAQ & Pusat Bantuan",
    users: "Akun Pengguna",
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
            {/* BREADCRUMB */}
            <button
              onClick={() => navigate("dashboard")}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700"
            >
              Jelajah Topeng
            </button>

            <ChevronRight size={17} className="mx-2 text-slate-300" />

            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              {pageNames[page]}
            </span>

            {/* SEARCH */}
            <div className="ml-8 flex h-10 w-[330px] items-center gap-2 rounded-xl bg-slate-50 px-3">
              <Search size={17} className="text-slate-400" />

              <input
                type="text"
                placeholder="Cari maestro, reservasi, data..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="ml-auto flex items-center gap-5">
              {/* SYSTEM STATUS */}
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 lg:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Sistem Online
              </div>

              {/* NOTIFICATION */}
              <button
                onClick={() => navigate("notification")}
                className="relative text-slate-500 transition hover:text-emerald-700"
              >
                <Bell size={20} />

                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* SETTINGS */}
              <button
                onClick={() => navigate("profile")}
                className="text-slate-500 transition hover:text-emerald-700"
              >
                <Settings size={20} />
              </button>

              <div className="h-7 w-px bg-slate-200" />

              {/* PROFILE */}
              <button
                onClick={() => navigate("profile")}
                className="flex items-center gap-3 text-left"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  RA
                </div>

                <div className="hidden md:block">
                  <p className="text-xs font-bold text-slate-800">
                    Raden Arya, S.Sn
                  </p>

                  <p className="text-[10px] text-slate-400">Super Admin</p>
                </div>
              </button>
            </div>
          </header>

          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="flex-1 p-8">
            {page === "dashboard" && <Dashboard navigate={navigate} />}

            {page === "exploration" && (
              <GenericPage
                title="Direktori & Kurasi Sentra Budaya"
                description="Kelola data sentra budaya, sanggar, lokasi artefak, dan status verifikasi."
                icon={Compass}
                navigate={navigate}
              />
            )}

            {page === "panji" && (
              <GenericPage
                title="Jejak Sang Panji"
                description="Manajemen tahapan clue, rute petualangan budaya, dan distribusi reward."
                icon={Landmark}
                navigate={navigate}
              />
            )}

            {page === "materi" && (
              <GenericPage
                title="Kelola Materi & Profil Maestro"
                description="Direktori data maestro seni topeng tradisional Nusantara dan modul materi ajar kuratorial."
                icon={BookOpen}
                navigate={navigate}
              />
            )}

            {page === "booking" && (
              <GenericPage
                title="Kelola Jadwal & Booking Maestro"
                description="Pantau kalender reservasi workshop budaya, masterclass, dan kunjungan sentra."
                icon={CalendarDays}
                navigate={navigate}
              />
            )}

            {page === "progres" && (
              <GenericPage
                title="Progresan Pelestarian Budaya"
                description="Pemantauan capaian target misi, keterlibatan peserta, dan distribusi poin reward."
                icon={TrendingUp}
                navigate={navigate}
              />
            )}

            {page === "ticketing" && (
              <GenericPage
                title="Kelola Tiket & Paket Kunjungan"
                description="Manajemen kuota, harga paket edukasi sanggar, dan status publikasi tiket."
                icon={Ticket}
                navigate={navigate}
              />
            )}

            {page === "payment" && (
              <GenericPage
                title="Kelola Pembayaran & Transaksi"
                description="Log transaksi masuk, verifikasi pelunasan tiket, dan rekonsiliasi dana maestro."
                icon={CreditCard}
                navigate={navigate}
              />
            )}

            {page === "notification" && (
              <GenericPage
                title="Kelola & Siaran Notifikasi"
                description="Kirim pengumuman kurasi, pengingat jadwal masterclass, dan pemberitahuan sistem."
                icon={Bell}
                navigate={navigate}
              />
            )}

            {page === "faq" && (
              <GenericPage
                title="Kelola FAQ & Pusat Bantuan"
                description="Kelola daftar pertanyaan yang sering diajukan, panduan kurasi, dan bantuan teknis."
                icon={CircleHelp}
                navigate={navigate}
              />
            )}

            {page === "users" && (
              <GenericPage
                title="Kelola Akun Pengguna & Hak Akses"
                description="Kelola otorisasi admin, kurator sanggar, maestro, dan staf operasional."
                icon={Users}
                navigate={navigate}
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

function Dashboard({ navigate }: { navigate: (page: Page) => void }) {
  const [period, setPeriod] = useState("30 Hari Terakhir");
  const [showPeriods, setShowPeriods] = useState(false);

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
        />

        <StatCard
          title="Tiket Terverifikasi"
          value="1.824"
          subtitle="+8.5% dari bulan lalu"
          icon={Ticket}
        />

        <StatCard
          title="Sesi Maestro Aktif"
          value="42"
          subtitle="5 perlu konfirmasi"
          icon={CalendarDays}
        />

        <StatCard
          title="Pendapatan Budaya"
          value="Rp148,6 Juta"
          subtitle="+18.4% dari bulan lalu"
          icon={WalletCards}
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
            <TransactionRow
              id="#TRX-2024-889"
              name="SMA Taruna Nusantara"
              location="Kampung Topeng Malang"
              amount="Rp3.600.000"
              status="Terverifikasi"
            />

            <TransactionRow
              id="#TRX-2024-890"
              name="Dr. Helena Meyer"
              location="Sanggar Cirebon Slangit"
              amount="Rp850.000"
              status="Menunggu"
            />

            <TransactionRow
              id="#TRX-2024-882"
              name="Komunitas Tari Sekar"
              location="Sentra Topeng Kayu Bobung"
              amount="Rp2.450.000"
              status="Terverifikasi"
            />

            <TransactionRow
              id="#TRX-2024-891"
              name="Bpk. Bambang Sutrisno"
              location="Padepokan Klaten Panji"
              amount="Rp600.000"
              status="Terverifikasi"
            />
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
            <Masterclass
              time="09:00"
              title="Pahat Karakter Wajah Panji"
              maestro="Ki Suwito"
              place="Kampung Topeng Malang"
            />

            <Masterclass
              time="13:00"
              title="Sungging Alami Pigmen Getah"
              maestro="Mbah Rasimun"
              place="Padepokan Klaten Panji"
            />

            <Masterclass
              time="15:30"
              title="Koreografi Tari Panji"
              maestro="Dra. Endang"
              place="Sanggar Cirebon"
            />
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
          />

          <FavoriteCard
            number="02"
            name="Sanggar Cirebon Slangit"
            visits="6.280 kunjungan"
          />

          <FavoriteCard
            number="03"
            name="Padepokan Klaten Panji"
            visits="5.120 kunjungan"
          />

          <FavoriteCard
            number="04"
            name="Sentra Kayu Bobung"
            visits="4.760 kunjungan"
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
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
}: {
  id: string;
  name: string;
  location: string;
  amount: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-4 p-5">
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
    </div>
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
}: {
  time: string;
  title: string;
  maestro: string;
  place: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-100 p-4">
      <div className="flex w-14 flex-col items-center justify-center rounded-xl bg-emerald-50">
        <span className="text-xs font-bold text-emerald-700">{time}</span>
        <span className="mt-1 text-[9px] text-slate-400">WIB</span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

        <p className="mt-1 text-xs text-emerald-700">{maestro}</p>

        <p className="mt-1 text-xs text-slate-400">{place}</p>
      </div>
    </div>
  );
}

// =============================================================
// FAVORITE
// =============================================================

function FavoriteCard({
  number,
  name,
  visits,
}: {
  number: string;
  name: string;
  visits: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">{number}</span>

        <TrendingUp size={16} className="text-emerald-600" />
      </div>

      <h3 className="text-sm font-semibold leading-5 text-slate-800">{name}</h3>

      <p className="mt-2 text-xs text-slate-400">{visits}</p>
    </div>
  );
}

// =============================================================
// GENERIC PAGE
// =============================================================

function GenericPage({
  title,
  description,
  icon: Icon,
  navigate,
}: {
  title: string;
  description: string;
  icon: any;
  navigate: (page: Page) => void;
}) {
  const seedItems = [
    "Kampung Topeng Malang",
    "Sanggar Cirebon Slangit",
    "Padepokan Klaten Panji",
    "Sentra Topeng Kayu Bobung",
    "Komunitas Tari Sekar",
  ];
  const storageKey = `jelajah-topeng:${title}`;
  const [items, setItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) &&
        parsed.every((item) => typeof item === "string")
        ? parsed
        : seedItems;
    } catch {
      return seedItems;
    }
  });
  const [query, setQuery] = useState("");
  const [sortAZ, setSortAZ] = useState(false);
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const pageSize = 3;
  const matchingItems = items
    .filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (sortAZ ? a.localeCompare(b, "id") : 0));
  const pageCount = Math.max(1, Math.ceil(matchingItems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleItems = matchingItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function saveItems(nextItems: string[]) {
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

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = newItem.trim();
    if (!value) return;
    if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setMessage("Data dengan nama tersebut sudah ada.");
      return;
    }
    saveItems([...items, value]);
    setNewItem("");
    setAdding(false);
    setPage(Math.ceil((matchingItems.length + 1) / pageSize));
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
          title="Aktif"
          value={String(items.length)}
          subtitle="Status aktif"
          icon={ShieldCheck}
        />
        <StatCard
          title="Perlu Review"
          value="0"
          subtitle="Tidak ada antrean demo"
          icon={Eye}
        />
        <StatCard
          title="Terakhir Update"
          value="Hari Ini"
          subtitle="Data lokal"
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
              <div key={item} className="flex items-center gap-4 px-6 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                  {String((currentPage - 1) * pageSize + index + 1).padStart(
                    2,
                    "0",
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {item}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Data kuratorial Jelajah Topeng
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Aktif
                </span>
                <button
                  type="button"
                  aria-label={`Lihat ${item}`}
                  onClick={() => setSelectedItem(item)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-emerald-700"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Detail ${item}`}
                  onClick={() => setSelectedItem(item)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-emerald-700"
                >
                  <ChevronRight size={16} />
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
              {adding ? "Tambah Data Baru" : "Detail Data"}
            </h2>
            {adding ? (
              <form onSubmit={handleAdd}>
                <label
                  htmlFor="new-data"
                  className="mt-5 block text-sm font-medium text-slate-700"
                >
                  Nama data
                </label>
                <input
                  id="new-data"
                  autoFocus
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600"
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!newItem.trim()}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="mt-4 text-sm text-slate-600">{selectedItem}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Data contoh kuratorial. Data baru disimpan di browser yang
                  sedang digunakan.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Tutup
                  </button>
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
