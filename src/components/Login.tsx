"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import logo from "@/assets/logo-jelajah-topeng.png";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.8 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Email atau kata sandi tidak cocok.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Login gagal. Periksa konfigurasi autentikasi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google", { redirectTo: "/dashboard" });
    } catch {
      setError("Login Google gagal. Periksa konfigurasi OAuth.");
      setGoogleLoading(false);
    }
  }

  const busy = loading || googleLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-[82px] items-center border-b border-gray-200 bg-white px-6 sm:px-8">
        <div className="flex items-center gap-3">
          <img src={logo.src} alt="Jelajah Topeng" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <h1 className="text-sm font-bold text-gray-900">Jelajah Topeng</h1>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Admin Panel Kuratorial</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Sistem Online
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-82px)] flex-col items-center justify-center px-5 py-10 sm:px-6">
        <div className="mb-7 w-full max-w-[460px] text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <LockKeyhole size={25} />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">Portal Masuk Administrator</p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Selamat datang</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">Masuk untuk mengakses konsol kurasi Jelajah Topeng.</p>
        </div>

        <section className="w-full max-w-[460px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          {error && (
            <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email Administrator</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">Kata Sandi</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                placeholder="Masukkan kata sandi"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><LockKeyhole size={17} /> Masuk dengan email <ArrowRight size={17} /></>}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 py-1 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />atau<span className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? <Loader2 size={18} className="animate-spin" /> : <><GoogleIcon /> Masuk dengan Google</>}
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-100 pt-5 text-xs text-gray-400">
            <LockKeyhole size={13} /> Sesi autentikasi dikelola di server
          </div>
        </section>
      </main>
    </div>
  );
}
