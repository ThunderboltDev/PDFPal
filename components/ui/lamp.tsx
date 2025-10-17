"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LampProps {
  children: ReactNode;
  className?: string;
}

export function Lamp({ children, className }: LampProps) {
  return (
    <div className={cn("relative z-0 w-full overflow-hidden", className)}>
      <div className="relative isolate z-0 flex w-full items-center justify-center">
        <motion.div
          className="absolute inset-auto z-50 h-[20rem] w-[32rem] rounded-full bg-cyan-300 opacity-50 blur-3xl"
          initial={{ opacity: 0 }}
          transition={{
            delay: 0.35,
            duration: 1,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          whileInView={{ opacity: 0.5 }}
        />
        <motion.div
          className="absolute inset-auto z-30 h-36 w-64 rounded-full bg-cyan-400/80 blur-2xl"
          initial={{ width: "0rem" }}
          transition={{
            delay: 0.35,
            duration: 1,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          whileInView={{ width: "16rem" }}
        />
        <motion.div
          className="absolute inset-auto z-50 h-1 w-[32rem] bg-cyan-400"
          initial={{ width: "0rem" }}
          transition={{
            delay: 0.35,
            duration: 1,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          whileInView={{ width: "32rem" }}
        />

        <div className="-translate-y-[5.5rem] absolute inset-auto z-40 h-44 w-full bg-background" />
      </div>

      <div className="relative z-50">{children}</div>
    </div>
  );
}
