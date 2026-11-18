import PaymentPanel from "@/components/PaymentPanel";
import RecordRoute from "@/components/records/RecordRoute";

export default function PembayaranPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="space-y-8">
      {/* Header + statistik + daftar data dulu, supaya bagian atas sama dengan halaman lain */}
      <RecordRoute kind="payment" searchParams={searchParams} />
      <PaymentPanel />
    </div>
  );
}