import { dodopaymentsClient } from "@dodopayments/better-auth";
import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { url } from "@/config";

export const authClient = createAuthClient({
  baseURL: url,
  plugins: [magicLinkClient(), dodopaymentsClient()],
});

export const { signIn, signOut, useSession } = authClient;
