import { useState } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Compass,
  CreditCard,
  Eye,
  EyeOff,
  Grid2X2,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Ticket,
  TrendingUp,
  User,
  UserCog,
  Users,
  WalletCards,
  X,
} from 'lucide-react'

import logo from './assets/logo-jelajah-topeng.png'

type Page =
  | 'login'
  | 'dashboard'
  | 'exploration'
  | 'panji'
  | 'materi'
  | 'booking'
  | 'progres'
  | 'ticketing'
  | 'payment'
  | 'notification'
  | 'faq'
  | 'users'
  | 'profile'

function App() {
  const [page, setPage] = useState<Page>('login')

  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = (target: Page) => {
    setPage(target)
  }

  // =========================================================
  // LOGIN
  // =========================================================

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* TOP BRAND */}
        <header className="flex h-[82px] items-center border-b border-gray-200 bg-white px-8">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo Jelajah Topeng"
              className="h-11 w-11 object-contain"
            />

            <div>
              <h1 className="text-sm font-bold text-gray-900">
                Jelajah Topeng
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Admin Panel Kuratorial
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Sistem Online
          </div>
        </header>

        {/* LOGIN CONTENT */}
        <main className="flex min-h-[calc(100vh-82px)] items-center justify-center px-6 py-12">
          <div className="w-full max-w-[460px]">
            {/* HEADING */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <LockKeyhole size={25} />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Portal Masuk Administrator
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Masuk untuk mengakses konsol kurasi Jelajah Topeng.
              </p>
            </div>

            {/* LOGIN CARD */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  navigate('dashboard')
                }}
                className="space-y-5"
              >
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Administrator
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@jelajahtopeng.id"
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Kata Sandi
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="flex items-center">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                    />

                    Ingat saya di peramban ini
                  </label>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Masuk ke Dashboard Kurasi
                  <ArrowRight size={17} />
                </button>

                {/* DIVIDER */}
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    atau
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* SSO */}
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <ShieldCheck size={17} />

                  Otentikasi Akun Belajar / SSO Institusi Mitra
                </button>
              </form>
            </div>

            {/* SECURITY */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
              <LockKeyhole size={13} />

              Koneksi Terenkripsi SSL 256-bit
            </div>

            <p className="mt-4 text-center text-[11px] text-gray-400">
              © 2026 Jelajah Topeng · Admin Panel Kuratorial
            </p>
          </div>
        </main>
      </div>
    )
  }

  // =========================================================
  // SIDEBAR
  // =========================================================

  const mainMenus = [
    {
      id: 'dashboard' as Page,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'exploration' as Page,
      label: 'Eksplorasi Kampung',
      icon: Compass,
    },
    {
      id: 'panji' as Page,
      label: 'Jejak Sang Panji',
      icon: Landmark,
    },
    {
      id: 'materi' as Page,
      label: 'Materi & Maestro',
      icon: BookOpen,
    },
    {
      id: 'booking' as Page,
      label: 'Jadwal & Booking',
      icon: CalendarDays,
    },
    {
      id: 'progres' as Page,
      label: 'Progres Budaya',
      icon: TrendingUp,
    },
  ]

  const operationalMenus = [
    {
      id: 'ticketing' as Page,
      label: 'Paket & Ticketing',
      icon: Ticket,
    },
    {
      id: 'payment' as Page,
      label: 'Pembayaran & Transaksi',
      icon: CreditCard,
    },
    {
      id: 'notification' as Page,
      label: 'Kelola Notifikasi',
      icon: Bell,
    },
    {
      id: 'faq' as Page,
      label: 'FAQ & Pusat Bantuan',
      icon: CircleHelp,
    },
  ]

  const systemMenus = [
    {
      id: 'users' as Page,
      label: 'Akun Pengguna',
      icon: Users,
    },
    {
      id: 'profile' as Page,
      label: 'Profil Admin',
      icon: UserCog,
    },
  ]

  const pageNames: Record<Page, string> = {
    login: 'Login',
    dashboard: 'Dashboard',
    exploration: 'Eksplorasi Kampung',
    panji: 'Jejak Sang Panji',
    materi: 'Materi & Maestro',
    booking: 'Jadwal & Booking',
    progres: 'Progres Budaya',
    ticketing: 'Paket & Ticketing',
    payment: 'Pembayaran & Transaksi',
    notification: 'Kelola Notifikasi',
    faq: 'FAQ & Pusat Bantuan',
    users: 'Akun Pengguna',
    profile: 'Profil Admin',
  }

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
                const Icon = item.icon
                const active = page === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      active
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Komersial & Operasional
            </p>

            <nav className="space-y-1">
              {operationalMenus.map((item) => {
                const Icon = item.icon
                const active = page === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      active
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Administrasi Sistem
            </p>

            <nav className="space-y-1">
              {systemMenus.map((item) => {
                const Icon = item.icon
                const active = page === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      active
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* USER CARD */}
          <button
            onClick={() => navigate('profile')}
            className="mx-4 mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-left transition hover:bg-emerald-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
              RA
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Raden Arya, S.Sn
              </p>

              <p className="text-[11px] text-slate-400">
                Super Admin Panji
              </p>
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
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700"
            >
              Jelajah Topeng
            </button>

            <ChevronRight
              size={17}
              className="mx-2 text-slate-300"
            />

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
                onClick={() => navigate('notification')}
                className="relative text-slate-500 transition hover:text-emerald-700"
              >
                <Bell size={20} />

                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* SETTINGS */}
              <button
                onClick={() => navigate('profile')}
                className="text-slate-500 transition hover:text-emerald-700"
              >
                <Settings size={20} />
              </button>

              <div className="h-7 w-px bg-slate-200" />

              {/* PROFILE */}
              <button
                onClick={() => navigate('profile')}
                className="flex items-center gap-3 text-left"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  RA
                </div>

                <div className="hidden md:block">
                  <p className="text-xs font-bold text-slate-800">
                    Raden Arya, S.Sn
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Super Admin
                  </p>
                </div>
              </button>
            </div>
          </header>

          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="flex-1 p-8">
            {page === 'dashboard' && <Dashboard navigate={navigate} />}

            {page === 'exploration' && (
              <GenericPage
                title="Direktori & Kurasi Sentra Budaya"
                description="Kelola data sentra budaya, sanggar, lokasi artefak, dan status verifikasi."
                icon={Compass}
                navigate={navigate}
              />
            )}

            {page === 'panji' && (
              <GenericPage
                title="Jejak Sang Panji"
                description="Manajemen tahapan clue, rute petualangan budaya, dan distribusi reward."
                icon={Landmark}
                navigate={navigate}
              />
            )}

            {page === 'materi' && (
              <GenericPage
                title="Kelola Materi & Profil Maestro"
                description="Direktori data maestro seni topeng tradisional Nusantara dan modul materi ajar kuratorial."
                icon={BookOpen}
                navigate={navigate}
              />
            )}

            {page === 'booking' && (
              <GenericPage
                title="Kelola Jadwal & Booking Maestro"
                description="Pantau kalender reservasi workshop budaya, masterclass, dan kunjungan sentra."
                icon={CalendarDays}
                navigate={navigate}
              />
            )}

            {page === 'progres' && (
              <GenericPage
                title="Progresan Pelestarian Budaya"
                description="Pemantauan capaian target misi, keterlibatan peserta, dan distribusi poin reward."
                icon={TrendingUp}
                navigate={navigate}
              />
            )}

            {page === 'ticketing' && (
              <GenericPage
                title="Kelola Tiket & Paket Kunjungan"
                description="Manajemen kuota, harga paket edukasi sanggar, dan status publikasi tiket."
                icon={Ticket}
                navigate={navigate}
              />
            )}

            {page === 'payment' && (
              <GenericPage
                title="Kelola Pembayaran & Transaksi"
                description="Log transaksi masuk, verifikasi pelunasan tiket, dan rekonsiliasi dana maestro."
                icon={CreditCard}
                navigate={navigate}
              />
            )}

            {page === 'notification' && (
              <GenericPage
                title="Kelola & Siaran Notifikasi"
                description="Kirim pengumuman kurasi, pengingat jadwal masterclass, dan pemberitahuan sistem."
                icon={Bell}
                navigate={navigate}
              />
            )}

            {page === 'faq' && (
              <GenericPage
                title="Kelola FAQ & Pusat Bantuan"
                description="Kelola daftar pertanyaan yang sering diajukan, panduan kurasi, dan bantuan teknis."
                icon={CircleHelp}
                navigate={navigate}
              />
            )}

            {page === 'users' && (
              <GenericPage
                title="Kelola Akun Pengguna & Hak Akses"
                description="Kelola otorisasi admin, kurator sanggar, maestro, dan staf operasional."
                icon={Users}
                navigate={navigate}
              />
            )}

            {page === 'profile' && (
              <ProfilePage navigate={navigate} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// =============================================================
// DASHBOARD
// =============================================================

function Dashboard({
  navigate,
}: {
  navigate: (page: Page) => void
}) {
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
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
            30 Hari Terakhir
          </button>

          <button
            onClick={() => navigate('booking')}
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
              onClick={() => navigate('payment')}
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

              <p className="mt-1 text-xs text-slate-400">
                Jadwal sesi budaya
              </p>
            </div>

            <button
              onClick={() => navigate('booking')}
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
            onClick={() => navigate('exploration')}
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
  )
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
  title: string
  value: string
  subtitle: string
  icon: any
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

      <p className="mt-2 text-xs font-medium text-emerald-600">
        {subtitle}
      </p>
    </div>
  )
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
  id: string
  name: string
  location: string
  amount: string
  status: string
}) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <CreditCard size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-emerald-700">{id}</p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {name}
        </p>

        <p className="text-xs text-slate-400">{location}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-slate-800">{amount}</p>

        <span
          className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
            status === 'Terverifikasi'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  )
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
  time: string
  title: string
  maestro: string
  place: string
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-100 p-4">
      <div className="flex w-14 flex-col items-center justify-center rounded-xl bg-emerald-50">
        <span className="text-xs font-bold text-emerald-700">{time}</span>
        <span className="mt-1 text-[9px] text-slate-400">WIB</span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-emerald-700">{maestro}</p>

        <p className="mt-1 text-xs text-slate-400">{place}</p>
      </div>
    </div>
  )
}

