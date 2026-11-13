import { Suspense } from "react";
import DashboardView from "@/components/dashboard/DashboardView";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { requireAdmin } from "@/lib/dal";
import { getSummary } from "@/lib/page-data";

async function DashboardContent() {
  await requireAdmin();
  const summary = await getSummary();
  return <DashboardView summary={summary} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
