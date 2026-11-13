import PaymentPanel from "@/components/PaymentPanel";
import RecordRoute from "@/components/records/RecordRoute";

export default function PembayaranPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="space-y-8">
      <PaymentPanel />
      <RecordRoute kind="payment" searchParams={searchParams} />
    </div>
  );
}
