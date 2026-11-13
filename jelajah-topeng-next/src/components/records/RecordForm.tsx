"use client";

import { useActionState, useEffect, useState } from "react";
import { saveRecord } from "@/app/actions/records";
import ImageUploadField from "@/components/ImageUploadField";
import { useToast } from "@/components/ToastProvider";
import {
  WILAYAH_SUGGESTIONS,
  type FieldErrors,
  type FormState,
  type RecordDTO,
  type RecordDraft,
  type RecordKind,
} from "@/lib/content-config";
import { getRecordLayout } from "@/lib/record-layout";
import { checkRecord, type FieldKey } from "@/lib/schemas";

const EMPTY_DRAFT: RecordDraft = {
  name: "",
  description: "",
  location: "",
  date: "",
  amount: "",
  status: "Aktif",
  correctAnswer: "",
  correctClue: "",
  imageUrl: "",
  eventDate: "",
};

function inputCls(size: string, error?: string) {
  return `mt-2 ${size} w-full rounded-lg border px-3 text-sm outline-none ${
    error
      ? "border-red-400 focus:border-red-500"
      : "border-slate-300 focus:border-emerald-600"
  }`;
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <span role="alert" className="mt-1 block text-xs font-normal text-red-600">
      {message}
    </span>
  ) : null;
}

function toDraft(item: RecordDTO): RecordDraft {
  return {
    name: item.name,
    description: item.description,
    location: item.location,
    date: item.date,
    amount: item.amount,
    status: item.status,
    correctAnswer: item.correctAnswer,
    correctClue: item.correctClue,
    imageUrl: item.imageUrl,
    eventDate: item.eventDate,
  };
}

