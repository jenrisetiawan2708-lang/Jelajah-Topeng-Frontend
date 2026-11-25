"use client";

import { useEffect } from "react";
import { markRead } from "@/lib/notification-read";

// Dipasang di halaman detail notifikasi: begitu dibuka, dianggap sudah dibaca.
export default function MarkNotificationRead({ id }: { id: string }) {
  useEffect(() => {
    markRead([id]);
  }, [id]);
  return null;
}