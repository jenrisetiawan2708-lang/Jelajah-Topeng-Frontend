"use client";

import { useEffect } from "react";

// Tanggal WIB format YYYY-MM-DD, digeser sekian hari dari hari ini.
function wib(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
}

// Membatasi semua <input type="date"> ke hari ini sampai 7 hari ke depan.
// Input berlabel "Tahun" (tahun situs bersejarah) dilewati.
export default function DateLimiter() {
  useEffect(() => {
    const apply = () => {
      const min = wib(0);
      const max = wib(7);
      document
        .querySelectorAll<HTMLInputElement>('input[type="date"]')
        .forEach((el) => {
          const label =
            el.closest("label")?.textContent ??
            el.parentElement?.textContent ??
            "";
          if (/tahun/i.test(label)) return;
          if (el.min !== min) el.min = min;
          if (el.max !== max) el.max = max;
        });
    };

    apply();
    // Form muncul sebagai popup, jadi pantau elemen baru yang masuk.
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}