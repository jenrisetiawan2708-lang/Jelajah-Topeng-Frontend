import AppShell from "@/components/AppShell";
import { emptyRecords } from "@/lib/content-config";
import { getDashboardSummaryDTO, verifySession } from "@/lib/dal";
import { getRecordsDTO } from "@/lib/records";
import { getRefundsDTO } from "@/lib/refunds";
import type { RefundDTO } from "@/lib/refund-schema";

export default async function DashboardPage() {
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