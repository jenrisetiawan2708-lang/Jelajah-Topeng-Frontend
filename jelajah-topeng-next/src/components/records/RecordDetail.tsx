"use client";

import NextImage from "next/image";
import { Pencil } from "lucide-react";
import DeleteRecordButton from "@/components/records/DeleteRecordButton";
import type { RecordDTO, RecordKind } from "@/lib/content-config";
import { getRecordLayout } from "@/lib/record-layout";

export default function RecordDetail({
  kind,
  item,
  onClose,
  onEdit,
}: {
  kind: RecordKind;
  item: RecordDTO;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { profile, dateLabel, extraDate } = getRecordLayout(kind);

  return (
    <>
      {kind === "panji" ? (
        <div className="mt-5 space-y-4 text-sm">
          {item.imageUrl && (
            <NextImage
              src={item.imageUrl}
              alt={"Gambar " + item.name}
              width={640}
              height={360}
              className="max-h-64 w-full rounded-xl border border-slate-200 object-cover"
            />
          )}
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-slate-400">Nama game</dt>
              <dd className="font-semibold text-slate-800">{item.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Rincian atau isi game</dt>
              <dd className="whitespace-pre-wrap text-slate-700">{item.description || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Jawaban yang benar</dt>
              <dd className="text-slate-700">{item.correctAnswer || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Clue jika jawaban benar</dt>
              <dd className="whitespace-pre-wrap text-slate-700">{item.correctClue || "—"}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-slate-400">{profile.fields[0]}</dt>
            <dd className="font-semibold text-slate-800">{item.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">{profile.fields[1]}</dt>
            <dd className="text-slate-700">{item.description || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">{profile.fields[2]}</dt>
            <dd className="text-slate-700">{item.location || "—"}</dd>
          </div>
          {extraDate && (
            <div>
              <dt className="text-xs text-slate-400">Tanggal</dt>
              <dd className="text-slate-700">{item.eventDate || "—"}</dd>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-xs text-slate-400">{dateLabel}</dt>
              <dd className="text-slate-700">{item.date || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">{profile.fields[4]}</dt>
              <dd className="whitespace-pre-wrap text-slate-700">{item.amount || "—"}</dd>
            </div>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Status</dt>
            <dd className="text-slate-700">{item.status}</dd>
          </div>
        </dl>
      )}

      <div className="mt-6 flex justify-between">
        <DeleteRecordButton kind={kind} id={item.id} onDone={onClose} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      </div>
    </>
  );
}
