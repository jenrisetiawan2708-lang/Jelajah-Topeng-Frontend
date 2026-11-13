"use client";

import { useState } from "react";
import { LockKeyhole, LogOut, ShieldCheck, User } from "lucide-react";
import ConfirmLogout from "@/components/ConfirmLogout";

type AdminProfile = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
};

const PROFILE_STORAGE_KEY = "jelajah-topeng:admin-profile";
const DEFAULT_PROFILE: AdminProfile = {
  firstName: "Admin",
  lastName: "Jelajah Topeng",
  title: "Administrator",
  email: "",
  phone: "",
};

function readProfile(): AdminProfile {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
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

export default function ProfileView({
  userEmail,
  userRole,
}: {
  userEmail: string;
  userRole: "admin" | "user";
}) {
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
      setMessage("Profil tidak dapat disimpan. Periksa ruang penyimpanan browser.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Administrasi Sistem
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Profil Admin & Pengaturan Akun
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Profil tampilan disimpan di browser ini. Peran akun berasal dari sesi server.
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
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white">{`${profile.firstName[0] ?? "A"}${profile.lastName[0] ?? ""}`}</div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {userRole === "admin" ? "Admin" : "Pengguna"}
              </span>
            </div>
            <p className="mt-2 font-medium text-emerald-700">{profile.title}</p>
            <p className="mt-2 text-sm text-slate-400">{userEmail || profile.email}</p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <User size={19} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Informasi Identitas & Jabatan</h2>
              <p className="text-xs text-slate-400">Edit lalu pilih Simpan Perubahan</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputBox label="Nama Depan" value={profile.firstName} onChange={(v) => updateProfile("firstName", v)} />
            <InputBox label="Nama Belakang & Gelar" value={profile.lastName} onChange={(v) => updateProfile("lastName", v)} />
            <InputBox label="Email Kedinasan" value={profile.email} onChange={(v) => updateProfile("email", v)} />
            <InputBox label="Nomor Telepon" value={profile.phone} onChange={(v) => updateProfile("phone", v)} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <LockKeyhole size={19} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Keamanan & Kata Sandi</h2>
              <p className="text-xs text-slate-400">Sesi dikelola Auth.js</p>
            </div>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            Autentikasi email dan Google membuat cookie sesi di server. Kredensial tidak
            disimpan di localStorage.
          </p>
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Sesi server aktif
          </span>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Status Autentikasi</h2>
            <p className="mt-1 text-sm text-slate-400">
              Dashboard memverifikasi sesi pada server; data ringkasan dikirim sebagai DTO
              terbatas melalui DAL.
            </p>
          </div>
          <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Auth.js · {userRole}
          </span>
        </div>
      </section>

      <div>
        <ConfirmLogout className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
          <LogOut size={17} />
          Keluar
        </ConfirmLogout>
      </div>
    </div>
  );
}
