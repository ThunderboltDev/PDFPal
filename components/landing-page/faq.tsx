"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqs = [
  {
    question: "Do I need a credit card to start?",
    answer:
      "Nope! You can start for free without entering any payment details.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your PDFs are processed securely, and we never share your data.",
  },
  {
    question: "Can I use multiple PDFs?",
    answer: "Absolutely. Upload and chat with as many files as you need.",
  },
  {
    question: "What's included in the Free Plan?",
    answer:
      "Basic chat features with limited monthly usage. Upgrade anytime for Pro features.",
  },
];

export default function FAQ() {
  return (
    <section className="container-3xl py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2>Frequently Asked Questions</h2>
        <p className="mt-3 text-secondary-foreground">
          Quick answers to common questions.
        </p>
      </motion.div>

      <Accordion
        type="single"
        className="mt-10"
        collapsible
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className=""
          >
            <AccordionTrigger className="">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
