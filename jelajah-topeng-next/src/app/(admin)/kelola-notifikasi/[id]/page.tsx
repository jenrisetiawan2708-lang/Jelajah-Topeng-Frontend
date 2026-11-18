import RecordDetailRoute from "@/components/records/RecordDetailRoute";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <RecordDetailRoute kind="notification" params={params} />;
}