import type { ReactNode } from "react";
import { verifySession } from "@/lib/dal";

export const instant = false;

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await verifySession();
  return children;
}
