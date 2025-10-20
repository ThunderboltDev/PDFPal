"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { motion } from "framer-motion";
import Link from "next/link";
import config from "@/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqs = [
  {
    question: "Do I need a credit card to start?",
    answer: (
      <>
        <span className="font-semibold">Nope</span>! You can start for free
        without entering any payment details. Just{" "}
        <Link href="/auth?utm_source=faq_section&utm_medium=link&utm_campaign=signup">
          create an account
        </Link>{" "}
        and you&apos;re good to go!
      </>
    ),
  },
  {
    question: "Can I upload multiple PDFs?",
    answer: (
      <>
        Absolutely. You can upload up to{" "}
        <span className="font-semibold">{config.plans.free.maxFiles} PDFs</span>{" "}
        with the{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Free Plan",
            })
          }
        >
          Free Plan
        </Link>{" "}
        and up to{" "}
        <span className="font-semibold">{config.plans.pro.maxFiles} PDFs</span>{" "}
        with the{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Pro Plan",
            })
          }
        >
          Pro Plan
        </Link>
        . Currently you can only chat with one PDF at a time.
      </>
    ),
  },
  {
    question: "What's included in the Free Plan?",
    answer: (
      <>
        In the{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Free Plan",
            })
          }
        >
          Free Plan
        </Link>
        , you can upload up to{" "}
        <span className="font-semibold">{config.plans.free.maxFiles} PDFs</span>{" "}
        with a max file size of {config.plans.free.maxFileSize} and maximum{" "}
        {config.plans.free.maxPages} and chat with them as much as you want!
        Upgrade to{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Pro Plan",
            })
          }
        >
          Pro Plan
        </Link>{" "}
        to increase these limits.
      </>
    ),
  },
  {
    question: "What's the difference between Free and Pro plans?",
    answer: (
      <>
        In the{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Free Plan",
            })
          }
        >
          Free Plan
        </Link>
        , you get limited number of PDFs to upload, smaller file size, page
        limits and unlimited chats with Standard AI Model. While in the{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Pro Plan",
            })
          }
        >
          Pro Plan
        </Link>
        , you get to experience higher max file size, higher PDF upload limit
        and Advanced AI model! Visit{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Pricing",
            })
          }
        >
          Pricing
        </Link>{" "}
        for more info.
      </>
    ),
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: (
      <>
        <span className="font-semibold">
          You can cancel your subscription anytime
        </span>{" "}
        by going to the <Link href="/billing">Billing</Link> page.
      </>
    ),
  },
  {
    question: "Do you store my files permanently?",
    answer: (
      <>
        Your files are stored securely until you delete them by going to the{" "}
        <Link href="/dashboard">Dashboard</Link>. You can view your uploaded
        files anywhere and anytime from the{" "}
        <Link href="/dashboard">Dashboard</Link>.
      </>
    ),
  },
  {
    question: "Can I switch plans?",
    answer: (
      <>
        Yes, you can switch your selected plan anytime by going to the{" "}
        <Link href="/billing">Billing Page</Link>. By default every user is on
        the{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Free Plan",
            })
          }
        >
          Free Plan
        </Link>{" "}
        and can upgrade to{" "}
        <Link
          href="/pricing?utm_source=app&utm_medium=link&utm_campaign=faq-section#billing-period-toggle"
          onClick={() =>
            sendGTMEvent({
              value: 1,
              event: "subscription_action",
              action: "pricing_click",
              button_name: "Pro Plan",
            })
          }
        >
          Pro Plan
        </Link>{" "}
        whenever they want.
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <section className="container-3xl py-16">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2>Frequently Asked Questions</h2>
        <p className="mt-3 text-center text-secondary-foreground">
          Quick answers to common questions.
        </p>
      </motion.div>

      <Accordion className="mt-10" collapsible type="single">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
