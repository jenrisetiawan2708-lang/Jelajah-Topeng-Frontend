import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { getAllRecords } from "@/lib/page-data";
import { MENU_BY_ID } from "@/lib/menu";
import type { RecordKind } from "@/lib/content-config";
import { getRecordLayout } from "@/lib/record-layout";
import MarkNotificationRead from "@/components/records/MarkNotificationRead";
import PageSkeleton from "@/components/ui/PageSkeleton";

type Props = {
  kind: RecordKind;
  params: Promise<{ id: string }>;
};

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="whitespace-pre-wrap text-sm text-slate-700">{value || "—"}</dd>
    </div>
  );
}

async function DetailContent({ kind, params }: Props) {
  const [user, { id }] = await Promise.all([requireAdmin(), params]);
  const records = await getAllRecords(user.id);
  const item = records[kind].find((r) => r.id === id);
  if (!item) notFound();

  const menu = MENU_BY_ID[kind];
  const { profile, dateLabel, extraDate } = getRecordLayout(kind);

  return (
    <div className="max-w-2xl">
      {kind === "notification" && <MarkNotificationRead id={item.id} />}
      <Link
        href={menu.href}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft size={15} /> Kembali ke {menu.title}
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Detail data
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{item.name}</h1>

        {kind === "panji" ? (
          <>
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={"Gambar " + item.name}
                width={640}
                height={360}
                className="mt-4 max-h-64 w-full rounded-xl border border-slate-200 object-cover"
              />
            )}
            <dl className="mt-5 space-y-4">
              <Row label="Rincian atau isi game" value={item.description} />
              <Row label="Jawaban yang benar" value={item.correctAnswer} />
              <Row label="Clue jika jawaban benar" value={item.correctClue} />
            </dl>
          </>
        ) : (
          <dl className="mt-5 space-y-4">
            <Row label={profile.fields[1]} value={item.description} />
            <Row label={profile.fields[2]} value={item.location} />
            {extraDate && <Row label="Tanggal" value={item.eventDate} />}
            <Row label={dateLabel} value={item.date} />
            <Row label={profile.fields[4]} value={item.amount} />
            <Row label="Status" value={item.status} />
          </dl>
        )}
      </div>
    </div>
  );
}

export default function RecordDetailRoute(props: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DetailContent {...props} />
    </Suspense>
  );
}