import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

const t = initTRPC.create({
  transformer: superjson,
});

export const isAuthenticated = t.middleware(async (opts) => {
  const session = await getServerSession();

  if (!session || !session.user?.email)
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const user = await db.user.findFirst({
    where: {
      email: session.user?.email,
    },
  });

  return opts.next({
    ctx: {
      userId: user?.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
