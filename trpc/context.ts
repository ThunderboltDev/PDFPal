import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const session = await auth();

  return {
    db,
    session,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
