import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// In development, if DATABASE_URL uses localhost and requires TLS, local PostgreSQL
// usually doesn't support it — use sslmode=disable so the app connects without TLS.
function getDatasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  if (
    process.env.NODE_ENV === "development" &&
    (url.includes("localhost") || url.includes("127.0.0.1")) &&
    url.includes("sslmode=require")
  ) {
    return url.replace("sslmode=require", "sslmode=disable");
  }
  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDatasourceUrl(),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
