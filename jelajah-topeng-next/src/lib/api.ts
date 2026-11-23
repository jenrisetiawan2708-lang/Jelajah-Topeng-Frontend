import "server-only";
import { SignJWT } from "jose";

const API_URL = process.env.API_URL ?? "http://localhost:5050/api";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

// Semua admin web memakai SATU pemilik data (sama dengan yang dibaca mobile).
// Kalau CONTENT_OWNER_ID tidak diisi, pakai id sesi seperti sebelumnya.
const OWNER_ID = process.env.CONTENT_OWNER_ID?.trim();

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

// Token pendek (5 menit), ditandatangani rahasia yang sama dengan BE.
// Pemanggil harus sudah memastikan user ini admin.
async function makeToken(userId: string) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(OWNER_ID || userId)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);
}

export async function apiFetch<T>(
  path: string,
  userId: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await makeToken(userId);
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.message ?? "Permintaan ke API gagal",
      body?.errors,
    );
  }
  return (body?.data ?? body) as T;
}
