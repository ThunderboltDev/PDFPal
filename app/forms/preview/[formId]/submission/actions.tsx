"use client";

import { ArrowLeft, BrushCleaning } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PreviewResponseActions() {
  const { formId } = useParams();
  const router = useRouter();

  const clearResponse = () => {
    localStorage.removeItem(`form-response-${formId}`);
    router.push(`/forms/edit/${formId}`);
  };

  return (
    <div className="mt-4 mb-16 mx-auto w-42 flex flex-col gap-4 items-center">
      <Button
        variant="blue"
        size="default"
        className="w-full"
        onClick={clearResponse}
      >
        <BrushCleaning /> Clear Answers
      </Button>
      <Button
        variant="accent"
        size="default"
        className="w-full"
        onClick={() => router.push(`/forms/preview/${formId}`)}
      >
        <ArrowLeft /> Back to Preview
      </Button>
    </div>
  );
}
