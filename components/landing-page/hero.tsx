"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Lamp } from "@/components/ui/lamp";

export default function Hero() {
  return (
    <Lamp className="pt-20">
      <motion.div
        className="container-6xl flex h-view flex-col items-center justify-center text-center"
        initial={{ opacity: 0, filter: "blur(5px)", y: "33vh" }}
        transition={{
          delay: 0.5,
          duration: 0.75,
          ease: "easeIn",
        }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: "-40px" }}
      >
        <h1 className="max-w-4xl">
          Chat with your{" "}
          <span className="relative animate-bg-position-x bg-gradient-to-r bg-size-[300%,100%] from-primary via-accent to-primary bg-clip-text text-transparent contrast-150">
            documents
          </span>{" "}
          in seconds!
        </h1>
        <p className="mt-5 text-balance text-center text-secondary-foreground sm:text-lg">
          Ask questions, summarize, and extract info from PDFs — no setup
          required
        </p>
        <div>
          <LinkButton
            className="shine bevel mt-5 animate-float rounded-full px-8 font-semibold shadow-accent/25 shadow-md"
            href="/dashboard"
            size="lg"
            variant="accent"
            onClick={() =>
              sendGTMEvent({
                value: 1,
                event: "cta_click",
                place: "hero_section",
                button_name: "Start Chatting",
              })
            }
          >
            Start Chatting <SendHorizonal strokeWidth={3} />
          </LinkButton>
          <p className="mt-3 text-muted-foreground text-xs">
            Free - No credit card required
          </p>
        </div>
      </motion.div>
    </Lamp>
  );
}
