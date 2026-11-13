"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings, ShieldCheck, X } from "lucide-react";
import ConfirmLogout from "@/components/ConfirmLogout";
import logo from "@/assets/logo-jelajah-topeng.png";
import { MENU_GROUPS, MENU_BY_ID, isActivePath } from "@/lib/menu";
import { MENU_ICONS } from "@/components/layout/menu-icons";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[255px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* BRAND */}
        <div className="flex h-[100px] items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
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
              <p className="text-[12px] text-slate-400">Admin Panel Kuratorial</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          {MENU_GROUPS.map((group, index) => (
            <div key={group.heading}>
              <p
                className={`mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 ${
                  index > 0 ? "mt-8" : ""
                }`}
              >
                {group.heading}
              </p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = MENU_ICONS[item.id];
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                        active
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                      }`}
                    >
                      <Icon size={19} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* AKUN (khusus mobile) */}
          <div className="mt-8 lg:hidden">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Akun
            </p>
            <div className="space-y-1">
              <Link
                href={MENU_BY_ID.profile.href}
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
              >
                <Settings size={19} strokeWidth={1.8} />
                <span>Pengaturan</span>
              </Link>
              <div>
                <ConfirmLogout className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50">
                  <LogOut size={19} strokeWidth={1.8} />
                  <span>Logout</span>
                </ConfirmLogout>
              </div>
            </div>
          </div>
        </div>

        {/* USER CARD */}
        <Link
          href={MENU_BY_ID.profile.href}
          onClick={onClose}
          className="mx-4 mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-left transition hover:bg-emerald-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
            RA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              Admin Jelajah Topeng
            </p>
            <p className="text-[11px] text-slate-400">Super Admin Panji</p>
          </div>
          <ShieldCheck size={17} className="text-emerald-700" />
        </Link>
      </aside>
    </>
  );
}
