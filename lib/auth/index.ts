import {
  checkout,
  dodopayments,
  portal,
  usage,
  webhooks,
} from "@dodopayments/better-auth";
import { render } from "@react-email/render";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import DodoPayments from "dodopayments";
import { eq } from "drizzle-orm";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { config, isDev, url } from "@/config";
import { db } from "@/db";
import { schema, usersTable } from "@/db/schema";
import { brand } from "@/emails/config";
import MagicLinkEmail from "@/emails/magic-link";

const resend = new Resend(process.env.RESEND_API_KEY);

export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: isDev ? "test_mode" : "live_mode",
});

if (!process.env.AUTH_GOOGLE_ID) {
  throw new Error("AUTH_GOOGLE_ID is not set");
}

if (!process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("AUTH_GOOGLE_SECRET is not set");
}

if (!process.env.AUTH_GITHUB_ID) {
  throw new Error("AUTH_GITHUB_ID is not set");
}

if (!process.env.AUTH_GITHUB_SECRET) {
  throw new Error("AUTH_GITHUB_SECRET is not set");
}

if (!process.env.DODO_PAYMENTS_API_KEY) {
  throw new Error("DODO_PAYMENTS_API_KEY is not set");
}

if (!process.env.DODO_PAYMENTS_WEBHOOK_SECRET) {
  throw new Error("DODO_PAYMENTS_WEBHOOK_SECRET is not set");
}

export const auth = betterAuth({
  appName: "PDFPal",
  baseURL: url,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    },
    github: {
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    },
  },
  plugins: [
    dodopayments({
      client: dodoPayments,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: config.plans.pro.productId.monthly,
              slug: "pro-monthly",
            },
            {
              productId: config.plans.pro.productId.yearly,
              slug: "pro-yearly",
            },
          ],
          successUrl: "/thank-you",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET,
          async onPayload({ type, data }) {
            if (type === "subscription.updated") {
              const userId: string = data.metadata?.referenceId;

              const user = await db.query.user.findFirst({
                where: eq(usersTable.id, userId),
                columns: {
                  customerId: true,
                  subscriptionId: true,
                  currentPeriodEnd: true,
                },
              });

              if (!user) {
                return;
              }

              await db
                .update(usersTable)
                .set({
                  subscriptionId: data.subscription_id,
                  customerId: data.customer.customer_id,
                  currentPeriodEnd: data.cancelled_at ?? data.next_billing_date,
                })
                .where(eq(usersTable.id, userId));
            }
          },
        }),
      ],
    }),
    magicLink({
      sendMagicLink: async ({ url: magicLinkUrl, email }) => {
        const emailHtml = await render(
          MagicLinkEmail({ url: magicLinkUrl }) as ReactElement
        );

        const emailText = await render(
          MagicLinkEmail({ url: magicLinkUrl }) as ReactElement,
          { plainText: true }
        );

        await resend.emails.send({
          from: `"${brand.name}" <${process.env.RESEND_FROM_EMAIL as string}>`,
          to: email,
          subject: `Sign in to ${brand.name}`,
          html: emailHtml,
          text: emailText,
        });
      },
      expiresIn: 60 * 60,
    }),
  ],
  onAPIError: {
    errorURL: "/auth",
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://pdfpal.thunderboltdev.site",
  ],
});
