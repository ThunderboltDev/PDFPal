import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "react-use";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CopyButton({ formId }: { formId: string }) {
  const [copiedState, copyToClipboard] = useCopyToClipboard();

  const formUrl = `${window.location.origin}/forms/${formId}` as const;

  return (
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
              {copiedState.value ? "URL Copied!" : "Copy URL"}
            </span>
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {copiedState.value ? "URL Copied!" : "Copy URL"}
      </TooltipContent>
    </Tooltip>
  );
}
