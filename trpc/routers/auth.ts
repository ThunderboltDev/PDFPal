import { router, publicProcedure, createRateLimit } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";

export const authRouter = router({
  authCallback: publicProcedure
    .use(createRateLimit(9, 5 * 60, "auth-callback"))
    .query(async () => {
      const session = await auth();

      if (!session || !session.user?.email || !session.user?.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return { success: true };
    }),
});
