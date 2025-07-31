"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import { fetchFormById } from "@/firebase/forms";
import type { Form } from "@/firebase/types";
import withConfetti, { type WithConfettiProps } from "@/hoc/with-confetti";
import OverlayLoader from "@/components/ui/overlay-loader";
import { Button } from "@/components/ui/button";

function PublishedForm({ triggerConfetti }: WithConfettiProps) {
  const { formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [copiedState, copyToClipboard] = useCopyToClipboard();

  const formUrl = `${window.location.origin}/forms/${formId}`;

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

  return (
    <div className="max-w-lg mx-auto px-4">
      <h1>
        🎉 <span className="font-semibold">{form.title}</span> is now live!
      </h1>
      <p className="text-fg-300">
        You can share this link with anyone to collect responses:
      </p>
      <div className="bg-gray-100 rounded p-3 flex items-center justify-between gap-2">
        <span className="truncate text-sm">{formUrl}</span>
        <Button
          onClick={() => copyToClipboard(formUrl)}
          size="default"
        >
          {copiedState.value ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

export default withConfetti(PublishedForm);
