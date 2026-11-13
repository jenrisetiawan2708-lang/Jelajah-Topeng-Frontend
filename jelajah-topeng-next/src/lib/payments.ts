import "server-only";
import { apiFetch } from "@/lib/api";
import type { PaymentDTO } from "@/lib/payment-schema";

// GET /api/payments
export function listPayments(userId: string) {
  return apiFetch<PaymentDTO[]>("/payments", userId);
}

// POST /api/payments/checkout -> BE membuat transaksi Midtrans Snap
export function createCheckout(
  userId: string,
  input: { amount: number; itemName: string; customerName?: string; customerEmail?: string },
) {
  return apiFetch<PaymentDTO>("/payments/checkout", userId, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// GET /api/payments/:orderId/status -> BE menanyakan status langsung ke Midtrans
export function syncPayment(userId: string, orderId: string) {
  return apiFetch<PaymentDTO>(`/payments/${encodeURIComponent(orderId)}/status`, userId);
}

// DELETE /api/payments/:orderId
export function deletePayment(userId: string, orderId: string) {
  return apiFetch<{ orderId: string }>(`/payments/${encodeURIComponent(orderId)}`, userId, {
    method: "DELETE",
  });
}