export default function RecordForm({
  kind,
  item,
  onClose,
  onSaved,
}: {
  kind: RecordKind;
  item: RecordDTO | null; // null = tambah data baru
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const { profile, yearAsDate, dateLabel, extraDate, isDateInput } =
    getRecordLayout(kind);
  const editing = item !== null;

  const [draft, setDraft] = useState<RecordDraft>(
    item ? toDraft(item) : { ...EMPTY_DRAFT, status: profile.statuses[0] },
  );
  const [state, formAction, pending] = useActionState(saveRecord, {} as FormState);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [edited, setEdited] = useState<Record<string, boolean>>({});

  // Aturan sama dengan server (lib/schemas.ts); server tetap memvalidasi ulang.
  const allErrors = checkRecord(kind, draft);
  const canSubmit = Object.keys(allErrors).length === 0;

  function fieldError(key: FieldKey): string | undefined {
    const live = allErrors[key];
    const value = (draft[key] ?? "").trim();
    if (live && value) return live;
    if (!edited[key]) return serverErrors[key]?.[0];
    return undefined;
  }

  function setField(key: FieldKey, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setEdited((current) => ({ ...current, [key]: true }));
  }

  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) {
      toast.success(state.message ?? "Data berhasil disimpan");
      onSaved();
    } else {
      setServerErrors(state.errors ?? {});
      toast.error(state.message ?? "Gagal menyimpan data.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function submitForm(formData: FormData) {
    setEdited({});
    formAction(formData);
  }

  const locationField = (
    <label className="block text-sm font-medium text-slate-700">
      {profile.fields[2]}
      <input
        name="location"
        list={profile.fields[2] === "Wilayah" ? "wilayah-list" : undefined}
        value={draft.location}
        onChange={(e) => setField("location", e.target.value)}
        placeholder={
          profile.fields[2] === "Wilayah" ? "Ketik atau pilih wilayah" : undefined
        }
        aria-invalid={!!fieldError("location")}
        className={inputCls("h-10", fieldError("location"))}
      />
      {profile.fields[2] === "Wilayah" && (
        <datalist id="wilayah-list">
          {WILAYAH_SUGGESTIONS.map((wilayah) => (
            <option key={wilayah} value={wilayah} />
          ))}
        </datalist>
      )}
      <FieldError message={fieldError("location")} />
    </label>
  );

  const dateField = (
    <label className="block text-sm font-medium text-slate-700">
      {dateLabel}
      {isDateInput ? (
        <input
          name="date"
          type="date"
          value={draft.date}
          onChange={(e) => setField("date", e.target.value)}
          aria-invalid={!!fieldError("date")}
          className={inputCls("h-10", fieldError("date"))}
        />
      ) : (
        <input
          name="date"
          value={draft.date}
          onChange={(e) => setField("date", e.target.value)}
          placeholder={profile.fields[3]}
          aria-invalid={!!fieldError("date")}
          className={inputCls("h-10", fieldError("date"))}
        />
      )}
      <FieldError message={fieldError("date")} />
    </label>
  );

  return (
    <form action={submitForm} className="mt-4 space-y-4">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={editing ? item.id : ""} />

      {kind === "panji" ? (
        <>
          <label className="block text-sm font-medium text-slate-700">
            Nama game
            <input
              name="name"
              autoFocus
              required
              value={draft.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Contoh: Teka-teki Topeng Panji"
              aria-invalid={!!fieldError("name")}
              className={inputCls("h-11", fieldError("name"))}
            />
            <FieldError message={fieldError("name")} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Rincian atau isi game
            <textarea
              name="description"
              value={draft.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Tuliskan cerita, pertanyaan, atau instruksi permainan"
              rows={4}
              aria-invalid={!!fieldError("description")}
              className={`${inputCls("", fieldError("description"))} py-2`}
            />
            <FieldError message={fieldError("description")} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Jawaban yang benar
            <input
              name="correctAnswer"
              value={draft.correctAnswer}
              onChange={(e) => setField("correctAnswer", e.target.value)}
              placeholder="Masukkan jawaban yang benar"
              aria-invalid={!!fieldError("correctAnswer")}
              className={inputCls("h-11", fieldError("correctAnswer"))}
            />
            <FieldError message={fieldError("correctAnswer")} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Clue jika jawaban benar
            <textarea
              name="correctClue"
              value={draft.correctClue}
              onChange={(e) => setField("correctClue", e.target.value)}
              placeholder="Petunjuk yang diberikan setelah pemain menjawab benar"
              rows={3}
              aria-invalid={!!fieldError("correctClue")}
              className={`${inputCls("", fieldError("correctClue"))} py-2`}
            />
            <FieldError message={fieldError("correctClue")} />
          </label>
          <ImageUploadField
            value={draft.imageUrl}
            onChange={(url) => setField("imageUrl", url)}
          />
          <input type="hidden" name="imageUrl" value={draft.imageUrl} />
          <FieldError message={fieldError("imageUrl")} />
        </>
      ) : (
        <>
          <label className="block text-sm font-medium text-slate-700">
            {profile.fields[0]}
            <input
              name="name"
              autoFocus
              required
              value={draft.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={!!fieldError("name")}
              className={inputCls("h-11", fieldError("name"))}
            />
            <FieldError message={fieldError("name")} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            {profile.fields[1]}
            <textarea
              name="description"
              value={draft.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              aria-invalid={!!fieldError("description")}
              className={`${inputCls("", fieldError("description"))} py-2`}
            />
            <FieldError message={fieldError("description")} />
          </label>

          {yearAsDate ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {locationField}
              {dateField}
            </div>
          ) : (
            <>
              {locationField}
              <div className={extraDate ? "grid grid-cols-2 gap-3" : ""}>
                {extraDate && (
                  <label className="block text-sm font-medium text-slate-700">
                    Tanggal
                    <input
                      name="eventDate"
                      type="date"
                      value={draft.eventDate}
                      onChange={(e) => setField("eventDate", e.target.value)}
                      aria-invalid={!!fieldError("eventDate")}
                      className={inputCls("h-10", fieldError("eventDate"))}
                    />
                    <FieldError message={fieldError("eventDate")} />
                  </label>
                )}
                {dateField}
              </div>
            </>
          )}

          <label className="block text-sm font-medium text-slate-700">
            {profile.fields[4]}
            {profile.fields[4] === "Catatan" ? (
              <textarea
                name="amount"
                rows={5}
                value={draft.amount}
                onChange={(e) => setField("amount", e.target.value)}
                placeholder="Tulis catatan..."
                aria-invalid={!!fieldError("amount")}
                className={`${inputCls("", fieldError("amount"))} resize-y py-2`}
              />
            ) : (
              <input
                name="amount"
                value={draft.amount}
                onChange={(e) => setField("amount", e.target.value)}
                placeholder={profile.fields[4]}
                aria-invalid={!!fieldError("amount")}
                className={inputCls("h-10", fieldError("amount"))}
              />
            )}
            <FieldError message={fieldError("amount")} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              name="status"
              value={draft.status}
              onChange={(e) => setField("status", e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600"
            >
              {profile.statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <FieldError message={fieldError("status")} />
          </label>
        </>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!canSubmit || pending}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
