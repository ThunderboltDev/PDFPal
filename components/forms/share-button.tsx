import { Share } from "lucide-react";

import { useCallback } from "react";
import { Form } from "@/firebase/types";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ShareButton({
  form,
  className = "",
}: {
  form: Form;
  className?: string;
}) {
  const formUrl = `${window.location.origin}/forms/${form.id}` as const;

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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Button
            className={className}
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
  );
}
