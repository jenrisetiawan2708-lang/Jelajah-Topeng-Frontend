"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronRight, LogOut, Menu, Search, Settings, X } from "lucide-react";
import ConfirmLogout from "@/components/ConfirmLogout";
import { MENU_BY_ID, MENU_GROUPS } from "@/lib/menu";
import type { SearchEntry } from "@/lib/search";

type Result = {
  key: string;
  type: "menu" | "data";
  title: string;
  subtitle: string;
  href: string;
};

function findResults(rawQuery: string, index: SearchEntry[]): Result[] {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 2) return [];

  const menus: Result[] = [];
  for (const group of MENU_GROUPS) {
    const groupMatches = group.heading.toLowerCase().includes(q);
    for (const item of group.items) {
      if (
        groupMatches ||
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      ) {
        menus.push({
          key: `menu-${item.id}`,
          type: "menu",
          title: item.label,
          subtitle: group.heading,
          href: item.href,
        });
      }
    }
  }

  const data: Result[] = index
    .filter((entry) => entry.text.includes(q))
    .slice(0, 8)
    .map((entry) => ({
      key: entry.key,
      type: "data",
      title: entry.title,
      subtitle: entry.subtitle,
      href: entry.href,
    }));

  return [...menus, ...data];
}

function ResultRow({
  result,
  onSelect,
}: {
  result: Result;
  onSelect: (result: Result) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(result)}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-emerald-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{result.title}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400">{result.subtitle}</p>
      </div>
      <ChevronRight size={15} className="shrink-0 text-slate-300" />
    </button>
  );
}

export default function Topbar({
  searchIndex,
  onOpenSidebar,
}: {
  searchIndex: SearchEntry[];
  onOpenSidebar: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = findResults(query, searchIndex);
  const menuResults = results.filter((r) => r.type === "menu");
  const dataResults = results.filter((r) => r.type === "data");
  const showDropdown = open && query.trim().length >= 2;

  function select(result: Result) {
    setOpen(false);
    setQuery("");
    router.push(result.href);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-[64px] items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:h-[78px] lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={22} />
      </button>

      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4 lg:gap-5">
        {/* SEARCH GLOBAL */}
        <div
          className="relative"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}
        >
          <div className="flex h-10 w-32 min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 transition-all focus-within:w-52 focus-within:ring-2 focus-within:ring-emerald-100 sm:w-56 sm:focus-within:w-56 lg:w-[330px] lg:focus-within:w-[330px]">
            <Search size={17} className="shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Cari menu atau data..."
              value={query}
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false);
                if (event.key === "Enter" && results[0]) {
                  event.preventDefault();
                  select(results[0]);
                }
              }}
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                className="shrink-0 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {showDropdown && (
            <div
              onMouseDown={(event) => event.preventDefault()}
              className="absolute right-0 top-12 z-50 max-h-[70vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:w-[400px]"
            >
              {results.length ? (
                <>
                  {menuResults.length > 0 && (
                    <div>
                      <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Menu
                      </p>
                      {menuResults.map((r) => (
                        <ResultRow key={r.key} result={r} onSelect={select} />
                      ))}
                    </div>
                  )}
                  {dataResults.length > 0 && (
                    <div>
                      <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Data
                      </p>
                      {dataResults.map((r) => (
                        <ResultRow key={r.key} result={r} onSelect={select} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="px-3 py-4 text-sm text-slate-500">
                  Tidak ada hasil untuk “{query.trim()}”.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 lg:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Sistem Online
        </div>

        <Link
          href={MENU_BY_ID.notification.href}
          title="Notifikasi"
          className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 lg:flex"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Link>

        <Link
          href={MENU_BY_ID.profile.href}
          title="Pengaturan Profil"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 lg:flex"
        >
          <Settings size={20} />
        </Link>

        <div className="hidden h-7 w-px bg-slate-200 lg:block" />

        <div className="hidden lg:block">
          <ConfirmLogout className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600">
            <LogOut size={18} />
            <span>Logout</span>
          </ConfirmLogout>
        </div>
      </div>
    </header>
  );
}
