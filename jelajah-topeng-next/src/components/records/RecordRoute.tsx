import { Suspense } from "react";
import { requireAdmin } from "@/lib/dal";
import { getAllRecords } from "@/lib/page-data";
import { MENU_BY_ID } from "@/lib/menu";
import type { RecordKind } from "@/lib/content-config";
import RecordPage from "@/components/records/RecordPage";
import PageSkeleton from "@/components/ui/PageSkeleton";

type Props = {
  kind: RecordKind;
  searchParams: Promise<{ q?: string }>;
};

// Bagian yang mengambil data (sesi + BE) dibungkus Suspense sendiri,
// jadi rangka halaman tampil langsung dan isinya menyusul.
async function RecordContent({ kind, searchParams }: Props) {
  const [user, { q }] = await Promise.all([requireAdmin(), searchParams]);
  const records = await getAllRecords(user.id);
  const menu = MENU_BY_ID[kind];

  return (
    <RecordPage
      key={q ?? ""}
      kind={kind}
      title={menu.title}
      description={menu.description}
      records={records[kind]}
      initialQuery={q ?? ""}
    />
  );
}

export default function RecordRoute(props: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RecordContent {...props} />
    </Suspense>
  );
}
