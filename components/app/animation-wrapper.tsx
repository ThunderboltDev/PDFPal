"use client";

import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AnimationWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const path = usePathname();
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          key={path}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          style={{ height: "100%", transform: "none", filter: "none" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
