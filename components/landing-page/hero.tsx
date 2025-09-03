"use client";

import { SendHorizonal } from "lucide-react";

import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { Lamp } from "@/components/ui/lamp";

export default function Hero() {
  return (
    <Lamp className="pt-20">
      <motion.section
        initial={{ opacity: 0, filter: "blur(5px)", y: "33vh" }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: "-40px" }}
        viewport={{ once: true }}
        transition={{
          delay: 0.5,
          duration: 0.75,
          ease: "easeIn",
        }}
        className="container-6xl h-view flex flex-col items-center justify-center text-center"
      >
        <h1 className="max-w-4xl">
          Chat with your{" "}
          <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary contrast-150 bg-size-[300%,100%] animate-bg-position-x">
            documents
          </span>{" "}
          in seconds!
        </h1>
        <p className="mt-5 text-secondary-foreground sm:text-lg">
          Ask questions, summarize, and extract info from PDFs — no setup
          required
        </p>
        <div>
          <LinkButton
            href="/dashboard"
            variant="accent"
            size="lg"
            className="mt-5 px-8 rounded-full font-semibold shine bevel shadow-md shadow-accent/25 animate-float"
          >
            Start Chatting <SendHorizonal strokeWidth={3} />
          </LinkButton>
          <p className="mt-3 text-xs text-muted-foreground">
            Free - No credit card required
          </p>
        </div>
      </motion.section>
    </Lamp>
  );
}
