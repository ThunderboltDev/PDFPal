"use client";

import { Cpu, DollarSign, Wrench, Zap } from "lucide-react";

import { motion } from "framer-motion";
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
    <section className="my-12 container-6xl">
      <motion.div
        initial={{ opacity: 0, y: "50%", filter: "blur(5px)" }}
        whileInView={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        className="px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            Start chatting with your documents{" "}
            <span className="text-primary underline underline-offset-2 decoration-2 decoration-wavy">
              in minutes!
            </span>
          </h2>
          <p className="mt-4 text-gray-600 text-center text-lg">
            Upload any PDF and start getting answers right away!
          </p>
        </div>
      </motion.div>
      <ul className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2 md:gap-6">
        {features.map((feature, index) => (
          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(5px)",
              y: "75%",
            }}
            whileInView={{
              opacity: 1,
              filter: "blur(0px)",
              y: "0%",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              ease: "easeOut",
            }}
            className="relative z-1"
            key={index}
          >
            <li className="relative z-1 flex flex-col items-center space-y-2 p-4 rounded-md bg-background shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in">
              <motion.div
                whileHover={feature.whileHover}
                transition={feature.transition}
              >
                <feature.icon
                  strokeWidth={1.5}
                  className={cn("size-12 text-foreground", feature.iconClass)}
                />
              </motion.div>
              <h4>{feature.title}</h4>
              <p className="text-secondary-foreground text-center">
                {feature.description}
              </p>
            </li>
          </motion.div>
        ))}
      </ul>
    </section>
  );
}
