"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Cookie, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  acceptAllCookies,
  getConsentFromStorage,
  rejectAllCookies,
  updateCookieConsent,
} from "@/components/cookie-consent/cookie";
import { Button } from "@/components/ui/button";
import CookiePreferences from "./preferences";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = getConsentFromStorage();
    if (consent == null) {
      setIsVisible(true);
    } else {
      updateCookieConsent(consent);
    }
  }, []);

  const handleAcceptCookies = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleDeclineCookies = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  const containerVariants = {
    hidden: {
      y: 100,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.6,
      },
    },
    exit: {
      y: 100,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const iconVariants = {
    hover: {
      rotate: 15,
      transition: {
        type: "spring" as const,
        damping: 10,
        stiffness: 300,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-description"
        >
          <div className="mx-auto max-w-2xl">
            <motion.div
              className="relative bg-gradient-to-r from-background to-muted/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-2xl p-6"
              whileHover={{ scale: 1.01 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
            >
              <motion.button
                onClick={handleDeclineCookies}
                className="absolute top-1 right-1 p-2 rounded-full hover:bg-muted/50 transition-colors"
                whileHover="hover"
                whileTap="tap"
                aria-label="Close cookie banner"
              >
                <X className="h-4 w-4" />
              </motion.button>

              <div className="flex flex-col items-start sm:items-center gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <motion.div
                    className="flex-shrink-0"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Cookie className="h-6 w-6" />
                    </div>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h5 className="mb-1 text-base">We value your privacy</h5>
                    <p className="text-muted-foreground text-sm">
                      We use cookies to enhance your browsing experience,
                      provide personalized content, and analyze our traffic. By
                      clicking "Accept All", you consent to our use of{" "}
                      <Link href="/cookie-policy">cookies</Link>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-rows-3 xs:grid-rows-1 xs:grid-cols-3 gap-3 w-full">
                  <Button
                    variant="ghost"
                    onClick={handleDeclineCookies}
                    className="w-full xs:w-auto rounded-full border border-border"
                  >
                    <X />
                    Decline
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAcceptCookies}
                    className="w-full xs:w-auto rounded-full"
                  >
                    <Check />
                    Accept All
                  </Button>
                  <CookiePreferences onClose={() => setIsVisible(false)}>
                    <Button
                      variant="accent"
                      className="w-full xs:w-auto rounded-full"
                    >
                      <Settings />
                      Customize
                    </Button>
                  </CookiePreferences>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
