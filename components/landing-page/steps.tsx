"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CloudUpload,
  MessageCircleMore,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { LinkButton } from "../ui/button";

const steps = [
  {
    title: "Create an account",
    description: (
      <>
        Sign up using the <Link href="/pricing/#free-plan">Free Plan</Link> or
        choose <Link href="/pricing/#pro-plan">Pro Plan</Link> later.
      </>
    ),
    icon: UserPlus,
  },
  {
    title: "Upload your PDFs",
    description:
      "We'll process your file and make it ready for you to chat with",
    icon: CloudUpload,
  },
  {
    title: "Start chatting",
    description: "It doesn't get any simpler than that!",
    icon: MessageCircleMore,
  },
] as const;

export default function Steps() {
  return (
    <section className="container-3xl mt-6">
      <motion.div
        initial={{ opacity: 0, filter: "blur(5px)", y: "25%" }}
        transition={{
          duration: 0.75,
          ease: "easeOut",
        }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: "0" }}
      >
        <h2 className="text-center">Start right now for free</h2>
        <p className="mt-3 text-center text-muted-foreground">
          It only takes a minute to get started!
        </p>
      </motion.div>

      <ol className="my-8 space-y-4 pt-8 pb-12 md:flex md:space-x-8 md:space-y-0 lg:space-x-12">
        {steps.map((step, index) => (
          <motion.li
            className="md:flex-1"
            initial={{ opacity: 0, filter: "blur(10px)", x: "-100%" }}
            key={step.title}
            transition={{
              duration: 0.5,
              ease: "linear",
            }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, filter: "blur(0px)", x: "0" }}
          >
            <div className="flex flex-col space-y-2 border-border border-l-4 py-2 pl-4 hover:border-primary/80 md:border-t-2 md:border-l-0 md:pt-4 md:pb-0 md:pl-0">
              <span className="font-medium text-primary text-sm">
                Step {index + 1}
              </span>
              <div className="flex flex-row items-center gap-2">
                <step.icon className="aspect-square" />
                <h6 className="text-left font-semibold">{step.title}</h6>
              </div>
              <span className="mt-1 text-zinc-700 md:text-[15px]">
                {step.description}
              </span>
            </div>
          </motion.li>
        ))}
      </ol>
      <div className="flex flex-col items-center gap-3 text-center">
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className="inline-block"
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <LinkButton
            className="shine bevel rounded-full px-4 font-semibold"
            href="/dashboard"
            size="lg"
            variant="primary"
            onClick={() =>
              sendGTMEvent({
                value: 1,
                event: "cta_click",
                place: "steps_section",
                button_name: "Start for free",
                page_path: window.location.pathname,
              })
            }
          >
            Start for free <ArrowRight className="size-4.5" />
          </LinkButton>
        </motion.div>
        <p className="text-xs text-zinc-500">Free - No credit card required</p>
      </div>
    </section>
  );
}
