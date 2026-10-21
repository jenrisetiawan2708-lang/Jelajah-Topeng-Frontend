import AppShell from "@/components/AppShell";
import { getDashboardSummaryDTO, verifySession } from "@/lib/dal";

export default async function DashboardPage() {
  const [user, summary] = await Promise.all([
    verifySession(),
    getDashboardSummaryDTO(),
  ]);

  return (
    <AppShell
      dashboardSummary={summary}
      userEmail={user.email}
      userRole={user.role}
    />
  );
}
