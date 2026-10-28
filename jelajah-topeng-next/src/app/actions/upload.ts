"use server";

import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { auth } from "../../../auth";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// Cek isi file, bukan hanya label MIME dari browser.
function matchesSignature(type: string, b: Uint8Array): boolean {
  if (type === "image/jpeg") return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  if (type === "image/png") {
    return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  }
  if (type === "image/webp") {
    const riff = String.fromCharCode(b[0], b[1], b[2], b[3]) === "RIFF";
    const webp = String.fromCharCode(b[8], b[9], b[10], b[11]) === "WEBP";
    return riff && webp;
  }
  return false;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  // 1. Cek autentikasi + peran admin
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { ok: false, error: "Anda tidak punya izin mengunggah gambar" };
  }

  // 2. Validasi tipe (allowlist) dan ukuran di server
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Pilih gambar terlebih dahulu" };
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return { ok: false, error: "File wajib berupa gambar JPG, PNG, atau WebP" };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false, error: "Ukuran gambar maksimal 4 MB" };
  }
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!matchesSignature(file.type, head)) {
    return { ok: false, error: "Isi file tidak sesuai dengan format gambar" };
  }

  // 3. Unggah ke Vercel Blob (nama acak, bukan nama asli file)
  const userId = (session.user.id || "admin").replace(/[^a-zA-Z0-9_-]/g, "_");
  try {
    const blob = await put(`uploads/${userId}/${randomUUID()}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return { ok: true, url: blob.url };
  } catch {
    return { ok: false, error: "Gagal mengunggah gambar, coba lagi" };
  }
}