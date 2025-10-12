"use client";

import { Check, HelpCircle, LayoutDashboard, UserPlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpgradeButton } from "@/components/upgrade-button";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import config from "@/config";

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
    <div className="mb-16 mt-20 px-2 sm:px-4 container-5xl">
      <h1 className="sm:text-center">Pricing</h1>
      <p className="mt-2 sm:mb-6 text-muted-foreground sm:text-lg sm:text-center">
        Whether you&apos;re just trying out our service or need more, we&apos;ve
        got you covered!
      </p>

      <div className="mt-6 mb-4 flex flex-col gap-1.5 items-center justify-center">
        <div className="relative flex rounded-full bg-secondary shadow-xs p-1">
          {(["monthly", "yearly"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              aria-pressed={billingPeriod === period}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 rounded-full text-sm px-4 py-1.5 md:text-base md:px-6 font-medium transition-colors",
                billingPeriod === period
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              )}
            >
              {billingPeriod === period && (
                <motion.div
                  layoutId="billingPill"
                  className="absolute inset-0 rounded-full bg-linear-60 from-primary to-accent shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  aria-hidden
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {period === "monthly" ? "Monthly" : "Yearly"}
              </span>
            </button>
          ))}
        </div>
        <p className="text-center mt-1 text-sm text-muted-foreground">
          Save 16% when billed yearly
        </p>
      </div>

      <main
        id="plans"
        className="pt-6 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16"
      >
        {pricingItems.map(
          ({ id, name, className, price, tagline, maxFiles, features }) => (
            <motion.div
              id={id}
              key={id}
              className={cn("rounded-2xl", className)}
              initial={{ scale: 0.75, y: -50 }}
              whileInView={{ scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
            >
              <div className="relative text-center bg-secondary rounded-[14px] shadow-2xl">
                {id === "pro" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-linear-145 from-primary to-accent p-2 text-sm text-center font-medium text-white bevel shadow-md">
                    Most Popular!
                  </div>
                )}

                <div className="p-5">
                  <h1 className="my-3">{name}</h1>
                  <p className="text-muted-foreground mb-4">{tagline}</p>
                  <p className="font-bold text-5xl">${price[billingPeriod]}</p>
                  <p className="text-muted-foreground">
                    /{billingPeriod === "monthly" ? "mo" : "year"}
                  </p>
                </div>

                <div className="flex h-14 items-center justify-center border-y border-gray-300 bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>{maxFiles} PDFs included</p>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help ml-1.5">
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
                      key={feature.text}
                      className="flex space-x-3"
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
                            <TooltipTrigger className="cursor-help ml-1.5">
                              <HelpCircle className="size-4 text-secondary-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>{feature.footnote}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200" />
                <div className="p-5">
                  {isAuthenticated ? (
                    name === "Free" ? (
                      <LinkButton
                        variant="muted"
                        href="/dashboard"
                        className="min-w-full rounded-full"
                      >
                        <LayoutDashboard />
                        Dashboard
                      </LinkButton>
                    ) : (
                      <UpgradeButton
                        isSubscribed={isSubscribed}
                        className="min-w-full rounded-full"
                      />
                    )
                  ) : (
                    <LinkButton
                      href="/sign-in"
                      variant="primary"
                      className="w-full rounded-full"
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
