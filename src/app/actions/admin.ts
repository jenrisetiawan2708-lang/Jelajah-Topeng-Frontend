"use server";

import { AuthorizationError, requireAdmin } from "@/lib/dal";

export type AdminActionResult =
  | { ok: true; message: string }
  | { ok: false; error: "FORBIDDEN" };

export async function runAdminReport(): Promise<AdminActionResult> {
  try {
    const admin = await requireAdmin();
    return { ok: true, message: `Aksi admin diizinkan untuk ${admin.email}.` };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { ok: false, error: "FORBIDDEN" };
    }
    throw error;
  }
}
