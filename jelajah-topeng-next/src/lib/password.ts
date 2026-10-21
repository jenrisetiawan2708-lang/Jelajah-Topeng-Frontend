import "server-only";
import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function verifyAdminPassword(password: string) {
  if (password.length < 12 || password.length > 256) return false;
  const encoded = process.env.ADMIN_PASSWORD_HASH ?? "";
  const [algorithm, salt, expectedHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  try {
    const expected = Buffer.from(expectedHex, "hex");
    if (expected.length !== 64) return false;
    const actual = (await scrypt(password, salt, expected.length)) as Buffer;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