// =============================================================
// FAVORITE
// =============================================================

function FavoriteCard({
  number,
  name,
  visits,
}: {
  number: string
  name: string
  visits: string
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">
          {number}
        </span>

        <TrendingUp size={16} className="text-emerald-600" />
      </div>

      <h3 className="text-sm font-semibold leading-5 text-slate-800">
        {name}
      </h3>

      <p className="mt-2 text-xs text-slate-400">{visits}</p>
    </div>
  )
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
  title: string
  description: string
  icon: any
  navigate: (page: Page) => void
}) {
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

        <button className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
          + Tambah Data Baru
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          title="Total Data"
          value="24"
          subtitle="Data terdaftar"
          icon={Grid2X2}
        />

        <StatCard
          title="Aktif"
          value="18"
          subtitle="Status aktif"
          icon={ShieldCheck}
        />

        <StatCard
          title="Perlu Review"
          value="4"
          subtitle="Menunggu kurasi"
          icon={Eye}
        />

        <StatCard
          title="Terakhir Update"
          value="Hari Ini"
          subtitle="Sistem sinkron"
          icon={TrendingUp}
        />
      </div>

      {/* CONTENT */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon size={19} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Data {title}
            </h2>

            <p className="text-xs text-slate-400">
              Daftar data yang dikelola oleh administrator.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex h-10 w-[280px] items-center gap-2 rounded-xl bg-slate-50 px-3">
              <Search size={16} className="text-slate-400" />

              <input
                placeholder="Cari data..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
              Filter
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            'Kampung Topeng Malang',
            'Sanggar Cirebon Slangit',
            'Padepokan Klaten Panji',
            'Sentra Topeng Kayu Bobung',
            'Komunitas Tari Sekar',
          ].map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-4 px-6 py-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                0{index + 1}
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

              <button className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-emerald-700">
                <Eye size={16} />
              </button>

              <button className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-emerald-700">
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">
            Menampilkan <b className="text-slate-700">1–5</b> dari{' '}
            <b className="text-slate-700">24</b> data
          </p>

          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
              1
            </button>

            <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
              2
            </button>

            <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
              3
            </button>

            <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK NAVIGATION */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate('dashboard')}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          ← Kembali ke Dashboard
        </button>
      </div>
    </div>
  )
}

