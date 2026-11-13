"use client";

import ConfirmLogout from "@/components/ConfirmLogout";

export default function AccessDenied({ email }: { email: string }) {
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
          Akun {email} sudah terautentikasi, tetapi tidak memiliki peran admin.
          Data dashboard tidak dikirim ke akun ini.
        </p>
        <div className="mt-6">
          <ConfirmLogout className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Keluar
          </ConfirmLogout>
        </div>
      </section>
    </main>
  );
}
