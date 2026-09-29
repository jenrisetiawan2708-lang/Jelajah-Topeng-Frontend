import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarPlus,
  CheckCircle2,
  CircleDollarSign,
  GraduationCap,
  TicketCheck,
  Users,
} from 'lucide-react'

const statistics = [
  {
    title: 'Total Kunjungan',
    value: '24.580',
    suffix: 'Orang',
    change: '+14.2%',
    icon: Users,
  },
  {
    title: 'Tiket Terverifikasi',
    value: '1.824',
    suffix: 'Tiket',
    change: '+8.5%',
    icon: TicketCheck,
  },
  {
    title: 'Sesi Maestro Aktif',
    value: '42',
    suffix: 'Sesi',
    change: '5 perlu konfirmasi',
    icon: GraduationCap,
  },
  {
    title: 'Pendapatan Budaya',
    value: 'Rp148,6',
    suffix: 'Juta',
    change: '+18.4%',
    icon: CircleDollarSign,
  },
]

const transactions = [
  {
    id: '#JT-2841',
    name: 'Kunjungan Kampung Topeng',
    type: 'Wisata Budaya',
    date: '28 Sep 2026',
    amount: 'Rp450.000',
    status: 'Terverifikasi',
  },
  {
    id: '#JT-2840',
    name: 'Workshop Topeng Malangan',
    type: 'Workshop',
    date: '28 Sep 2026',
    amount: 'Rp750.000',
    status: 'Terverifikasi',
  },
  {
    id: '#JT-2839',
    name: 'Sesi Maestro Panji',
    type: 'Masterclass',
    date: '27 Sep 2026',
    amount: 'Rp1.200.000',
    status: 'Menunggu',
  },
  {
    id: '#JT-2838',
    name: 'Eksplorasi Kampung',
    type: 'Wisata Budaya',
    date: '27 Sep 2026',
    amount: 'Rp325.000',
    status: 'Terverifikasi',
  },
]

const masterclass = [
  {
    time: '09:00',
    title: 'Teknik Dasar Topeng Malangan',
    maestro: 'M. Soleh',
    participants: '12 Peserta',
  },
  {
    time: '13:30',
    title: 'Makna Filosofis Panji',
    maestro: 'Raden Arya',
    participants: '8 Peserta',
  },
  {
    time: '15:30',
    title: 'Membuat Topeng Tradisional',
    maestro: 'Pak Suyanto',
    participants: '15 Peserta',
  },
]

const favoriteCenters = [
  {
    name: 'Kampung Topeng Malangan',
    visits: '8.420',
    percentage: '86%',
  },
  {
    name: 'Sanggar Asmorobangun',
    visits: '6.850',
    percentage: '72%',
  },
  {
    name: 'Sentra Topeng Cirebon',
    visits: '4.920',
    percentage: '58%',
  },
  {
    name: 'Desa Wisata Topeng Mas Ubud',
    visits: '3.780',
    percentage: '44%',
  },
]

function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      {/* Header */}
      <section className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Selamat Datang, Raden Arya! 
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Berikut ringkasan aktivitas kuratorial hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            30 Hari Terakhir
          </button>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowDownToLine size={16} />
            Unduh Laporan PDF
          </button>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <CalendarPlus size={17} />
            Buat Reservasi Baru
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-4 gap-4">
        {statistics.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {item.value}
                </span>

                <span className="text-xs text-gray-400">
                  {item.suffix}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-xs">
                {item.change.startsWith('+') ? (
                  <ArrowUpRight
                    size={14}
                    className="text-emerald-600"
                  />
                ) : null}

                <span
                  className={
                    item.change.startsWith('+')
                      ? 'font-semibold text-emerald-600'
                      : 'font-medium text-amber-600'
                  }
                >
                  {item.change}
                </span>

                {item.change.startsWith('+') && (
                  <span className="text-gray-400">
                    dari periode sebelumnya
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </section>

      {/* Main Content */}
      <section className="mt-6 grid grid-cols-[1.55fr_1fr] gap-6">
        {/* Transactions */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Transaksi Reservasi & Workshop Budaya
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Aktivitas transaksi terbaru
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3 font-semibold">Transaksi</th>
                  <th className="px-3 py-3 font-semibold">Tanggal</th>
                  <th className="px-3 py-3 font-semibold">Nominal</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                          <TicketCheck size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {transaction.name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-400">
                            {transaction.id} · {transaction.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-xs text-gray-500">
                      {transaction.date}
                    </td>

                    <td className="px-3 py-4 text-sm font-semibold text-gray-700">
                      {transaction.amount}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          transaction.status === 'Terverifikasi'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Masterclass */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Masterclass Hari Ini
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Jadwal sesi maestro
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              3 Sesi
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {masterclass.map((item) => (
              <div
                key={`${item.time}-${item.title}`}
                className="flex gap-4 px-5 py-4"
              >
                <div className="w-12 pt-0.5">
                  <p className="text-xs font-bold text-emerald-600">
                    {item.time}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Maestro: {item.maestro}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    {item.participants}
                  </p>
                </div>

                <CheckCircle2
                  size={17}
                  className="mt-1 text-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Favorite Centers */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Statistik Sentra Favorit
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Sentra dengan resonansi budaya tertinggi
            </p>
          </div>

          <button
            type="button"
            className="text-xs font-semibold text-emerald-600"
          >
            Lihat Statistik
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-6">
          {favoriteCenters.map((center) => (
            <div key={center.name}>
              <div className="flex items-end justify-between gap-2">
                <p className="text-xs font-medium text-gray-600">
                  {center.name}
                </p>

                <span className="text-xs font-bold text-gray-800">
                  {center.visits}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: center.percentage }}
                />
              </div>

              <p className="mt-1 text-[10px] text-gray-400">
                kunjungan
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Dashboard