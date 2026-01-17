import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "@/db";
import { auth } from "@/lib/auth";

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    db,
    session,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
