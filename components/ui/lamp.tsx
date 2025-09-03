"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LampProps {
  children: ReactNode;
  className?: string;
}

export function Lamp({ children, className }: LampProps) {
  return (
    <div className={cn("relative w-full z-0 overflow-hidden", className)}>
      <div className="relative flex w-full items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.35,
            duration: 1,
            ease: "easeOut",
          }}
          className="absolute inset-auto z-50 h-[20rem] w-[32rem] rounded-full bg-cyan-300 opacity-50 blur-3xl"
        />
        <motion.div
          initial={{ width: "0rem" }}
          whileInView={{ width: "16rem" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.35,
            duration: 1,
            ease: "easeOut",
          }}
          className="absolute inset-auto z-30 h-36 w-64 rounded-full bg-cyan-400/80 blur-2xl"
        />
        <motion.div
          initial={{ width: "0rem" }}
          whileInView={{ width: "32rem" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.35,
            duration: 1,
            ease: "easeOut",
          }}
          className="absolute inset-auto z-50 h-1 w-[32rem] bg-cyan-400"
        />

        <div className="absolute inset-auto z-40 h-44 w-full bg-white -translate-y-[5.5rem] "></div>
      </div>

      <div className="relative z-50">{children}</div>
    </div>
  );
}
