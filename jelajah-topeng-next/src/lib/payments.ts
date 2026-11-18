import "server-only";
import { updateTag } from "next/cache";
import { apiFetch } from "@/lib/api";
import type { PaymentDTO } from "@/lib/payment-schema";

// Tag harus sama persis dengan yang dipakai di src/lib/page-data.ts.
const summaryTag = (userId: string) => `summary-${userId}`;

// GET /api/payments
export function listPayments(userId: string) {
  return apiFetch<PaymentDTO[]>("/payments", userId);
}

// POST /api/payments/checkout -> BE membuat transaksi Midtrans Snap
export async function createCheckout(
  userId: string,
  input: { amount: number; itemName: string; customerName?: string; customerEmail?: string },
) {
  const payment = await apiFetch<PaymentDTO>("/payments/checkout", userId, {
    method: "POST",
    body: JSON.stringify(input),
  });
  updateTag(summaryTag(userId)); // angka dashboard ikut berubah
  return payment;
}

// GET /api/payments/:orderId/status -> BE menanyakan status langsung ke Midtrans
export async function syncPayment(userId: string, orderId: string) {
  const payment = await apiFetch<PaymentDTO>(
    `/payments/${encodeURIComponent(orderId)}/status`,
    userId,
  );
  updateTag(summaryTag(userId)); // status bisa berubah (pending -> settlement)
  return payment;
}

// DELETE /api/payments/:orderId
export async function deletePayment(userId: string, orderId: string) {
  const result = await apiFetch<{ orderId: string }>(
    `/payments/${encodeURIComponent(orderId)}`,
    userId,
    { method: "DELETE" },
  );
  updateTag(summaryTag(userId));
  return result;
}