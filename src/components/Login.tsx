import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  hashLocalPassword,
  LOCAL_ADMIN_KEY,
  LOCAL_SESSION_KEY,
} from "../lib/localAuth";
import logo from "../assets/logo-jelajah-topeng.png";

type GoogleTokenResponse = { access_token?: string; error?: string };
type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};
type GoogleIdentityApi = {
  accounts: {
    oauth2: {
      initTokenClient: (options: {
        client_id: string;
        scope: string;
        callback: (response: GoogleTokenResponse) => void;
        error_callback?: () => void;
      }) => GoogleTokenClient;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

let googleIdentityScript: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts.oauth2) return Promise.resolve();
  if (!googleIdentityScript) {
    googleIdentityScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Google sign-in library failed to load"));
      document.head.appendChild(script);
    });
  }
  return googleIdentityScript;
}

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

interface LoginProps {
  onLogin: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PASSWORD_RULES = [
  {
    id: "len",
    label: "Minimal 8 karakter",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "upper",
    label: "Ada huruf besar (A-Z)",
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    id: "lower",
    label: "Ada huruf kecil (a-z)",
    test: (v: string) => /[a-z]/.test(v),
  },
  { id: "num", label: "Ada angka (0-9)", test: (v: string) => /\d/.test(v) },
];

function validateEmail(value: string) {
  if (!value.trim()) return "Email wajib diisi.";
  if (!EMAIL_REGEX.test(value.trim())) return "Format email tidak valid.";
  return "";
}

function validatePassword(value: string) {
  if (!value) return "Kata sandi wajib diisi.";
  if (!PASSWORD_RULES.every((r) => r.test(value)))
    return "Kata sandi belum memenuhi persyaratan.";
  return "";
}

type LocalAdmin = { email: string; passwordHash: string };

function readLocalAdmins(): LocalAdmin[] {
  try {
    const value = localStorage.getItem(LOCAL_ADMIN_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (entry): entry is LocalAdmin =>
          typeof entry?.email === "string" &&
          typeof entry?.passwordHash === "string",
      );
    }
    if (
      typeof parsed === "object" && parsed !== null &&
      "email" in parsed && typeof parsed.email === "string" &&
      "passwordHash" in parsed && typeof parsed.passwordHash === "string"
    ) {
      return [{ email: parsed.email, passwordHash: parsed.passwordHash }];
    }
  } catch {
    return [];
  }
  return [];
}

