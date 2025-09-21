import { initTRPC, TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import superjson from "superjson";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { User } from "@prisma/client";
import { db } from "@/lib/db";

const redis = Redis.fromEnv();

const t = initTRPC
  .context<{
    session: Session | null;
    user?: User;
    req?: Request;
  }>()
  .create({
    transformer: superjson,
  });

export function createRateLimit(max: number, durationSeconds: number) {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(max, `${durationSeconds} s`),
  });

  return t.middleware(async ({ ctx, next }) => {
    const identifier =
      ctx.session?.user.id ??
      ctx.user?.id ??
      ctx.req?.headers.get("x-forwarded-for") ??
      "anon";
    const { success } = await limiter.limit(identifier);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please try again later.",
      });
    }

    return next();
  });
}

export const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || !ctx.session.user.id)
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const user = await db.user.findUnique({
    where: {
      id: ctx.session.user?.id,
    },
  });

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      userId: user?.id,
      user,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);

export const authProcedure = publicProcedure.use(createRateLimit(3, 60));
export const contactProcedure = publicProcedure.use(createRateLimit(1, 86400));

export const chatProcedure = privateProcedure.use(createRateLimit(25, 60));
export const filesProcedure = privateProcedure.use(createRateLimit(10, 5 * 60));
export const subscriptionProcedure = privateProcedure.use(
  createRateLimit(1, 60)
);
