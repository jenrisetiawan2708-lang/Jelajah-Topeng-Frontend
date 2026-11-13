"use client";

import { useState, type ReactNode } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import DateLimiter from "@/components/DateLimiter";
import type { SearchEntry } from "@/lib/search";

export default function AdminFrame({
  searchIndex,
  children,
}: {
  searchIndex: SearchEntry[];
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <DateLimiter />
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[255px]">
          <Topbar
            searchIndex={searchIndex}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
