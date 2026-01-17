import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import type { SoftwareApplication, WithContext } from "schema-dts";
import { JsonLd } from "@/components/seo/json-ld";
import { config } from "@/config";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import Pricing from "./pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore PDF Pal's pricing plans: Free and Pro. Choose the plan that fits your PDF AI needs.",
  keywords: [
    "PDF Pal pricing",
    "PDF Pal plans",
    "PDF Pal subscription",
    "PDF Pal free plan",
    "PDF Pal Pro plan",
  ],
  alternates: {
    canonical: "/pricing",
  },
};

export default async function PricingWrapper() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const productJsonLd: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.name,
    description: config.description,
    image: `${config.url}${config.logo.url}`,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        price: config.plans.free.price.monthly,
        priceCurrency: config.plans.free.currency,
      },
      {
        "@type": "Offer",
        price: config.plans.pro.price.monthly,
        priceCurrency: config.plans.pro.currency,
      },
    ],
  };

  if (!session) {
    return (
      <>
        <JsonLd<SoftwareApplication> data={productJsonLd} />
        <Pricing isAuthenticated={false} isSubscribed={false} userId={null} />
      </>
    );
  }

  const user = await db.query.user.findFirst({
    where: eq(usersTable.id, session.user.id),
    columns: {
      currentPeriodEnd: true,
    },
  });

  const isSubscribed =
    !!user?.currentPeriodEnd && user.currentPeriodEnd > new Date();

  return (
    <>
      <JsonLd<SoftwareApplication> data={productJsonLd} />
      <Pricing
        isAuthenticated={!!session}
        isSubscribed={isSubscribed}
        userId={session.user.id}
      />
    </>
  );
}
