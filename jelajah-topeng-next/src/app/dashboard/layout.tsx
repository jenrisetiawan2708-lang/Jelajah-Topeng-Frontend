import type { ReactNode } from "react";
import { verifySession } from "@/lib/dal";
import ToastProvider from "@/components/ToastProvider";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await verifySession();
  return <ToastProvider>{children}</ToastProvider>;
}