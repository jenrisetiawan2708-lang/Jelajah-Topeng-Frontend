import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../auth";

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

// Wireframe tidak menyediakan angka kunjungan, transaksi, tiket,
// atau pendapatan yang dapat dipakai untuk ringkasan admin.
const wireframeSummary: DashboardSummary = {
  visits: 0,
  verifiedTickets: 0,
  activeSessions: 0,
  revenue: 0,
  transactions: [],
  masterclasses: [
    {
      time: "22 Oktober 2026 · 14.00 WIB",
      title: "Latihan Tari Topeng: Gerakan Dasar",
      maestro: "Belum dicantumkan",
      place: "Belum dicantumkan",
    },
    {
      time: "20 Oktober 2026",
      title: "Pertunjukan Malam Maestro",
      maestro: "Belum dicantumkan",
      place: "Kampung Budaya Polowijen",
    },
  ],
};

const limitedUserSummary: DashboardSummary = {
  visits: 0,
  verifiedTickets: 0,
  activeSessions: 0,
  revenue: 0,
  transactions: [],
  masterclasses: [],
};

export async function getDashboardSummaryDTO(): Promise<DashboardSummary> {
  const user = await verifySession();

  if (user.role !== "admin") {
    return { ...limitedUserSummary };
  }

  return {
    ...wireframeSummary,
    transactions: [...wireframeSummary.transactions],
    masterclasses: [...wireframeSummary.masterclasses],
  };
}
