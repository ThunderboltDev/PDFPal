import { LinkButton } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import withAuth, { PropsWithDbUser } from "@/hoc/with-auth";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import UpgradeButton from "./upgrade-button";
import { pricingItems } from "@/types/pricing";

function Pricing({ dbUser }: PropsWithDbUser) {
  return (
    <div className="mb-8 mt-24 text-center max-w-5xl">
      <div className="mx-auto mb-10 sm:max-w-lg">
        <h1>Pricing</h1>
        <p className="mt-5 text-muted-foreground sm:text-lg">
          Whether you&apos;re just trying out our service or need more,
          we&apos;ve got you covered!
        </p>

        <div className="pt-12 mx-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {pricingItems.map(({ plan, price, tagline, quota, features }) => (
            <div
              key={plan}
              className={cn("relative rounded-2xl bg-white shadow-lg", {
                "border-2 border-primary shadow-primary": plan === "Pro",
                "border border-gray-200": plan !== "Pro",
              })}
            >
              {plan === "Pro" && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary to-indigo-600 px-3 py-2 text-sm font-medium text-white">
                  Upgrade Now!
                </div>
              )}

              <div className="p-5">
                <h3 className="my-3 text-center text-3xl font-bold">{plan}</h3>
                <p className="text-muted-foreground">{tagline}</p>

                <p className="my-5 font-bold text-6xl">${price}</p>
                <p className="text-muted-foreground">/month</p>
              </div>

              <div className="flex h-20 items-center justify-center border-y border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-1">
                  <p>{quota} PDFs included</p>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="cursor-help ml-1.5">
                      <HelpCircle className="size-4 text-shadow-zinc-700" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      How many PDFs you can upload per month
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <ul className="my-10 space-y-3 px-8">
                {features.map(({ text, footnote, negative }) => (
                  <li
                    key={text}
                    className="flex space-x-5"
                  >
                    <div className="flex shrink-0">
                      {negative ? (
                        <Minus className="size-6 text-red-500" />
                      ) : (
                        <Check className="size-6 text-green-500" />
                      )}
                    </div>
                    {footnote ? (
                      <div className="flex items-center space-x-1">
                        <p
                          className={cn("text-foreground/90", {
                            "text-muted-foreground": negative,
                          })}
                        >
                          {text}
                        </p>

                        <Tooltip delayDuration={300}>
                          <TooltipTrigger className="cursor-help ml-1.5">
                            <HelpCircle className="size-4 text-shadow-zinc-700" />
                          </TooltipTrigger>
                          <TooltipContent className="w-80 p-2">
                            {footnote}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) : (
                      <p
                        className={cn("text-foreground/90", {
                          "text-muted-foreground": negative,
                        })}
                      >
                        {text}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200" />
              <div className="p-5">
                {plan === "Free" ? (
                  <LinkButton
                    href={dbUser ? "/dashboard" : "/sign-in"}
                    variant="default"
                    className="w-full"
                  >
                    {dbUser ? "Dashboard" : "Sign up"}
                    <ArrowRight className="size-5 ml-1.5" />
                  </LinkButton>
                ) : dbUser ? (
                  <UpgradeButton></UpgradeButton>
                ) : (
                  <LinkButton
                    href="/sign-in"
                    variant="default"
                    className="w-full"
                  >
                    {dbUser ? "Upgrade Now" : "Sign up"}
                    <ArrowRight className="size-5 ml-1.5" />
                  </LinkButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(Pricing);
