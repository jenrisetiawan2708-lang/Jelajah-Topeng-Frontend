import { CONTENT_PROFILES, type RecordKind } from "@/lib/content-config";

// Aturan tampilan field tanggal, dipakai form dan halaman detail.
export function getRecordLayout(kind: RecordKind) {
  const profile = CONTENT_PROFILES[kind];
  const yearAsDate = profile.fields[3] === "Tahun";
  const dateLabel = yearAsDate ? "Tanggal" : profile.fields[3];
  const extraDate =
    kind !== "panji" && !yearAsDate && !profile.fields.includes("Tanggal");
  const isDateInput = yearAsDate || profile.fields[3] === "Tanggal";
  return { profile, yearAsDate, dateLabel, extraDate, isDateInput };
}
