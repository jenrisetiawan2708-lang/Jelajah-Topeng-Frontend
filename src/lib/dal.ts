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
  if (!session?.user?.id) redirect("/login");
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    role: session.user.role,
  };
});

export async function requireAdmin() {
  const user = await verifySession();
  if (user.role !== "admin") throw new AuthorizationError();
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

// Demo source data: only aggregate fields are returned to the dashboard.
const demoAdminSummary: DashboardSummary = {
  visits: 24580,
  verifiedTickets: 1824,
  activeSessions: 42,
  revenue: 148600000,
  transactions: [
    { id: "#TRX-2024-889", name: "SMA Taruna Nusantara", location: "Kampung Topeng Malang", amount: "Rp3.600.000", status: "Terverifikasi" },
    { id: "#TRX-2024-890", name: "Dr. Helena Meyer", location: "Sanggar Cirebon Slangit", amount: "Rp850.000", status: "Menunggu" },
    { id: "#TRX-2024-882", name: "Komunitas Tari Sekar", location: "Sentra Topeng Kayu Bobung", amount: "Rp2.450.000", status: "Terverifikasi" },
    { id: "#TRX-2024-891", name: "Bpk. Bambang Sutrisno", location: "Padepokan Klaten Panji", amount: "Rp600.000", status: "Terverifikasi" },
  ],
  masterclasses: [
    { time: "09:00", title: "Pahat Karakter Wajah Panji", maestro: "Ki Suwito", place: "Kampung Topeng Malang" },
    { time: "13:00", title: "Sungging Alami Pigmen Getah", maestro: "Mbah Rasimun", place: "Padepokan Klaten Panji" },
    { time: "15:30", title: "Koreografi Tari Panji", maestro: "Dra. Endang", place: "Sanggar Cirebon" },
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
  return user.role === "admin" ? { ...demoAdminSummary } : { ...limitedUserSummary };
}
