import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(254, "Email terlalu panjang"),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi")
    .max(200, "Kata sandi terlalu panjang"),
});

export type LoginValues = z.infer<typeof loginSchema>;