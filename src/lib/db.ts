import { PrismaClient } from "@prisma/client";
import { PaginatedResult } from "./types";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export async function getPaginatedResults<T>(
  modelDelegate: any,
  cursor: string | null | undefined,
  take: number = 10,
  orderBy: any = { createdAt: "desc" },
  where: any = {}
): Promise<PaginatedResult<T>> {
  const query: any = {
    take: take + 1, // Fetch one extra to determine if there's a next page
    orderBy,
    where,
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1; // Skip the cursor itself
  }

  const [data, total] = await Promise.all([
    modelDelegate.findMany(query),
    modelDelegate.count({ where }),
  ]);

  let nextCursor: string | null = null;
  if (data.length > take) {
    const nextItem = data.pop(); // Remove the extra item
    nextCursor = nextItem.id;
  }

  return {
    data,
    nextCursor,
    total,
  };
}
