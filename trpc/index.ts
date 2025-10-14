import { authRouter } from "@/trpc/routers/auth";
import { chatRouter } from "@/trpc/routers/chat";
import { contactRouter } from "@/trpc/routers/contact";
import { filesRouter } from "@/trpc/routers/files";
import { subscriptionRouter } from "@/trpc/routers/subscription";
import { userRouter } from "@/trpc/routers/user";
import { router } from "@/trpc/trpc";

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	chat: chatRouter,
	file: filesRouter,
	contact: contactRouter,
	subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
