import AppShell from "@/components/AppShell";
import AdminActionButton from "@/components/AdminActionButton";
import { getDashboardSummaryDTO, verifySession } from "@/lib/dal";

export default async function DashboardPage() {
  const [user, summary] = await Promise.all([
    verifySession(),
    getDashboardSummaryDTO(),
  ]);

  return (
    <>
      <AppShell dashboardSummary={summary} userEmail={user.email} userRole={user.role} />
      <div className="mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-8">
        <AdminActionButton />
      </div>
    </>
  );
}
