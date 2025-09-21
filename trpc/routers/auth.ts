import { router, authProcedure } from "@/trpc/trpc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  authCallback: authProcedure.query(async () => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email || !session.user?.id)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    return { success: true };
  }),
});
