import type { ReactNode } from "react";
import ToastProvider from "@/components/ToastProvider";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}