"use client";

import { Check, Copy, ExternalLink, Share } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import type { Form } from "@/firebase/types";
import { fetchFormById } from "@/firebase/forms";
import withConfetti, { type WithConfettiProps } from "@/hoc/with-confetti";
import OverlayLoader from "@/components/ui/overlay-loader";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function PublishedForm({ triggerConfetti }: WithConfettiProps) {
  const router = useRouter();
  const { formId } = useParams();

  const [form, setForm] = useState<Form | null>(null);
  const [copiedState, copyToClipboard] = useCopyToClipboard();

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

  const handleShare = useCallback(async () => {
    const shareData: ShareData = {
      title: `Please fill this form: ${form?.title}`,
      text: form?.description.substring(0, 125),
      url: formUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Share Failed:", error);
      }
    }
  }, [formUrl, form]);

  if (!form) return <OverlayLoader loading />;

  return (
    <div className="w-screen h-screen grid place-items-center bg-linear-180 from-bg-200/50 via-bg-100 to-accent/10">
      <div className="w-fit px-6 mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl">
          <span className="block sm:inline-block font-medium gradient-text-accent">
            {form.title || "Untitled Form"}
          </span>{" "}
          is now live! 🎉
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={() => copyToClipboard(formUrl)}
                  variant="blue"
                  size="icon"
                >
                  {copiedState.value ? <Check /> : <Copy />}
                  <span className="sr-only">
                    {copiedState.value ? "Text Copied!" : "Copy Text"}
                  </span>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {copiedState.value ? "Text Copied!" : "Copy Text"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={() => router.push(formUrl)}
                  variant="accent"
                  size="icon"
                >
                  <ExternalLink />
                  <span className="sr-only">View Form</span>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>View Form</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={handleShare}
                  variant="green"
                  size="icon"
                >
                  <Share />
                  <span className="sr-only">Share Your Form</span>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>Share Your Form</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default withConfetti(PublishedForm);
