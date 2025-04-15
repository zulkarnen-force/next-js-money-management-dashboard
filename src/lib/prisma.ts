// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient({
  log: ["query"], // optional: logs SQL queries
});
