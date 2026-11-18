"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { saveRecord } from "@/app/actions/records";
import ImageUploadField from "@/components/ImageUploadField";
import { useToast } from "@/components/ToastProvider";
import {
  WILAYAH_SUGGESTIONS,
  type FormState,
  type RecordDTO,
  type RecordKind,
} from "@/lib/content-config";
import { getRecordLayout } from "@/lib/record-layout";
import { recordSchema, type FieldKey } from "@/lib/schemas";

type FormInput = z.input<typeof recordSchema>;
type FormOutput = z.output<typeof recordSchema>;

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

  const [state, formAction, pending] = useActionState(saveRecord, {} as FormState);
  const [isSending, startTransition] = useTransition();

  // React Hook Form + skema Zod yang sama dengan Server Action.
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(recordSchema),
    mode: "onChange",
    defaultValues: {
      kind,
      id: editing ? item.id : "",
      name: item?.name ?? "",
      description: item?.description ?? "",
      location: item?.location ?? "",
      date: item?.date ?? "",
      amount: item?.amount ?? "",
      status: item?.status ?? profile.statuses[0],
      correctAnswer: item?.correctAnswer ?? "",
      correctClue: item?.correctClue ?? "",
      imageUrl: item?.imageUrl ?? "",
      eventDate: item?.eventDate ?? "",
    },
  });

  const imageUrl = watch("imageUrl") ?? "";

  function fieldError(key: FieldKey): string | undefined {
    return errors[key]?.message as string | undefined;
  }

  // Hasil Server Action: sukses -> tutup, gagal -> tampilkan error per field.
  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) {
      toast.success(state.message ?? "Data berhasil disimpan");
      onSaved();
    } else {
      for (const [key, messages] of Object.entries(state.errors ?? {})) {
        if (messages?.[0]) {
          setError(key as FieldKey, { type: "server", message: messages[0] });
        }
      }
      toast.error(state.message ?? "Gagal menyimpan data.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function onValid(values: FormOutput) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, String(value ?? ""));
    }
    startTransition(() => formAction(formData));
  }

  const busy = pending || isSending;

  const locationField = (
    <label className="block text-sm font-medium text-slate-700">
      {profile.fields[2]}
      <input
        list={profile.fields[2] === "Wilayah" ? "wilayah-list" : undefined}
        placeholder={
          profile.fields[2] === "Wilayah" ? "Ketik atau pilih wilayah" : undefined
        }
        aria-invalid={!!fieldError("location")}
        className={inputCls("h-10", fieldError("location"))}
        {...register("location")}
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
          type="date"
          aria-invalid={!!fieldError("date")}
          className={inputCls("h-10", fieldError("date"))}
          {...register("date")}
        />
      ) : (
        <input
          placeholder={profile.fields[3]}
          aria-invalid={!!fieldError("date")}
          className={inputCls("h-10", fieldError("date"))}
          {...register("date")}
        />
      )}
      <FieldError message={fieldError("date")} />
    </label>
  );

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className="mt-4 space-y-4">
      {kind === "panji" ? (
        <>
          <label className="block text-sm font-medium text-slate-700">
            Nama game
            <input
              autoFocus
              placeholder="Contoh: Teka-teki Topeng Panji"
              aria-invalid={!!fieldError("name")}
              className={inputCls("h-11", fieldError("name"))}
              {...register("name")}
            />
            <FieldError message={fieldError("name")} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Rincian atau isi game
            <textarea
              placeholder="Tuliskan cerita, pertanyaan, atau instruksi permainan"
              rows={4}
              aria-invalid={!!fieldError("description")}
              className={`${inputCls("", fieldError("description"))} py-2`}
              {...register("description")}
            />
            <FieldError message={fieldError("description")} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Jawaban yang benar
            <input
              placeholder="Masukkan jawaban yang benar"
              aria-invalid={!!fieldError("correctAnswer")}
              className={inputCls("h-11", fieldError("correctAnswer"))}
              {...register("correctAnswer")}
            />
            <FieldError message={fieldError("correctAnswer")} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Clue jika jawaban benar
            <textarea
              placeholder="Petunjuk yang diberikan setelah pemain menjawab benar"
              rows={3}
              aria-invalid={!!fieldError("correctClue")}
              className={`${inputCls("", fieldError("correctClue"))} py-2`}
              {...register("correctClue")}
            />
            <FieldError message={fieldError("correctClue")} />
          </label>
          <ImageUploadField
            value={imageUrl}
            onChange={(url) =>
              setValue("imageUrl", url, { shouldValidate: true, shouldDirty: true })
            }
          />
          <FieldError message={fieldError("imageUrl")} />
        </>
      ) : (
        <>
          <label className="block text-sm font-medium text-slate-700">
            {profile.fields[0]}
            <input
              autoFocus
              aria-invalid={!!fieldError("name")}
              className={inputCls("h-11", fieldError("name"))}
              {...register("name")}
            />
            <FieldError message={fieldError("name")} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            {profile.fields[1]}
            <textarea
              rows={3}
              aria-invalid={!!fieldError("description")}
              className={`${inputCls("", fieldError("description"))} py-2`}
              {...register("description")}
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
                      type="date"
                      aria-invalid={!!fieldError("eventDate")}
                      className={inputCls("h-10", fieldError("eventDate"))}
                      {...register("eventDate")}
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
                rows={5}
                placeholder="Tulis catatan..."
                aria-invalid={!!fieldError("amount")}
                className={`${inputCls("", fieldError("amount"))} resize-y py-2`}
                {...register("amount")}
              />
            ) : (
              <input
                placeholder={profile.fields[4]}
                aria-invalid={!!fieldError("amount")}
                className={inputCls("h-10", fieldError("amount"))}
                {...register("amount")}
              />
            )}
            <FieldError message={fieldError("amount")} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600"
              {...register("status")}
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
          disabled={!isValid || busy}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
}