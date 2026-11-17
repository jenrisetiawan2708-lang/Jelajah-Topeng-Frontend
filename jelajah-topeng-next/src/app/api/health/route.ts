import { fail, ok } from "@/lib/http/response";
import { getHealth } from "@/lib/services/health.service";

export async function GET() {
  try {
    return ok(getHealth());
  } catch {
    return fail("INTERNAL_ERROR", "Terjadi kesalahan pada server.", 500);
  }
}