import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createContext() {
  return {
    prisma,
  };
}

export type Context = ReturnType<typeof createContext> extends Promise<infer T>
  ? T
  : never;
