import RecordRoute from "@/components/records/RecordRoute";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return <RecordRoute kind="notification" searchParams={searchParams} />;
}
