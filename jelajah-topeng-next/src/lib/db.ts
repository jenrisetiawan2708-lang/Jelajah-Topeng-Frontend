import "server-only";
import { PrismaClient } from "@prisma/client";

// Satu instance PrismaClient saja (hindari banyak koneksi saat hot reload).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;