import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Brand */}
      <header className="flex h-[82px] items-center border-b border-gray-200 bg-white px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
            JT
          </div>

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

      {/* Login Content */}
      <main className="flex min-h-[calc(100vh-82px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px]">

          {/* Heading */}
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

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                onLogin()
              }}
            >
              {/* Email */}
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
                  placeholder="nama@jelajahtopeng.id"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Password */}
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

              {/* Remember */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                  />

                  Ingat saya di peramban ini
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Masuk ke Dashboard Kurasi
                <ArrowRight size={17} />
              </button>

              {/* Divider */}
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

          {/* Security */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
            <LockKeyhole size={13} />

            Koneksi Terenkripsi SSL 256-bit
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-[11px] text-gray-400">
            © 2026 Jelajah Topeng · Admin Panel Kuratorial
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login