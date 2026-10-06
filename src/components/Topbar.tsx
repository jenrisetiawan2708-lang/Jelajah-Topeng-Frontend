import {
  Bell,
  ChevronRight,
  Search,
} from "lucide-react";

function Topbar() {
  return (
    <div className="bg-white">
      {/* =========================
          NAVBAR
      ========================= */}
      <header className="flex h-[72px] items-center justify-between border-b border-gray-200 px-8">
        {/* Left Side */}
        <div className="text-sm font-medium text-gray-500">
          Jelajah Topeng
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="flex h-10 w-[260px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3">
            <Search
              size={17}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari koleksi / modul..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* System Online */}
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="font-medium text-gray-600">
              System Online
            </span>
          </div>

          {/* Notification */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <Bell
              size={19}
              strokeWidth={1.8}
            />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
              RA
            </div>

            <div className="hidden leading-tight xl:block">
              <p className="text-sm font-semibold text-gray-900">
                Raden Arya
              </p>

              <p className="text-[11px] text-gray-500">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          BREADCRUMB
      ========================= */}
      <div className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-500">
            Jelajah Topeng
          </span>

          <ChevronRight
            size={15}
            className="text-gray-400"
          />

          <span className="font-semibold text-gray-900">
            Konsol Kurasi
          </span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;