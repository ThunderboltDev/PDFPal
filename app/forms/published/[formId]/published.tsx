"use client";

import { ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Form } from "@/firebase/types";
import { fetchFormById } from "@/firebase/forms";
import withConfetti, { type WithConfettiProps } from "@/hoc/with-confetti";
import OverlayLoader from "@/components/ui/overlay-loader";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/forms/copy-button";
import ShareButton from "@/components/forms/share-button";
import ViewButton from "@/components/forms/view-button";
import { motion, useAnimation } from "framer-motion";

function PublishedForm({ triggerConfetti }: WithConfettiProps) {
  const router = useRouter();
  const controls = useAnimation();

  const { formId } = useParams();

  const [form, setForm] = useState<Form | null>(null);

  const formUrl = `${window.location.origin}/forms/${formId}` as const;

  useEffect(() => {
    if (form) triggerConfetti();
  }, [form, triggerConfetti]);

  useEffect(() => {
    const fetchForm = async () => {
      const form = await fetchFormById(String(formId));
      setForm(form);
    };

    fetchForm();
  }, [formId]);

  if (!form) return <OverlayLoader loading />;

  const handleConfettiClick = () => {
    controls.start({
      x: [0, -8, 8, -4, 4, 0],
      y: [0, 2, -8, 0, -2, 0],
      rotate: [0, -15, 15, -10, 10, 0],
      transition: { duration: 0.75, ease: "circInOut" },
    });

    setTimeout(triggerConfetti, 600);
  };

  return (
    <div className="w-screen h-screen grid place-items-center bg-linear-180 from-bg-200/50 via-bg-100 to-accent/10">
      <div className="w-fit px-6 mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl">
          <span className="block sm:inline-block font-medium gradient-text-accent">
            {form.title || "Untitled Form"}
          </span>{" "}
          is now live!{" "}
          <motion.button
            onClick={handleConfettiClick}
            animate={controls}
            initial={false}
            type="button"
          >
            🎉
          </motion.button>
        </h1>
        <p className="mt-5 font-normal sm:text-lg text-fg-200 text-center">
          You can share this link with anyone to collect responses:
        </p>
        <div className="mt-3 w-fit max-w-[calc(100vw-4rem)] mx-auto flex gap-3">
          <div className="min-w-0 flex-1 gradient-border rounded-md">
            <span className="block px-3 py-2 bg-bg-200 rounded-sm whitespace-nowrap truncate text-sm select-text">
              {formUrl}
            </span>
          </div>
          <CopyButton formId={form.id} />
          <ViewButton formId={form.id} />
          <ShareButton form={form} />
        </div>
        <div className="w-full mt-6 flex justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="default"
            size="small"
          >
            {" "}
            Back to Dashboard
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withConfetti(PublishedForm);
