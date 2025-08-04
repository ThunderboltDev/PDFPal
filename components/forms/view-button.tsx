import { ExternalLink } from "lucide-react";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ViewButton({ formId }: { formId: string }) {
  const formUrl = `${window.location.origin}/forms/${formId}` as const;

  const handleClick = () => {
    window.open(formUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Button
            onClick={handleClick}
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
  );
}
