import "server-only";
import type { Refund } from "@prisma/client";
import { db } from "@/lib/db";
import type { RefundDTO } from "@/lib/refund-schema";

const SEED_KIND = "refund";

// WIB = UTC+7
const wib = (date: string, time: string) => new Date(`${date}T${time}:00+07:00`);

// Data contoh mengikuti wireframe.
const SEEDS = [
  {
    code: "RF-2024-889",
    requester: "SMA Taruna Nusantara",
    participants: "24 Peserta Edukasi Workshop",
    destination: "Kampung Topeng Malangan",
    trxCode: "TRX-2024-889",
    visitInfo: "25 Oktober 2024 · 09.00 WIB · 24 tiket",
    filedAt: wib("2024-10-24", "10:14"),
    proofAt: wib("2024-10-24", "10:18"),
    amount: 3_600_000,
    reason: "Pembatalan jadwal",
    reasonDetail:
      "Jadwal kunjungan berubah. Rombongan tidak dapat hadir pada tanggal yang telah dipesan.",
    method: "QRIS Dinamis",
    status: "Menunggu",
  },
  {
    code: "RF-2024-890",
    requester: "Dr. Helena Meyer",
    participants: "1 Peserta Perorangan",
    destination: "Sanggar Cirebon Slangit",
    trxCode: "TRX-2024-890",
    visitInfo: "26 Oktober 2024 · 10.00 WIB · 1 tiket",
    filedAt: wib("2024-10-23", "09:30"),
    proofAt: wib("2024-10-23", "09:34"),
    amount: 850_000,
    reason: "Kesalahan pembelian",
    reasonDetail: "Tiket terbeli dua kali pada transaksi yang sama.",
    method: "Transfer Bank",
    status: "Disetujui",
  },
  {
    code: "RF-2024-882",
    requester: "Komunitas Tari Sekar",
    participants: "12 Peserta Komunitas",
    destination: "Sentra Topeng Kayu Bobung",
    trxCode: "TRX-2024-882",
    visitInfo: "21 Oktober 2024 · 13.00 WIB · 12 tiket",
    filedAt: wib("2024-10-22", "14:05"),
    proofAt: wib("2024-10-22", "14:09"),
    amount: 2_450_000,
    reason: "Pengguna tidak hadir",
    reasonDetail: "Pengajuan dibuat setelah jadwal kunjungan berakhir.",
    method: "QRIS Dinamis",
    status: "Ditolak",
  },
  {
    code: "RF-2024-891",
    requester: "Bpk. Bambang Sutrisno",
    participants: "2 Peserta Perorangan",
    destination: "Padepokan Klaten Panji",
    trxCode: "TRX-2024-891",
    visitInfo: "23 Oktober 2024 · 11.00 WIB · 2 tiket",
    filedAt: wib("2024-10-21", "16:40"),
    proofAt: wib("2024-10-21", "16:43"),
    amount: 600_000,
    reason: "Kesalahan pembelian",
    reasonDetail: "Salah memilih paket kunjungan saat checkout.",
    method: "Virtual Account",
    status: "Disetujui",
  },
  {
    code: "RF-2024-870",
    requester: "Sanggar Tari Rena",
    participants: "8 Peserta Sanggar",
    destination: "Kampung Topeng Malangan",
    trxCode: "TRX-2024-870",
    visitInfo: "27 Oktober 2024 · 09.00 WIB · 8 tiket",
    filedAt: wib("2024-10-20", "08:20"),
    proofAt: wib("2024-10-20", "08:25"),
    amount: 1_200_000,
    reason: "Pembatalan jadwal",
    reasonDetail: "Sanggar menunda kegiatan karena bentrok dengan acara lain.",
    method: "QRIS Dinamis",
    status: "Diproses",
  },
];

function toDTO(r: Refund): RefundDTO {
  return {
    id: r.id,
    code: r.code,
    requester: r.requester,
    participants: r.participants,
    destination: r.destination,
    trxCode: r.trxCode,
    visitInfo: r.visitInfo,
    filedAt: r.filedAt.toISOString(),
    proofAt: r.proofAt.toISOString(),
    amount: r.amount,
    reason: r.reason,
    reasonDetail: r.reasonDetail,
    method: r.method,
    status: r.status,
    rejectReason: r.rejectReason,
    adminNote: r.adminNote,
    decidedAt: r.decidedAt ? r.decidedAt.toISOString() : null,
  };
}

// Data contoh dimasukkan sekali per user.
async function ensureSeeded(userId: string) {
  const done = await db.seededKind.findUnique({
    where: { userId_kind: { userId, kind: SEED_KIND } },
  });
  if (done) return;

  try {
    await db.$transaction([
      db.seededKind.create({ data: { userId, kind: SEED_KIND } }),
      db.refund.createMany({
        data: SEEDS.map((seed) => ({
          ...seed,
          userId,
          decidedAt:
            seed.status === "Disetujui" || seed.status === "Ditolak"
              ? seed.filedAt
              : null,
          rejectReason:
            seed.status === "Ditolak"
              ? "Pengajuan refund melewati batas waktu pembatalan, yaitu maksimal 24 jam sebelum jadwal kunjungan."
              : "",
        })),
      }),
    ]);
  } catch {
    // Request paralel lain sudah melakukan seed; aman diabaikan.
  }
}

// Hanya data milik user ini.
export async function getRefundsDTO(userId: string): Promise<RefundDTO[]> {
  await ensureSeeded(userId);
  const rows = await db.refund.findMany({
    where: { userId },
    orderBy: { filedAt: "desc" },
  });
  return rows.map(toDTO);
}

// Setujui / tolak. Cegah IDOR: userId ikut di where. Status juga dicek di sini,
// jadi pengajuan yang sudah diputuskan tidak bisa diubah lagi.
export async function decideRefundRecord(
  userId: string,
  id: string,
  decision: "approve" | "reject",
  reason: string,
  note: string,
): Promise<boolean> {
  const allowedFrom =
    decision === "approve" ? ["Menunggu", "Diproses"] : ["Menunggu"];

  const result = await db.refund.updateMany({
    where: { id, userId, status: { in: allowedFrom } },
    data: {
      status: decision === "approve" ? "Disetujui" : "Ditolak",
      rejectReason: decision === "reject" ? reason : "",
      adminNote: note,
      decidedAt: new Date(),
    },
  });
  return result.count > 0;
}