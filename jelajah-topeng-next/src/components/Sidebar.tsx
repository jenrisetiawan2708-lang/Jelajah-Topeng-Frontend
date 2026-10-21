import {
  LayoutDashboard,
  Map,
  Landmark,
  BookOpen,
  CalendarDays,
  ChartNoAxesColumn,
  Ticket,
  CreditCard,
  Bell,
  CircleHelp,
  Users,
  Settings,
} from 'lucide-react'

const menuUtama = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Eksplorasi Kampung', icon: Map, active: true },
  { label: 'Jejak Sang Panji', icon: Landmark },
  { label: 'Materi & Maestro', icon: BookOpen },
  { label: 'Jadwal & Booking', icon: CalendarDays },
  { label: 'Progres Budaya', icon: ChartNoAxesColumn },
]

const menuKomersial = [
  { label: 'Paket & Ticketing', icon: Ticket },
  { label: 'Pembayaran & Transaksi', icon: CreditCard },
  { label: 'Kelola Notifikasi', icon: Bell },
  { label: 'FAQ & Pusat Bantuan', icon: CircleHelp },
]

const menuAdministrasi = [
  { label: 'Akun Pengguna', icon: Users },
  { label: 'Profil Admin', icon: Settings },
]

function Sidebar() {
  return (
    <aside className="flex h-screen w-[270px] flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
          JT
        </div>

        <div>
          <h1 className="text-base font-bold text-gray-900">
            Jelajah Topeng
          </h1>

          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Admin Panel Kuratorial
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="px-6 pt-5">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Aktif
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 overflow-y-auto px-4 pb-4">
        {/* Menu Utama */}
        <div className="space-y-1">
          {menuUtama.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  item.active
                    ? 'bg-emerald-50 font-semibold text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Komersial */}
        <div className="mt-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Komersial & Operasional
          </p>

          <div className="space-y-1">
            {menuKomersial.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Administrasi */}
        <div className="mt-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Administrasi Sistem
          </p>

          <div className="space-y-1">
            {menuAdministrasi.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Admin Profile */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
            RA
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              Raden Arya
            </p>

            <p className="truncate text-xs text-gray-500">
              Super Admin Panji
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar