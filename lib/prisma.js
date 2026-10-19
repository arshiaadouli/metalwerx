import "server-only";
import { PrismaClient } from "@prisma/client";

// Reuse one client across dev hot reloads, which would otherwise open a new
// connection pool every time a file is saved.
const prisma = globalThis.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
