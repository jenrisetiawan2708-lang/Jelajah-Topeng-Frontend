import { z } from "zod";

// Tipe + aturan validasi refund. Aman dipakai di server maupun client.

export const REFUND_STATUSES = [
  "Menunggu",
  "Diproses",
  "Disetujui",
  "Ditolak",
] as const;

export type RefundDTO = {
  id: string;
  code: string;
  requester: string;
  participants: string;
  destination: string;
  trxCode: string;
  visitInfo: string;
  filedAt: string;
  proofAt: string;
  amount: number;
  reason: string;
  reasonDetail: string;
  method: string;
  status: string;
  rejectReason: string;
  adminNote: string;
  decidedAt: string | null;
};

// Aturan alasan penolakan (dipakai di klien untuk error langsung & di server).
export function checkRefundReason(raw: string): string {
  const value = raw.trim();
  if (!value) return "Alasan penolakan wajib diisi untuk pengajuan tolak.";
  if (value.length < 10) return "Alasan penolakan minimal 10 karakter.";
  if (value.length > 500) return "Alasan penolakan maksimal 500 karakter.";
  return "";
}

export const refundDecisionSchema = z
  .object({
    id: z.string().trim().min(1, "ID pengajuan tidak valid"),
    decision: z.enum(["approve", "reject"]),
    reason: z.string().trim().default(""),
    note: z.string().trim().max(500, "Catatan maksimal 500 karakter").default(""),
  })
  .superRefine((data, ctx) => {
    if (data.decision === "reject") {
      const message = checkRefundReason(data.reason);
      if (message) {
        ctx.addIssue({
          code: "custom",
          message,
          path: ["reason"],
        } as Parameters<typeof ctx.addIssue>[0]);
      }
    }
  });