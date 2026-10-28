import { z } from "zod";
import {
  CONTENT_PROFILES,
  KINDS,
  type FieldErrors,
  type RecordKind,
} from "@/lib/content-config";

export type FieldKey =
  | "name"
  | "description"
  | "location"
  | "date"
  | "amount"
  | "status"
  | "correctAnswer"
  | "correctClue"
  | "imageUrl"
  | "eventDate";

type Values = Partial<Record<FieldKey, string>>;

const LETTERS_ONLY = /^[\p{L}\s.,'’-]+$/u;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_IMAGE_LENGTH = 800_000; // karakter data-URL (batas body Server Action ±1 MB)

// Aturan tambahan yang mengikuti label field tiap halaman.
function validateByLabel(label: string, raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  const l = label.toLowerCase();

  if (
    l.startsWith("nama") ||
    ["maestro", "wilayah", "kategori", "penerima"].includes(l)
  ) {
    if (/\d/.test(value)) return `${label} tidak boleh mengandung angka`;
    if (!LETTERS_ONLY.test(value)) return `${label} hanya boleh berisi huruf`;
  }
  if (l === "durasi" || l === "jumlah subbab") {
    if (!/^\d+(\s*[a-z]+)?$/i.test(value)) {
      return `${label} harus berupa angka (contoh: 90 menit)`;
    }
  }
  if (l === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Format email tidak valid";
  }
  if ((l === "harga" || l === "jumlah") && !/\d/.test(value)) {
    return `${label} harus berisi angka`;
  }
  return "";
}

// Mesin aturan: mengembalikan satu pesan error per field (kosong = valid).
export function checkRecord(
  kind: RecordKind,
  v: Values,
): Partial<Record<FieldKey, string>> {
  const profile = CONTENT_PROFILES[kind];
  const f = profile.fields;
  const get = (key: FieldKey) => (v[key] ?? "").trim();
  const errors: Partial<Record<FieldKey, string>> = {};

  // Nama / judul: wajib, minimal 3 karakter
  const name = get("name");
  if (!name) errors.name = `${f[0]} wajib diisi`;
  else if (name.length < 3) errors.name = `${f[0]} minimal 3 karakter`;
  else if (name.length > 120) errors.name = `${f[0]} maksimal 120 karakter`;
  else if (kind !== "panji") {
    const message = validateByLabel(f[0], name);
    if (message) errors.name = message;
  }

  // Status harus salah satu pilihan yang sah
  if (!profile.statuses.includes(get("status"))) {
    errors.status = "Status tidak valid";
  }

  if (get("description").length > 1000) {
    errors.description = "Maksimal 1000 karakter";
  }

  if (kind === "panji") {
    if (!get("description")) errors.description = `${f[1]} wajib diisi`;
    if (!get("correctAnswer")) errors.correctAnswer = "Jawaban yang benar wajib diisi";
    if (!get("correctClue")) errors.correctClue = "Clue wajib diisi";

    const image = get("imageUrl");
    if (!image) errors.imageUrl = "Gambar wajib diunggah";
    else if (!image.startsWith("data:image/")) errors.imageUrl = "File gambar tidak valid";
    else if (image.length > MAX_IMAGE_LENGTH) errors.imageUrl = "Ukuran gambar terlalu besar";
    return errors;
  }

  // Halaman non-panji
  const location = get("location");
  if (location.length > 200) errors.location = `${f[2]} maksimal 200 karakter`;
  else {
    const message = validateByLabel(f[2], location);
    if (message) errors.location = message;
  }

  const isDateField = f[3] === "Tahun" || f[3] === "Tanggal";
  const date = get("date");
  if (isDateField) {
    if (date && !DATE_RE.test(date)) errors.date = "Tanggal tidak valid";
  } else {
    const message = validateByLabel(f[3], date);
    if (message) errors.date = message;
  }

  const eventDate = get("eventDate");
  if (eventDate && !DATE_RE.test(eventDate)) errors.eventDate = "Tanggal tidak valid";

  const amount = get("amount");
  if (amount.length > 1000) errors.amount = `${f[4]} maksimal 1000 karakter`;
  else {
    const message = validateByLabel(f[4], amount);
    if (message) errors.amount = message;
  }

  return errors;
}

// ---------- Schema Zod (dipakai Server Action) ----------

const text = z.string().trim().default("");

export const recordSchema = z
  .object({
    kind: z.enum(KINDS),
    id: z.string().optional(),
    name: text,
    description: text,
    location: text,
    date: text,
    amount: text,
    status: text,
    correctAnswer: text,
    correctClue: text,
    imageUrl: text,
    eventDate: text,
  })
  .superRefine((data, ctx) => {
    const errors = checkRecord(data.kind, data);
    for (const [key, message] of Object.entries(errors)) {
      ctx.addIssue({
        code: "custom",
        message,
        path: [key],
      } as Parameters<typeof ctx.addIssue>[0]);
    }
  });

// Mengubah daftar issue Zod menjadi { namaField: [pesan, ...] }
// (setara result.error.flatten().fieldErrors di materi).
export function fieldErrorsFromIssues(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}