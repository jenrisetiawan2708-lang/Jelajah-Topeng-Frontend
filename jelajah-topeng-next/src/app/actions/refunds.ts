"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import type { FormState } from "@/lib/content-config";
import { ApiError } from "@/lib/api";
import { fieldErrorsFromIssues } from "@/lib/schemas";
import { refundDecisionSchema } from "@/lib/refund-schema";
import { decideRefundRecord } from "@/lib/refunds";

export async function decideRefund(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await verifySession();
  if (user.role !== "admin") {
    return {
      ok: false,
      message: "FORBIDDEN: hanya admin yang boleh memproses refund.",
      ts: Date.now(),
    };
  }

  // VALIDASI DI SERVER: tetap jalan walau required/disabled di-inspect
  const result = refundDecisionSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      ok: false,
      message: "Gagal memproses refund. Periksa isian yang salah.",
      errors: fieldErrorsFromIssues(result.error.issues),
      ts: Date.now(),
    };
  }

  const { id, decision, reason, note } = result.data;

  try {
    const done = await decideRefundRecord(user.id, id, decision, reason, note);
    if (!done) {
      return {
        ok: false,
        message: "Pengajuan tidak ditemukan atau sudah diproses.",
        ts: Date.now(),
      };
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("API ERROR (refund):", error.status, error.message, error.fields);
      return {
        ok: false,
        message: `Gagal memproses refund. ${error.message}`,
        errors: error.fields,
        ts: Date.now(),
      };
    }
    throw error;
  }

  // Tampilan langsung diperbarui tanpa refresh
  revalidatePath("/dashboard");
  return {
    ok: true,
    message:
      decision === "approve"
        ? "Refund berhasil disetujui"
        : "Refund berhasil ditolak",
    ts: Date.now(),
  };
}