import "server-only";
import { updateTag } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";
import type { RefundDTO } from "@/lib/refund-schema";

// Tag harus sama persis dengan yang dipakai di src/lib/page-data.ts.
const summaryTag = (userId: string) => `summary-${userId}`;

// Data refund diambil dari BE Express/MySQL (GET /api/refunds).
// Data contoh diisi otomatis oleh BE sekali per user.
export async function getRefundsDTO(userId: string): Promise<RefundDTO[]> {
  return apiFetch<RefundDTO[]>("/refunds", userId);
}

// Setujui / tolak lewat BE (PATCH /api/refunds/:id/decision).
// BE yang mengecek kepemilikan dan status (transaksi + log di tabel refund_logs).
// false = pengajuan tidak ditemukan (404) atau sudah diproses (409).
export async function decideRefundRecord(
  userId: string,
  id: string,
  decision: "approve" | "reject",
  reason: string,
  note: string,
): Promise<boolean> {
  try {
    await apiFetch<RefundDTO>(
      `/refunds/${encodeURIComponent(id)}/decision`,
      userId,
      {
        method: "PATCH",
        body: JSON.stringify({ decision, reason, note }),
      },
    );
    updateTag(summaryTag(userId)); // jumlah refund di dashboard ikut berubah
    return true;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 409)) {
      return false;
    }
    throw error;
  }
}