"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { KINDS, type FormState, type RecordKind } from "@/lib/content-config";
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

  // 1) VALIDASI DI SERVER (tetap jalan walau atribut required di-inspect/dihapus)
  const result = recordSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      ok: false,
      message: "Gagal menyimpan data. Periksa isian yang salah.",
      errors: fieldErrorsFromIssues(result.error.issues),
      ts: Date.now(),
    };
  }

  const { kind, id, ...values } = result.data;

  if (await nameExists(user.id, kind, values.name, id || undefined)) {
    return {
      ok: false,
      message: "Gagal menyimpan data. Data dengan nama tersebut sudah ada.",
      errors: { name: ["Data dengan nama tersebut sudah ada"] },
      ts: Date.now(),
    };
  }

  // 2) MUTASI KE DATABASE (selalu dibatasi userId = user.id)
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

  // Cek kepemilikan: where { id, kind, userId: user.id } di removeRecord
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