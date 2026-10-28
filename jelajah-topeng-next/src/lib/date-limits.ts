// Batas kalender: hari ini sampai 7 hari ke depan (zona WIB).
function wibDate(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
}

export const minDate = () => wibDate(0);
export const maxDate = () => wibDate(7);

export function dateError(value: string): string {
  if (!value) return "";
  if (value < minDate()) return "Tanggal tidak boleh sebelum hari ini";
  if (value > maxDate()) return "Tanggal maksimal 7 hari dari hari ini";
  return "";
}