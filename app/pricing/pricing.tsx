"use client";

import { motion } from "framer-motion";
import { Check, HelpCircle, LayoutDashboard, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpgradeButton } from "@/components/upgrade-button";
import config from "@/config";
import { cn } from "@/lib/utils";

const plans = config.plans;

const pricingItems = [
  {
    ...plans.free,
    className: "",
    tagline: "For light and personal use",
    features: [
      {
        text: "5 pages per PDF",
        footnote: "Maximum pages processed per PDF file",
        available: true,
      },
      {
        text: "4MB file size limit",
        footnote: "Maximum size per PDF file",
        available: true,
      },
      {
        text: "Unlimited Chats",
        available: true,
      },
      {
        text: "Standard AI",
        footnote: "Uses default model context window when chatting",
        available: true,
      },
      {
        text: "Higher-quality responses",
        footnote: "Enhanced responses and higher token limit",
        available: false,
      },
    ],
  },
  {
    ...plans.pro,
    className: "border-gradient-5",
    tagline: "For larger PDFs and higher quality",
    features: [
      {
        text: "25 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file",
        available: true,
      },
      {
        text: "16MB file size limit",
        footnote: "The maximum file size of a single PDF file",
        available: true,
      },
      {
        text: "Unlimited Chats",
        available: true,
      },
      {
        text: "Advanced AI",
        footnote: "Uses a wider context window when chatting",
        available: true,
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses and higher token limit",
        available: true,
      },
    ],
  },
] as const;

interface PlansProps {
  isAuthenticated: boolean;
  isSubscribed: boolean;
}

export default function Pricing({ isAuthenticated, isSubscribed }: PlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <div className="container-5xl mt-20 mb-16 px-2 sm:px-4">
      <h1 className="sm:text-center">Pricing</h1>
      <p className="mt-2 text-muted-foreground sm:mb-6 sm:text-center sm:text-lg">
        Whether you&apos;re just trying out our service or need more, we&apos;ve
        got you covered!
      </p>

      <div className="mt-6 mb-4 flex flex-col items-center justify-center gap-1.5">
        <div className="relative flex rounded-full bg-secondary p-1 shadow-xs">
          {(["monthly", "yearly"] as const).map((period) => (
            <button
              type="button"
              aria-pressed={billingPeriod === period}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-1.5 font-medium text-sm transition-colors md:px-6 md:text-base",
                billingPeriod === period
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              )}
              key={period}
              onClick={() => setBillingPeriod(period)}
            >
              {billingPeriod === period && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-linear-60 from-primary to-accent shadow-sm"
                  layoutId="billingPill"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {period === "monthly" ? "Monthly" : "Yearly"}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-1 text-center text-muted-foreground text-sm">
          Save 16% when billed yearly
        </p>
      </div>

      <main
        className="grid grid-cols-1 gap-10 pt-6 md:grid-cols-2 lg:gap-16"
        id="plans"
      >
        {pricingItems.map(
          ({ id, name, className, price, tagline, maxFiles, features }) => (
            <motion.div
              className={cn("rounded-2xl", className)}
              id={`${id}-plan`}
              initial={{ scale: 0.75, y: -50 }}
              key={id}
              transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
              viewport={{ once: true, amount: 0.1 }}
              whileInView={{ scale: 1, y: 0 }}
            >
              <div className="relative rounded-[14px] bg-secondary text-center shadow-2xl">
                {id === "pro" && (
                  <div className="-top-5 bevel absolute right-0 left-0 mx-auto w-32 rounded-full bg-linear-145 from-primary to-accent p-2 text-center font-medium text-sm text-white shadow-md">
                    Most Popular!
                  </div>
                )}

                <div className="p-5">
                  <h1 className="my-3">{name}</h1>
                  <p className="mb-4 text-muted-foreground">{tagline}</p>
                  <p className="font-bold text-5xl">${price[billingPeriod]}</p>
                  <p className="text-muted-foreground">
                    /{billingPeriod === "monthly" ? "mo" : "year"}
                  </p>
                </div>

                <div className="flex h-14 items-center justify-center border-gray-300 border-y bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>{maxFiles} PDFs included</p>
                    <Tooltip>
                      <TooltipTrigger className="ml-1.5 cursor-help">
                        <HelpCircle className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        How many PDFs you can upload
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <ul className="my-8 space-y-3 px-8">
                  {features.map((feature) => (
                    <li
                      className="flex space-x-3"
                      key={feature.text}
                    >
                      <div className="flex shrink-0">
                        {feature.available ? (
                          <Check className="size-6 text-green-500" />
                        ) : (
                          <X className="size-6 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <p
                          className={
                            feature.available
                              ? "text-secondary-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {feature.text}
                        </p>
                        {"footnote" in feature && (
                          <Tooltip>
                            <TooltipTrigger className="ml-1.5 cursor-help">
                              <HelpCircle className="size-4 text-secondary-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>{feature.footnote}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-gray-200 border-t" />
                <div className="p-5">
                  {isAuthenticated ? (
                    name === "Free" ? (
                      <LinkButton
                        className="min-w-full rounded-full"
                        href="/dashboard"
                        variant="muted"
                      >
                        <LayoutDashboard />
                        Dashboard
                      </LinkButton>
                    ) : (
                      <UpgradeButton
                        className="min-w-full rounded-full"
                        isSubscribed={isSubscribed}
                      />
                    )
                  ) : (
                    <LinkButton
                      className="w-full rounded-full"
                      href="/auth?utm_source=pricing&utm_medium=button&utm_campaign=signup"
                      variant="primary"
                    >
                      <UserPlus />
                      Create an account
                    </LinkButton>
                  )}
                </div>
              </div>
            </motion.div>
          )
        )}
      </main>
    </div>
  );
}
