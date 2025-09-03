"use client";

import { ArrowRight, Check, HelpCircle, X } from "lucide-react";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LinkButton } from "@/components/ui/button";
import { PropsWithNullableDbUser } from "@/hoc/with-auth";
import { cn } from "@/lib/utils";

import UpgradeButton from "./upgrade-button";

type Feature = {
  id?: string;
  text: string;
  footnote?: string | null;
  available?: boolean;
  limit?: string | number;
};

type PricingItem = {
  id: string;
  name: string;
  tagline?: string;
  className?: string;
  quota?: number;
  price: number;
  available?: boolean;
  features: Feature[];
};

const pricingItems: PricingItem[] = [
  {
    id: "free-plan",
    name: "Free",
    tagline: "For light and personal use",
    className: "border border-secondary",
    quota: 5,
    price: 0,
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
    id: "pro-plan",
    name: "Pro",
    className: "border-gradient-5 animate-float",
    tagline: "For larger PDFs and higher quality",
    quota: 25,
    price: 9.99,
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

export default function Plans({ dbUser }: PropsWithNullableDbUser) {
  return (
    <div className="pt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
      {pricingItems.map(
        ({ id, name, className, price, tagline, quota, features }) => (
          <motion.div
            id={id}
            key={id}
            className={cn("rounded-2xl shadow-lg", className)}
            initial={{ scale: 0, y: -50 }}
            whileInView={{ scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
          >
            <div className="relative rounded-[14px] bg-white">
              {id === "pro-plan" && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary to-accent p-2 text-sm font-medium text-white bevel">
                  Upgrade Now!
                </div>
              )}

              <div className="p-5">
                <h2 className="my-3">{name}</h2>
                <p className="text-muted-foreground mb-4">{tagline}</p>
                <div>
                  <span className="font-bold text-5xl">${price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>

              <div className="flex h-14 items-center justify-center border-y border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-1">
                  <p>{quota} PDFs included</p>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help ml-1.5">
                      <HelpCircle className="size-4 text-shadow-zinc-700" />
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
                      {feature.footnote && (
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
                {name === "Free" ? (
                  <LinkButton
                    href={dbUser ? "/dashboard" : "/sign-in"}
                    variant="default"
                    className="w-full"
                  >
                    {dbUser ? "Dashboard" : "Sign up"}
                    <ArrowRight className="size-5 ml-1.5" />
                  </LinkButton>
                ) : dbUser ? (
                  <UpgradeButton />
                ) : (
                  <LinkButton
                    href="/sign-in"
                    variant="primary"
                    className="w-full"
                  >
                    {dbUser ? "Upgrade Now" : "Sign up"}
                    <ArrowRight className="size-5 ml-1.5" />
                  </LinkButton>
                )}
              </div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
