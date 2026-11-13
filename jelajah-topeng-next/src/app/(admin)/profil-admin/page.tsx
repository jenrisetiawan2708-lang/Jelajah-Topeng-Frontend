import { Suspense } from "react";
import ProfileView from "@/components/profile/ProfileView";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { verifySession } from "@/lib/dal";

async function ProfileContent() {
  const user = await verifySession();
  return <ProfileView userEmail={user.email} userRole={user.role} />;
}

export default function ProfilAdminPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
