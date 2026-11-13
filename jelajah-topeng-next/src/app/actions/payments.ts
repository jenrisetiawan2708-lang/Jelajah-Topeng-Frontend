"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { ApiError } from "@/lib/api";
import type { PaymentDTO } from "@/lib/payment-schema";
import { deletePayment, listPayments, syncPayment } from "@/lib/payments";

export type PaymentResult<T> = { ok: true; data: T } | { ok: false; error: string };

const FORBIDDEN = "FORBIDDEN: hanya admin yang boleh mengakses pembayaran.";

function fail(error: unknown): { ok: false; error: string } {
  if (error instanceof ApiError) {
    console.error("API ERROR (payment):", error.status, error.message);
    return { ok: false, error: error.message };
  }
  console.error("Payment action error:", error);
  return { ok: false, error: "Tidak dapat terhubung ke server. Pastikan backend berjalan." };
}

// Transaksi semua pengunjung (dibuat dari aplikasi mobile).
export async function fetchPayments(): Promise<PaymentResult<PaymentDTO[]>> {
  const user = await verifySession();
  if (user.role !== "admin") return { ok: false, error: FORBIDDEN };
  try {
    return { ok: true, data: await listPayments(user.id) };
  } catch (error) {
    return fail(error);
  }
}

export async function refreshPaymentStatus(orderId: string): Promise<PaymentResult<PaymentDTO>> {
  const user = await verifySession();
  if (user.role !== "admin") return { ok: false, error: FORBIDDEN };
  try {
    const data = await syncPayment(user.id, orderId);
    revalidatePath("/", "layout");
    return { ok: true, data };
  } catch (error) {
    return fail(error);
  }
}

export async function removePayment(orderId: string): Promise<PaymentResult<{ orderId: string }>> {
  const user = await verifySession();
  if (user.role !== "admin") return { ok: false, error: FORBIDDEN };
  try {
    const data = await deletePayment(user.id, orderId);
    revalidatePath("/", "layout");
    return { ok: true, data };
  } catch (error) {
    return fail(error);
  }
}