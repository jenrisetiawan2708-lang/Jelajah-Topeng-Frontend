"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

const UnreadContext = createContext<Set<string>>(new Set());

// Berisi id notifikasi yang belum dibaca penerimanya (data dari server).
export function UnreadNotificationsProvider({
  ids,
  children,
}: {
  ids: string[];
  children: ReactNode;
}) {
  const value = useMemo(() => new Set(ids), [ids]);
  return <UnreadContext.Provider value={value}>{children}</UnreadContext.Provider>;
}

export function useUnreadNotificationIds() {
  return useContext(UnreadContext);
}