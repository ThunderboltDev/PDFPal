"use client";

import { motion } from "framer-motion";
import { Cpu, DollarSign, Wrench, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Easy & Intuitive",
    icon: Wrench,
    iconClass: "text-zinc-700 fill-gray-400 hover:fill-gray-400/75",
    description: "Sign up, upload your files and you're ready to go",
    whileHover: { rotate: 30 },
    transition: { type: "spring", stiffness: 300 },
  },
  {
    title: "Free to Start",
    icon: DollarSign,
    iconClass: "text-green-600",
    description: "It's free to use, no credit card required",
    whileHover: { rotateY: 360 },
    transition: { type: "spring", stiffness: 50 },
  },
  {
    title: "Instant Answers",
    icon: Zap,
    iconClass: "text-amber-700 fill-yellow-500",
    description: "Ask questions and get responses right away",
    whileHover: { rotate: 180 },
    transition: { type: "spring", stiffness: 100 },
  },
  {
    title: "Smart Processing",
    icon: Cpu,
    iconClass: "text-zinc-800 fill-sky-600/50 hover:fill-green-600/50",
    description: "Automatic file processing for seamless interaction",
    whileHover: { scale: 1.1 },
    transition: { type: "spring", stiffness: 200 },
  },
] as const;

export default function Features() {
  return (
    <div className="container-6xl my-12">
      <motion.div
        className="px-6 lg:px-8"
        initial={{ opacity: 0, y: "50%", filter: "blur(5px)" }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-center">
            Start chatting with your documents{" "}
            <span className="text-primary underline decoration-2 decoration-wavy underline-offset-2">
              in minutes!
            </span>
          </h2>
          <p className="mt-4 text-center text-gray-600 text-lg">
            Upload any PDF and start getting answers right away!
          </p>
        </div>
      </motion.div>
      <ul className="grid grid-cols-1 gap-8 py-10 xs:mx-2 sm:mx-4 md:grid-cols-2 md:gap-6">
        {features.map((feature) => (
          <motion.li
            className="relative z-1"
            initial={{
              opacity: 0,
              filter: "blur(5px)",
              y: "75%",
            }}
            key={feature.title}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileInView={{
              opacity: 1,
              filter: "blur(0px)",
              y: "0%",
            }}
          >
            <div className="hover:-translate-y-1 relative z-1 flex flex-col items-center space-y-2 rounded-md bg-secondary p-4 shadow-lg transition-all duration-300 ease-in hover:shadow-xl">
              <motion.div
                transition={feature.transition}
                whileHover={feature.whileHover}
                whileTap={feature.whileHover}
              >
                <feature.icon
                  className={cn("size-12 text-foreground", feature.iconClass)}
                  strokeWidth={1.5}
                />
              </motion.div>
              <h4>{feature.title}</h4>
              <p className="text-center text-secondary-foreground">
                {feature.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
