import { useState, type ReactNode } from 'react'
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Ticket,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react'

export type Page =
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

interface DashboardProps {
  page: Page
  onNavigate: (page: Page) => void
}

const pageTitles: Record<Page, string> = {
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

function Dashboard({ page, onNavigate }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-900">

      {/* ==================================================
          SIDEBAR
      ================================================== */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-gray-200 bg-white transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* BRAND */}
        <div className="flex h-[82px] items-center border-b border-gray-200 px-5">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
              JT
            </div>

            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">
                Jelajah Topeng
              </p>

              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Admin Panel Kuratorial
              </p>
            </div>
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-5">

          {/* UTAMA */}
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
            Utama
          </p>

          <div className="space-y-1">
            <SidebarItem
              active={page === 'dashboard'}
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              onClick={() => onNavigate('dashboard')}
            />

            <SidebarItem
              active={page === 'exploration'}
              icon={<Map size={18} />}
              label="Eksplorasi Kampung"
              onClick={() => onNavigate('exploration')}
            />

            <SidebarItem
              active={page === 'panji'}
              icon={<BookOpen size={18} />}
              label="Jejak Sang Panji"
              onClick={() => onNavigate('panji')}
            />

            <SidebarItem
              active={page === 'materi'}
              icon={<FileText size={18} />}
              label="Materi & Maestro"
              onClick={() => onNavigate('materi')}
            />

            <SidebarItem
              active={page === 'booking'}
              icon={<CalendarDays size={18} />}
              label="Jadwal & Booking"
              onClick={() => onNavigate('booking')}
            />

            <SidebarItem
              active={page === 'progres'}
              icon={<TrendingUp size={18} />}
              label="Progres Budaya"
              onClick={() => onNavigate('progres')}
            />
          </div>

          {/* KOMERSIAL */}
          <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
            Komersial & Operasional
          </p>

          <div className="space-y-1">
            <SidebarItem
              active={page === 'ticketing'}
              icon={<Ticket size={18} />}
              label="Paket & Ticketing"
              onClick={() => onNavigate('ticketing')}
            />

            <SidebarItem
              active={page === 'payment'}
              icon={<CreditCard size={18} />}
              label="Pembayaran & Transaksi"
              onClick={() => onNavigate('payment')}
            />

            <SidebarItem
              active={page === 'notification'}
              icon={<Bell size={18} />}
              label="Kelola Notifikasi"
              onClick={() => onNavigate('notification')}
            />

            <SidebarItem
              active={page === 'faq'}
              icon={<CircleHelp size={18} />}
              label="FAQ & Pusat Bantuan"
              onClick={() => onNavigate('faq')}
            />
          </div>

          {/* ADMINISTRASI */}
          <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
            Administrasi Sistem
          </p>

          <div className="space-y-1">
            <SidebarItem
              active={page === 'users'}
              icon={<Users size={18} />}
              label="Akun Pengguna"
              onClick={() => onNavigate('users')}
            />

            <SidebarItem
              active={page === 'profile'}
              icon={<User size={18} />}
              label="Profil Admin"
              onClick={() => onNavigate('profile')}
            />
          </div>
        </div>

        {/* ADMIN PROFILE */}
        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              RA
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-800">
                Raden Arya, S.Sn
              </p>

              <p className="truncate text-[10px] text-gray-400">
                Super Admin Panji
              </p>
            </div>

            <Settings size={16} className="text-gray-400" />
          </button>
        </div>
      </aside>

      {/* ==================================================
          MAIN AREA
      ================================================== */}
      <div
        className={`min-h-screen transition-all duration-200 ${
          sidebarOpen ? 'ml-[270px]' : 'ml-0'
        }`}
      >

        {/* ==================================================
            TOPBAR
        ================================================== */}
        <header className="sticky top-0 z-40 flex h-[72px] items-center border-b border-gray-200 bg-white px-6">

          {/* SIDEBAR TOGGLE */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            title="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>

          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="text-gray-400 transition hover:text-emerald-600"
            >
              Jelajah Topeng
            </button>

            <ChevronRight
              size={14}
              className="text-gray-300"
            />

            <span className="font-semibold text-gray-700">
              {pageTitles[page]}
            </span>
          </div>

          {/* TOPBAR RIGHT */}
          <div className="ml-auto flex items-center gap-2">

            {/* SEARCH */}
            <button
              type="button"
              onClick={() =>
                alert('Fitur pencarian akan dibuat selanjutnya.')
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              title="Pencarian"
            >
              <Search size={18} />
            </button>

            {/* SYSTEM ONLINE */}
            <button
              type="button"
              onClick={() =>
                alert('Sistem Jelajah Topeng sedang online.')
              }
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:bg-gray-50 md:flex"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sistem Online
            </button>

            {/* NOTIFICATION */}
            <button
              type="button"
              onClick={() => onNavigate('notification')}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              title="Notifikasi"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>

            {/* PROFILE */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="ml-1 flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                RA
              </div>

              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold text-gray-800">
                  Raden Arya
                </p>

                <p className="text-[10px] text-gray-400">
                  Super Admin
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}
        <main className="p-6 lg:p-8">

          {page === 'dashboard' ? (
            <DashboardHome onNavigate={onNavigate} />
          ) : (
            <PlaceholderPage
              page={page}
              onNavigate={onNavigate}
            />
          )}

        </main>
      </div>
    </div>
  )
}

/* ==========================================================
   SIDEBAR ITEM
========================================================== */

interface SidebarItemProps {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}

function SidebarItem({
  active,
  icon,
  label,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span
        className={
          active
            ? 'text-emerald-600'
            : 'text-gray-400 transition group-hover:text-gray-600'
        }
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  )
}

/* ==========================================================
   DASHBOARD HOME
========================================================== */

function DashboardHome({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  return (
    <div className="mx-auto max-w-[1500px]">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}
      <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Dashboard Kuratorial
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Selamat Datang, Raden Arya! 
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Pantau aktivitas dan pengelolaan Jelajah Topeng hari ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={() =>
              alert('Fitur unduh laporan akan dibuat selanjutnya.')
            }
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <FileText size={16} />

            Unduh Laporan PDF
          </button>

          <button
            type="button"
            onClick={() => onNavigate('booking')}
            className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <CalendarDays size={16} />

            Buat Reservasi Baru
          </button>
        </div>
      </div>

      {/* ==================================================
          PERIOD
      ================================================== */}
      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
        <CalendarDays size={15} />

        30 Hari Terakhir
      </div>

      {/* ==================================================
          KPI CARDS
      ================================================== */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          title="Total Kunjungan"
          value="24.580"
          change="+14.2%"
          description="dari periode sebelumnya"
          icon={<Users size={19} />}
        />

        <KpiCard
          title="Tiket Terverifikasi"
          value="1.824"
          change="+8.5%"
          description="dari periode sebelumnya"
          icon={<ShieldCheck size={19} />}
        />

        <KpiCard
          title="Sesi Maestro Aktif"
          value="42"
          change="5"
          description="perlu konfirmasi"
          icon={<BookOpen size={19} />}
        />

        <KpiCard
          title="Pendapatan Budaya"
          value="Rp148,6 Juta"
          change="+18.4%"
          description="dari periode sebelumnya"
          icon={<TrendingUp size={19} />}
        />
      </div>

      {/* ==================================================
          CONTENT GRID
      ================================================== */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

        {/* TRANSACTION */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">

          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Transaksi Reservasi & Workshop Budaya
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Ringkasan aktivitas transaksi dalam 30 hari terakhir
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('payment')}
              className="shrink-0 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua
            </button>
          </div>

          {/* CHART PLACEHOLDER */}
          <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-300 shadow-sm">
                <TrendingUp size={22} />
              </div>

              <p className="text-sm font-semibold text-gray-500">
                Grafik Transaksi
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Visualisasi data transaksi akan ditambahkan
              </p>
            </div>
          </div>

          {/* MINI STATS */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50">

            <div className="p-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                856
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                Reservasi
              </p>
            </div>

            <div className="p-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                624
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                Workshop
              </p>
            </div>

            <div className="p-4 text-center">
              <p className="text-lg font-bold text-gray-900">
                344
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                Lainnya
              </p>
            </div>

          </div>
        </section>

        {/* MASTERCLASS */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Masterclass Hari Ini
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Sesi maestro yang berlangsung hari ini
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('materi')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Semua
            </button>
          </div>

          <div className="space-y-3">

            <MasterclassItem
              title="Seni Topeng Malangan"
              time="10.00 – 12.00 WIB"
              status="Berlangsung"
              onClick={() => onNavigate('materi')}
            />

            <MasterclassItem
              title="Workshop Pembuatan Topeng"
              time="14.00 – 16.00 WIB"
              status="Terjadwal"
              onClick={() => onNavigate('materi')}
            />

            <MasterclassItem
              title="Jejak Sang Panji"
              time="16.30 – 18.00 WIB"
              status="Terjadwal"
              onClick={() => onNavigate('panji')}
            />

          </div>
        </section>
      </div>

      {/* ==================================================
          FAVORITE SENTRA
      ================================================== */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">

        <div className="mb-6 flex items-start justify-between">

          <div>
            <h2 className="text-base font-bold text-gray-900">
              Statistik Sentra Favorit
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Sentra budaya dengan jumlah kunjungan tertinggi
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('exploration')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Eksplorasi Semua
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">

          <FavoriteItem
            number="01"
            title="Kampung Topeng Malangan"
            visitors="8.420 kunjungan"
            onClick={() => onNavigate('exploration')}
          />

          <FavoriteItem
            number="02"
            title="Sentra Kerajinan Topeng Kayu Bobung"
            visitors="6.840 kunjungan"
            onClick={() => onNavigate('exploration')}
          />

          <FavoriteItem
            number="03"
            title="Sanggar Seni Topeng Cirebon"
            visitors="5.210 kunjungan"
            onClick={() => onNavigate('exploration')}
          />

        </div>
      </section>
    </div>
  )
}

/* ==========================================================
   KPI CARD
========================================================== */

interface KpiCardProps {
  title: string
  value: string
  change: string
  description: string
  icon: ReactNode
}

function KpiCard({
  title,
  value,
  change,
  description,
  icon,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">

      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
        {value}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span
          className={
            change.startsWith('+')
              ? 'font-semibold text-emerald-600'
              : 'font-semibold text-amber-600'
          }
        >
          {change}
        </span>

        <span className="text-gray-400">
          {description}
        </span>
      </div>
    </div>
  )
}

/* ==========================================================
   MASTERCLASS ITEM
========================================================== */

interface MasterclassItemProps {
  title: string
  time: string
  status: string
  onClick: () => void
}

function MasterclassItem({
  title,
  time,
  status,
  onClick,
}: MasterclassItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 p-3 text-left transition hover:border-emerald-100 hover:bg-emerald-50/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <BookOpen size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {title}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {time}
        </p>
      </div>

      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">
        {status}
      </span>

      <ChevronRight
        size={15}
        className="shrink-0 text-gray-300 transition group-hover:text-emerald-500"
      />
    </button>
  )
}

/* ==========================================================
   FAVORITE ITEM
========================================================== */

interface FavoriteItemProps {
  number: string
  title: string
  visitors: string
  onClick: () => void
}

function FavoriteItem({
  number,
  title,
  visitors,
  onClick,
}: FavoriteItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border border-gray-100 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-xs font-bold text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600">
        {number}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {visitors}
        </p>
      </div>

      <ChevronRight
        size={16}
        className="shrink-0 text-gray-300 group-hover:text-emerald-500"
      />
    </button>
  )
}

/* ==========================================================
   PLACEHOLDER PAGE
========================================================== */

function PlaceholderPage({
  page,
  onNavigate,
}: {
  page: Page
  onNavigate: (page: Page) => void
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-130px)] max-w-[900px] items-center justify-center">

      <div className="w-full rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <LayoutDashboard size={25} />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Jelajah Topeng
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {pageTitles[page]}
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
          Halaman ini sudah terhubung dengan sistem navigasi
          Dashboard. Konten lengkap halaman ini akan kita bangun
          sesuai wireframe berikutnya.
        </p>

        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Home size={16} />

          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )
}

export default Dashboard