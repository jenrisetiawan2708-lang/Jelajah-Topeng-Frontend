export const LOCAL_ADMIN_KEY = "jelajah-topeng:local-admin";
export const LOCAL_SESSION_KEY = "jelajah-topeng:local-session";

const configuredAdminEmail = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")[0]
  ?.trim()
  .toLowerCase();

export const LOCAL_ADMIN_EMAIL = configuredAdminEmail || "rajaesa@gmail.com";

export async function hashLocalPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
