import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import { emptyRecords } from "@/lib/content-config";
import { getDashboardSummaryDTO, verifySession } from "@/lib/dal";
import { getRecordsDTO } from "@/lib/records";
import { getRefundsDTO } from "@/lib/refunds";
import type { RefundDTO } from "@/lib/refund-schema";

// Semua akses data (sesi + BE) dipindah ke sini, di dalam <Suspense>.
async function DashboardContent() {
  const [user, summary] = await Promise.all([
    verifySession(),
    getDashboardSummaryDTO(),
  ]);

  const isAdmin = user.role === "admin";

  // Query database hanya untuk admin, dan hanya data milik user.id ini.
  const [records, refunds] = await Promise.all([
    isAdmin ? getRecordsDTO(user.id) : Promise.resolve(emptyRecords()),
    isAdmin ? getRefundsDTO(user.id) : Promise.resolve([] as RefundDTO[]),
  ]);

  return (
    <AppShell
      dashboardSummary={summary}
      records={records}
      refunds={refunds}
      userEmail={user.email}
      userRole={user.role}
    />
  );
}

// Tampilan sementara selama data dimuat.
function DashboardSkeleton() {
  return (
    <div
      className="min-h-screen bg-[#f7f9fc] p-4 sm:p-6 lg:p-8"
      role="status"
      aria-label="Memuat dashboard"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-8 w-56 max-w-full rounded-lg bg-slate-200" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
        <div className="h-64 rounded-2xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}