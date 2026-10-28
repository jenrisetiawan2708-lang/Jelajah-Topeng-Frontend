"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import {
  CONTENT_PROFILES,
  KINDS,
  type FormState,
  type RecordKind,
} from "@/lib/content-config";
import { ApiError } from "@/lib/api";
import { fieldErrorsFromIssues, recordSchema } from "@/lib/schemas";
import { insertRecord, nameExists, removeRecord, updateRecord } from "@/lib/records";

const forbidden = (): FormState => ({
  ok: false,
  message: "FORBIDDEN: hanya admin yang boleh mengubah data.",
  ts: Date.now(),
});

// Tambah + ubah data. Dipasang ke <form action> lewat useActionState.
export async function saveRecord(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Autentikasi + otorisasi dicek ulang di server, bukan percaya UI.
  const user = await verifySession();
  if (user.role !== "admin") return forbidden();

  // Form Jejak Sang Panji tidak punya kolom Status: isi dengan status pertama.
  const raw: Record<string, FormDataEntryValue> = Object.fromEntries(formData);
  const rawKind = String(raw.kind ?? "");
  if (!String(raw.status ?? "").trim() && KINDS.includes(rawKind as RecordKind)) {
    raw.status = CONTENT_PROFILES[rawKind as RecordKind].statuses[0];
  }

  // 1) VALIDASI DI SERVER (tetap jalan walau atribut required di-inspect/dihapus)
  const result = recordSchema.safeParse(raw);
  if (!result.success) {
    console.error(
      "VALIDASI GAGAL:",
      JSON.stringify(
        result.error.issues.map((i) => ({ field: i.path[0], pesan: i.message })),
      ),
    );
    return {
      ok: false,
      message: "Gagal menyimpan data. Periksa isian yang salah.",
      errors: fieldErrorsFromIssues(result.error.issues),
      ts: Date.now(),
    };
  }

  const { kind, id, ...values } = result.data;

  try {
    if (await nameExists(user.id, kind, values.name, id || undefined)) {
      return {
        ok: false,
        message: "Gagal menyimpan data. Data dengan nama tersebut sudah ada.",
        errors: { name: ["Data dengan nama tersebut sudah ada"] },
        ts: Date.now(),
      };
    }

    // 2) MUTASI KE DATABASE (lewat BE, selalu dibatasi userId = user.id)
    if (id) {
      const updated = await updateRecord(user.id, kind, id, values);
      if (!updated) {
        return {
          ok: false,
          message: "Data tidak ditemukan atau bukan milik akun ini.",
          ts: Date.now(),
        };
      }
    } else {
      await insertRecord(user.id, kind, values);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("API ERROR:", error.status, error.message, error.fields);
      return {
        ok: false,
        message: `Gagal menyimpan data. ${error.message}`,
        errors: error.fields,
        ts: Date.now(),
      };
    }
    throw error;
  }

  // 3) REVALIDASI: tampilan langsung diperbarui tanpa refresh
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: id ? "Perubahan berhasil disimpan" : "Data berhasil ditambahkan",
    ts: Date.now(),
  };
}

// Hapus data. Di UI dipanggil dengan deleteRecord.bind(null, kind, id).
export async function deleteRecord(
  kind: string,
  id: string,
  _prev: FormState,
  _formData: FormData,
): Promise<FormState> {
  void _formData;
  const user = await verifySession();
  if (user.role !== "admin") return forbidden();

  if (!KINDS.includes(kind as RecordKind) || !id) {
    return { ok: false, message: "Permintaan hapus tidak valid.", ts: Date.now() };
  }

  // File di Vercel Blob dihapus dulu, baru baris datanya (lihat removeRecord).
  const removed = await removeRecord(user.id, kind as RecordKind, id);
  if (!removed) {
    return {
      ok: false,
      message: "Data tidak ditemukan atau bukan milik akun ini.",
      ts: Date.now(),
    };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Data berhasil dihapus", ts: Date.now() };
}