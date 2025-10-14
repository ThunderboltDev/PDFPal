import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { createRateLimit, publicProcedure, router } from "@/trpc/trpc";

export const authRouter = router({
	authCallback: publicProcedure
		.use(createRateLimit(9, 5 * 60, "auth-callback"))
		.query(async () => {
			const session = await auth();

			if (!session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}

			return { success: true };
		}),
});
