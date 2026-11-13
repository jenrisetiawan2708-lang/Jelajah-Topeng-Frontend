export type PaymentStatus = "pending" | "paid" | "failed" | "expired" | "refunded";

export type PaymentDTO = {
  id: string;
  orderId: string;
  itemName: string;
  amount: number;
  status: PaymentStatus;
  paymentType: string | null;
  snapToken: string;
  redirectUrl: string;
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
  updatedAt: string;
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Menunggu pembayaran",
  paid: "Lunas",
  failed: "Gagal",
  expired: "Kedaluwarsa",
  refunded: "Dikembalikan",
};