import { Suspense } from "react";
import RefundPage from "@/components/RefundPage";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { requireAdmin } from "@/lib/dal";
import { getAllRefunds } from "@/lib/page-data";

async function RefundContent() {
  const user = await requireAdmin();
  const refunds = await getAllRefunds(user.id);
  return <RefundPage refunds={refunds} />;
}

export default function ManajemenRefundPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RefundContent />
    </Suspense>
  );
}
