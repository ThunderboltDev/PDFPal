"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { MotionConfig } from "framer-motion";
import { type PropsWithChildren, useState } from "react";
import SuperJSON from "superjson";
import { trpc } from "@/app/_trpc/client";
import { config, url } from "@/config";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${url}/api/trpc`,
          async fetch(input, init) {
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
          transformer: SuperJSON,
          maxURLLength: 2000,
          maxItems: 1,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          <GoogleTagManager gtmId={config.gtmId} />
          {children}
        </MotionConfig>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