// =============================================================
// PROFILE
// =============================================================

function ProfilePage({
  navigate,
}: {
  navigate: (page: Page) => void
}) {
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
            Kelola informasi identitas kurator dan keamanan akun.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
            Batal
          </button>

          <button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* PROFILE HEADER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white">
            RA
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Raden Arya, S.Sn
              </h2>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Akun Terverifikasi
              </span>
            </div>

            <p className="mt-2 font-medium text-emerald-700">
              Super Admin & Kepala Kurator Pelestarian Seni Tari Panji
            </p>

            <p className="mt-2 text-sm text-slate-400">
              r.arya@jelajahtopeng.id • Yogyakarta & Malang
            </p>
          </div>
        </div>
      </section>

      {/* PROFILE GRID */}
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
                Data akun administrator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputBox label="Nama Depan" value="Raden" />

            <InputBox
              label="Nama Belakang & Gelar"
              value="Arya, S.Sn"
            />

            <InputBox
              label="Email Kedinasan"
              value="raden.arya@jelajahtopeng.id"
            />

            <InputBox
              label="Nomor Telepon"
              value="+62 812-3456-7890"
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
                Kelola keamanan akun
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InputBox
              label="Kata Sandi Lama"
              value="••••••••••"
            />

            <InputBox
              label="Kata Sandi Baru"
              value="••••••••••"
            />

            <button className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
              Perbarui Kata Sandi
            </button>
          </div>
        </section>
      </div>

      {/* SECURITY */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Keamanan Akun
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Autentikasi dua faktor aktif dan sesi akun terlindungi.
            </p>
          </div>

          <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            2FA Aktif
          </span>
        </div>
      </section>

      <button
        onClick={() => navigate('login')}
        className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        <LogOut size={17} />
        Keluar
      </button>
    </div>
  )
}

// =============================================================
// INPUT BOX
// =============================================================

function InputBox({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none"
      />
    </div>
  )
}

export default App