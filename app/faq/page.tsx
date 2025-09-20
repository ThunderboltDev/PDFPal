import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import config from "@/config";

const plans = config.plans;

const faqs = [
  {
    question: "What is PDF Pal about?",
    answer:
      "PDF Pal is a platform that allows users to upload and chat with PDFs using AI technology.",
  },
  {
    question: "How does PDF Pal work?",
    answer:
      "Users can upload their PDF documents, and our AI will analyze the content to provide answers to their questions.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we prioritize user privacy and data security. All uploaded documents are stored securely.",
  },
  {
    question: "What types of PDFs can I upload?",
    answer:
      "You can upload any standard PDF document, including text-based and image-based PDFs.",
  },
  {
    question: "Is there a limit to the number of PDFs I can upload?",
    answer: (
      <>
        Currently, users can only upload {plans.free.maxFiles} PDFs. However,
        you can upgrade to the <Link href="/pricing#pro">Pro Plan</Link> to
        increase this limit to {plans.pro.maxFiles}.
      </>
    ),
  },
  {
    question: "How accurate are the AI responses?",
    answer:
      "Our AI is trained on a vast amount of data to provide accurate answers whenever possible. However, the accuracy may vary based on the complexity of the questions and the content of the PDFs. We recommend reviewing the AI's responses for critical information.",
  },
  {
    question: "Can I delete my uploaded PDFs?",
    answer: (
      <>
        Yes, users have the option to delete their uploaded PDFs at any time
        from the <Link href="/dashboard">Dashboard</Link>.
      </>
    ),
  },
  {
    question: "Is PDF Pal free to use?",
    answer:
      "Yes, PDF Pal is completely free to use. However, we also offer a Pro Plan with additional features.",
  },
  {
    question: "How can I contact support?",
    answer: (
      <>
        You can contact support by going to the{" "}
        <Link href="/contact">Contact Page</Link>. Or you can reach out to use
        by emailing{" "}
        <Link
          href={`mailto:${config.socials.email}`}
          target="_blank"
        >
          {config.socials.email}
        </Link>
      </>
    ),
  },
  {
    question: "Can I chat with multiple PDFs at the same time?",
    answer: <>Currently, you can only chat with one PDF at a time.</>,
  },
];

export default function FAQ() {
  return (
    <div className="container-7xl mt-20">
      <h2 className="text-center mb-8">Frequently Asked Questions</h2>
      <p>
        We&apos;ve answered some of the common questions about PDF Pal. If you{" "}
        still have questions, feel free to{" "}
        <Link
          href="/contact"
          className="underline"
        >
          contact us
        </Link>
        .
      </p>
      <Accordion
        type="single"
        className="mt-10"
        collapsible
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
          >
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-4 mb-12">
        Still can&apos;t find the answer you&apos;re looking for?{" "}
        <Link href="/contact">Contact us</Link> or email us at{" "}
        <Link
          href={`mailto:${config.socials.email}`}
          target="_blank"
        >
          {config.socials.email}
        </Link>
      </p>
    </div>
  );
}
