"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { MENU_BY_ID, MENU_ITEMS, isActivePath } from "@/lib/menu";

export default function Breadcrumb() {
  const pathname = usePathname();
  const current = MENU_ITEMS.find((item) => isActivePath(pathname, item.href));

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li className="shrink-0">
          <Link
            href={MENU_BY_ID.dashboard.href}
            className="font-medium text-slate-500 transition hover:text-emerald-700"
          >
            Jelajah Topeng
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={16} className="text-slate-400" />
        </li>
        <li aria-current="page" className="font-semibold text-slate-900">
          {current?.label ?? ""}
        </li>
      </ol>
    </nav>
  );
}