function Login({ onLogin }: LoginProps) {
  const [hasLocalAdmin, setHasLocalAdmin] = useState(() => readLocalAdmins().length > 0);
  const [isRegistering, setIsRegistering] = useState(() => readLocalAdmins().length === 0);
  const [email, setEmail] = useState(() => readLocalAdmins()[0]?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [formError, setFormError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const showEmailError = touched.email && emailError;
  const showPasswordError = touched.password && passwordError;
  const busy = loading || googleLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setInfo("");
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const accounts = readLocalAdmins();
      if (isRegistering) {
        if (accounts.some((account) => account.email === normalizedEmail)) {
          setFormError("Email ini sudah terdaftar. Silakan masuk dengan kata sandinya.");
          return;
        }
        if (password !== confirmPassword) {
          setFormError("Konfirmasi kata sandi belum sama.");
          return;
        }
        const passwordHash = await hashLocalPassword(password);
        localStorage.setItem(
          LOCAL_ADMIN_KEY,
          JSON.stringify([...accounts, { email: normalizedEmail, passwordHash }]),
        );
        setHasLocalAdmin(true);
        setIsRegistering(false);
        setPassword("");
        setConfirmPassword("");
        setInfo("Akun lokal dibuat. Sekarang masuk memakai kata sandi tadi.");
        return;
      }

      const account = accounts.find((entry) => entry.email === normalizedEmail);
      if (!account) {
        setIsRegistering(true);
        setConfirmPassword(password);
        setInfo(`Email ${normalizedEmail} belum terdaftar. Tekan "Buat Akun Admin Lokal" untuk mendaftarkannya.`);
        return;
      }
      const passwordHash = await hashLocalPassword(password);
      if (passwordHash !== account.passwordHash) {
        setFormError("Kata sandi salah untuk email ini.");
        return;
      }

      (remember ? localStorage : sessionStorage).setItem(
        LOCAL_SESSION_KEY,
        "signed-in",
      );
      onLogin();
    } catch {
      setFormError("Penyimpanan browser tidak tersedia. Coba browser lain.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setFormError("");
    setInfo("");
    const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "").trim();
    if (!clientId) {
      setFormError("Google OAuth Client ID belum diatur di .env.");
      return;
    }

    setGoogleLoading(true);
    try {
      await loadGoogleIdentityScript();
      const google = window.google;
      if (!google) throw new Error("Google sign-in library unavailable");

      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (token) => {
          try {
            if (!token.access_token) {
              setFormError("Login Google dibatalkan atau tidak berhasil.");
              return;
            }
            const response = await fetch(
              "https://openidconnect.googleapis.com/v1/userinfo",
              { headers: { Authorization: `Bearer ${token.access_token}` } },
            );
            if (!response.ok) throw new Error("Google profile request failed");
            const profile = (await response.json()) as {
              email?: string;
              email_verified?: boolean;
            };
            if (!profile.email || profile.email_verified !== true) {
              setFormError("Google tidak mengembalikan email terverifikasi.");
              return;
            }
            (remember ? localStorage : sessionStorage).setItem(
              LOCAL_SESSION_KEY,
              "signed-in",
            );
            onLogin();
          } catch {
            setFormError("Login Google gagal. Periksa konfigurasi OAuth dan koneksi.");
          } finally {
            setGoogleLoading(false);
          }
        },
        error_callback: () => {
          setGoogleLoading(false);
          setFormError("Popup Google tidak dapat dibuka. Izinkan popup lalu coba lagi.");
        },
      });
      client.requestAccessToken({ prompt: "select_account" });
    } catch {
      setGoogleLoading(false);
      setFormError("Google Sign-In gagal dimuat. Periksa koneksi internet.");
    }
  }

  function handleForgot() {
    setFormError("");
    if (!window.confirm("Hapus semua akun demo lokal dari browser ini?")) return;
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    localStorage.removeItem(LOCAL_SESSION_KEY);
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
    setHasLocalAdmin(false);
    setIsRegistering(true);
    setPassword("");
    setConfirmPassword("");
    setInfo("Akun demo direset. Buat kata sandi lokal yang baru.");
  }

  const inputBase =
    "h-11 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2";
  const inputOk =
    "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100";
  const inputBad = "border-red-300 focus:border-red-500 focus:ring-red-100";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Brand */}
      <header className="flex h-[82px] items-center border-b border-gray-200 bg-white px-8">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Jelajah Topeng"
            className="h-10 w-10 rounded-xl object-cover"
          />

          <div>
            <h1 className="text-sm font-bold text-gray-900">Jelajah Topeng</h1>
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
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700"
                >
                  {formError}
                </div>
              )}
              {info && (
                <div
                  role="status"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700"
                >
                  {info}
                </div>
              )}

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
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!showEmailError}
                  placeholder="nama@email.com"
                  className={`${inputBase} ${showEmailError ? inputBad : inputOk}`}
                />
                {showEmailError && (
                  <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
                )}
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

                  {hasLocalAdmin && !isRegistering && (
                    <button
                      type="button"
                      onClick={handleForgot}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Reset semua akun
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegistering ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    aria-invalid={!!showPasswordError}
                    placeholder={isRegistering ? "Buat kata sandi admin" : "Masukkan kata sandi"}
                    className={`${inputBase} pr-11 ${showPasswordError ? inputBad : inputOk}`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {(password.length > 0 || touched.password) && (
                  <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
                    {PASSWORD_RULES.map((rule) => {
                      const ok = rule.test(password);
                      return (
                        <li
                          key={rule.id}
                          className={`flex items-center gap-1.5 text-xs ${
                            ok ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {ok ? <Check size={13} /> : <X size={13} />}
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {isRegistering && (
                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-gray-700">
                    Ulangi Kata Sandi
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className={inputBase + " " + inputOk}
                  />
                </div>
              )}

              {/* Remember */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                  />
                  Ingat saya di peramban ini
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={busy}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Memeriksa akun...
                  </>
                ) : (
                  <>
                    {isRegistering ? "Buat Akun Admin Lokal" : "Masuk ke Dashboard Kurasi"}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  atau
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={busy}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Masuk dengan Google
              </button>

              {hasLocalAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    const next = !isRegistering;
                    setIsRegistering(next);
                    setEmail(next ? "" : (readLocalAdmins()[0]?.email ?? ""));
                    setPassword("");
                    setConfirmPassword("");
                    setFormError("");
                    setInfo("");
                  }}
                  className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {isRegistering ? "Kembali ke login" : "Daftar akun lain"}
                </button>
              )}

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
  );
}

export default Login;
