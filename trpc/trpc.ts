import { initTRPC, TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Session, User } from "better-auth";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { db } from "@/db";
import { usersTable } from "@/db/schema";

const redis = Redis.fromEnv();

const t = initTRPC
  .context<{
    session: {
      session: Session;
      user: User;
    } | null;
    user?: User;
    req?: Request;
  }>()
  .create({
    transformer: superjson,
  });

export function createRateLimit(
  max: number,
  durationSeconds: number,
  routeName?: string,
  message?: string
) {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${durationSeconds} s`),
  });

  return t.middleware(async ({ ctx, next, path }) => {
    const identifier =
      ctx.session?.user?.id ??
      ctx.user?.id ??
      ctx.req?.headers.get("x-forwarded-for") ??
      "anon";

    const key = `${routeName ?? path}:${identifier}`;

    const { success } = await limiter.limit(key);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: message ?? "Rate limit exceeded. Please try again later.",
      });
    }

    return next();
  });
}

export const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await db.query.user.findFirst({
    where: eq(usersTable.id, ctx.session.user.id),
  });

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
