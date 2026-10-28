import "server-only";
import type { ContentRecord } from "@prisma/client";
import { db } from "@/lib/db";
import {
  CONTENT_PROFILES,
  KINDS,
  emptyRecords,
  type RecordDTO,
  type RecordDraft,
  type RecordKind,
  type RecordsByKind,
} from "@/lib/content-config";

function toDTO(r: ContentRecord): RecordDTO {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    location: r.location,
    date: r.date,
    amount: r.amount,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    correctAnswer: r.correctAnswer,
    correctClue: r.correctClue,
    imageUrl: r.imageUrl,
    eventDate: r.eventDate,
  };
}

// Data contoh dimasukkan sekali per user per halaman.
async function ensureSeeded(userId: string) {
  const done = await db.seededKind.findMany({ where: { userId } });
  const doneKinds = new Set(done.map((d) => d.kind));
  const todo = KINDS.filter((kind) => !doneKinds.has(kind));
  if (todo.length === 0) return;

  try {
    await db.$transaction([
      db.seededKind.createMany({
        data: todo.map((kind) => ({ userId, kind })),
      }),
      db.contentRecord.createMany({
        data: todo.flatMap((kind) =>
          CONTENT_PROFILES[kind].records.map((seed) => ({
            userId,
            kind,
            name: seed.name,
            description: seed.description,
            location: seed.location,
            date: seed.date,
            amount: seed.amount,
            status: seed.status,
            createdAt: new Date(0),
          })),
        ),
      }),
    ]);
  } catch {
    // Request paralel lain sudah melakukan seed; aman diabaikan.
  }
}

export async function getRecordsDTO(userId: string): Promise<RecordsByKind> {
  await ensureSeeded(userId);

  // Hanya data milik user ini yang diambil.
  const rows = await db.contentRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const result = emptyRecords();
  for (const row of rows) {
    if ((KINDS as readonly string[]).includes(row.kind)) {
      result[row.kind as RecordKind].push(toDTO(row));
    }
  }
  return result;
}

export async function nameExists(
  userId: string,
  kind: RecordKind,
  name: string,
  exceptId?: string,
): Promise<boolean> {
  const wanted = name.trim().toLowerCase();
  const rows = await db.contentRecord.findMany({
    where: { userId, kind },
    select: { id: true, name: true },
  });
  return rows.some(
    (r) => r.id !== exceptId && r.name.trim().toLowerCase() === wanted,
  );
}

export async function insertRecord(
  userId: string,
  kind: RecordKind,
  values: RecordDraft,
) {
  await db.contentRecord.create({
    data: { ...values, userId, kind },
  });
}

// Cegah IDOR: `userId` ikut di klausa where, jadi data milik user lain
// tidak akan pernah cocok. Mengembalikan false jika tidak ada yang berubah.
export async function updateRecord(
  userId: string,
  kind: RecordKind,
  id: string,
  values: RecordDraft,
): Promise<boolean> {
  const result = await db.contentRecord.updateMany({
    where: { id, kind, userId },
    data: { ...values, createdAt: new Date() },
  });
  return result.count > 0;
}

// Cegah IDOR: hanya pemilik (userId) yang bisa menghapus.
export async function removeRecord(
  userId: string,
  kind: RecordKind,
  id: string,
): Promise<boolean> {
  const result = await db.contentRecord.deleteMany({
    where: { id, kind, userId },
  });
  return result.count > 0;
}