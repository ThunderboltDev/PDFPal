"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren, useState } from "react";
import SuperJSON from "superjson";
import { trpc } from "@/app/_trpc/client";

export default function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`,
					transformer: SuperJSON,
					maxURLLength: 2000,
					maxItems: 1,
				}),
			],
		}),
	);

	return (
		<SessionProvider>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<MotionConfig reducedMotion="user">{children}</MotionConfig>
				</QueryClientProvider>
			</trpc.Provider>
		</SessionProvider>
	);
}
