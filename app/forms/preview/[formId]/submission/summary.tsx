"use client";

import { useState } from "react";
import { useLocalStorage, useMount } from "react-use";
import { useParams } from "next/navigation";
import { LocalForm, LocalFormResponse } from "@/firebase/types";
import FormResponseSummary from "@/app/forms/components/summary";
import OverlayLoader from "@/components/ui/overlay-loader";

export default function PreviewSummary() {
  const { formId } = useParams();
  const [mounted, setMounted] = useState(false);

  const formKey = `draft-form-${formId}`;
  const responseKey = `form-response-${formId}`;

  const [form] = useLocalStorage<LocalForm | null>(formKey, null);
  const [response] = useLocalStorage<LocalFormResponse | null>(
    responseKey,
    null
  );

  useMount(() => setMounted(true));

  if (!form || !response || !mounted) return <OverlayLoader loading />;

  return (
    <div className="mt-20">
      <h2>Your Submission</h2>
      <FormResponseSummary
        form={form}
        response={response}
      />
    </div>
  );
}
