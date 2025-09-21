import { router } from "@/trpc/trpc";
import { contactRouter } from "@/trpc/routers/contact";
import { authRouter } from "@/trpc/routers/auth";
import { chatRouter } from "@/trpc/routers/chat";
import { filesRouter } from "@/trpc/routers/files";
import { subscriptionRouter } from "@/trpc/routers/subscription";

export const appRouter = router({
  auth: authRouter,
  chat: chatRouter,
  file: filesRouter,
  contact: contactRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
