import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { apiFetch } from "@/lib/api";

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN" as const;

  constructor() {
    super("FORBIDDEN");
    this.name = "AuthorizationError";
  }
}

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    role: session.user.role,
  };
});

export async function requireAdmin() {
  const user = await verifySession();

  if (user.role !== "admin") {
    throw new AuthorizationError();
  }

  return user;
}

export type DashboardSummary = {
  visits: number;
  verifiedTickets: number;
  activeSessions: number;
  revenue: number;
  transactions: Array<{
    id: string;
    name: string;
    location: string;
    amount: string;
    status: string;
  }>;
  masterclasses: Array<{
    time: string;
    title: string;
    maestro: string;
    place: string;
  }>;
};

const emptySummary = (): DashboardSummary => ({
  visits: 0,
  verifiedTickets: 0,
  activeSessions: 0,
  revenue: 0,
  transactions: [],
  masterclasses: [],
});

// Angka ringkasan dihitung oleh BE dari database (GET /api/dashboard).
export async function getDashboardSummaryDTO(): Promise<DashboardSummary> {
  const user = await verifySession();

  if (user.role !== "admin") {
    return emptySummary();
  }

  try {
    return await apiFetch<DashboardSummary>("/dashboard", user.id);
  } catch (error) {
    console.error("Gagal mengambil ringkasan dashboard:", error);
    return emptySummary();
  }
}