import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api";
import { getDashboardSummaryDTO, requireAdmin } from "@/lib/dal";
import { getRecordsDTO } from "@/lib/records";
import { getRefundsDTO } from "@/lib/refunds";

type Summary = Awaited<ReturnType<typeof getDashboardSummaryDTO>>;

// CACHING (Next 16 cacheComponents): hasil ringkasan dashboard disimpan di cache.
// Durasi:
//  - stale 30 dtk   : klien boleh memakai salinan tanpa bertanya ke server
//  - revalidate 60  : lewat 1 menit, data diperbarui di belakang layar (ISR-like)
//  - expire 300 dtk : lewat 5 menit tanpa akses, cache dibuang total
// userId ikut jadi kunci cache, jadi data antar akun tidak tertukar.
async function fetchSummaryCached(userId: string) {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag(`summary-${userId}`);
  return apiFetch<Summary>("/dashboard", userId);
}

// Sesi dibaca di luar fungsi cache (cookie tidak boleh dibaca di dalam "use cache").
export const getSummary = cache(async () => {
  const user = await requireAdmin();
  return fetchSummaryCached(user.id);
});

// Data CRUD sengaja TIDAK di-cache lintas request: harus selalu segar setelah edit.
// cache() React hanya menghilangkan pemanggilan ganda dalam satu render.
export const getAllRecords = cache((userId: string) => getRecordsDTO(userId));
export const getAllRefunds = cache((userId: string) => getRefundsDTO(userId));