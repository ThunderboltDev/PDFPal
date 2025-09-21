import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions);

  return {
    db,
    session,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
