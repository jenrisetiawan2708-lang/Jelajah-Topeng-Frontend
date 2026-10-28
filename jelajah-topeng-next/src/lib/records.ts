import "server-only";
import { del } from "@vercel/blob";
import { apiFetch, ApiError } from "@/lib/api";
import {
  type RecordDTO,
  type RecordDraft,
  type RecordKind,
  type RecordsByKind,
} from "@/lib/content-config";

const BLOB_URL_RE = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

async function deleteBlob(url: string) {
  if (url && BLOB_URL_RE.test(url)) await del(url);
}

export async function getRecordsDTO(userId: string): Promise<RecordsByKind> {
  return apiFetch<RecordsByKind>("/records", userId);
}

export async function nameExists(
  userId: string,
  kind: RecordKind,
  name: string,
  exceptId?: string,
): Promise<boolean> {
  const all = await getRecordsDTO(userId);
  const wanted = name.trim().toLowerCase();
  return all[kind].some(
    (r: RecordDTO) => r.id !== exceptId && r.name.trim().toLowerCase() === wanted,
  );
}

export async function insertRecord(
  userId: string,
  kind: RecordKind,
  values: RecordDraft,
) {
  await apiFetch<RecordDTO>("/records", userId, {
    method: "POST",
    body: JSON.stringify({ ...values, kind }),
  });
}

// Mengembalikan false kalau data tidak ditemukan / bukan milik user (404 dari BE).
export async function updateRecord(
  userId: string,
  kind: RecordKind,
  id: string,
  values: RecordDraft,
): Promise<boolean> {
  const before = (await getRecordsDTO(userId))[kind].find((r) => r.id === id);

  try {
    await apiFetch<RecordDTO>(`/records/${encodeURIComponent(id)}`, userId, {
      method: "PUT",
      body: JSON.stringify({ ...values, kind }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return false;
    throw error;
  }

  // Gambar diganti: file lama di Blob dibuang supaya tidak jadi orphan file.
  if (before?.imageUrl && before.imageUrl !== values.imageUrl) {
    try {
      await deleteBlob(before.imageUrl);
    } catch {
      // data sudah tersimpan; gagal hapus file lama tidak membatalkan edit
    }
  }
  return true;
}

export async function removeRecord(
  userId: string,
  kind: RecordKind,
  id: string,
): Promise<boolean> {
  const record = (await getRecordsDTO(userId))[kind].find((r) => r.id === id);
  if (!record) return false; // tidak ada / bukan milik user ini

  // 1. Hapus file fisik di Vercel Blob TERLEBIH DAHULU
  await deleteBlob(record.imageUrl);

  // 2. Baru hapus baris datanya di database (lewat BE)
  try {
    await apiFetch(`/records/${encodeURIComponent(id)}`, userId, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return false;
    throw error;
  }
}