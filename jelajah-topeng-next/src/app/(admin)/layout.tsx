import { Suspense, type ReactNode } from "react";
import ToastProvider from "@/components/ToastProvider";
import AccessDenied from "@/components/layout/AccessDenied";
import AdminFrame from "@/components/layout/AdminFrame";
import { verifySession } from "@/lib/dal";
import { emptyRecords } from "@/lib/content-config";
import { getAllRecords, getSummary } from "@/lib/page-data";
import { buildSearchIndex } from "@/lib/search";

// Cek sesi + ambil data untuk pencarian. Dibungkus Suspense karena memakai data runtime.
async function AdminShell({ children }: { children: ReactNode }) {
  const user = await verifySession();

  if (user.role !== "admin") {
    return <AccessDenied email={user.email} />;
  }

  const [summary, records] = await Promise.all([
    getSummary(),
    getAllRecords(user.id).catch(() => emptyRecords()),
  ]);

  return (
    <AdminFrame searchIndex={buildSearchIndex(records, summary)}>
      {children}
    </AdminFrame>
  );
}

function ShellSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="fixed left-0 top-0 hidden h-screen w-[255px] border-r border-slate-200 bg-white lg:block" />
      <div className="lg:ml-[255px]">
        <div className="h-[64px] border-b border-slate-200 bg-white lg:h-[78px]" />
        <div className="space-y-4 p-4 sm:p-6 lg:p-8">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Suspense fallback={<ShellSkeleton />}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </ToastProvider>
  );
}
