import "server-only";
import { apiFetch } from "@/lib/api";

type NotificationStatus = { id: string; read: boolean };

// Id notifikasi buatan admin ini yang belum dibaca penerimanya.
// Status baca berasal dari database backend (tabel notification_reads).
export async function getUnreadNotificationIds(userId: string): Promise<string[]> {
  try {
    const rows = await apiFetch<NotificationStatus[]>("/notifications/status", userId);
    return rows.filter((r) => !r.read).map((r) => r.id);
  } catch (error) {
    console.error("Gagal mengambil status notifikasi:", error);
    return [];
  }
}