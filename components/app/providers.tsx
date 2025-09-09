"use client";

import SuperJSON from "superjson";
import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { httpBatchLink } from "@trpc/client";
import { Session } from "next-auth";

interface ProvidersProps {
  session: Session | null;
}

export default function Providers({
  children,
  session,
}: PropsWithChildren<ProvidersProps>) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
          transformer: SuperJSON,
          maxURLLength: 2000,
          maxItems: 1,
        }),
      ],
    })
  );

  return (
    <SessionProvider session={session}>
      <trpc.Provider
        client={trpcClient}
        queryClient={queryClient}
      >
        <QueryClientProvider client={queryClient}>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
}
