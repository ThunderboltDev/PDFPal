"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "react-use";
import { DynamicFormRenderer } from "../../components/form-renderer";
import OverlayLoader from "@/components/ui/overlay-loader";
import { LocalFormResponse } from "@/firebase/types";
import PreviewNavbar from "./navbar";

export default function FormSubmission() {
  const { formId } = useParams();
  const router = useRouter();

  const formKey = `draft-form-${formId}`;
  const responseKey = `form-response-${formId}`;

  const [response, setResponse] = useLocalStorage<LocalFormResponse>(
    responseKey,
    {
      id: crypto.randomUUID(),
      answers: {},
    }
  );

  const subscribe = (callback: () => void) => {
    const handler = (e: StorageEvent) => {
      if (e.key === formKey) callback();
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  };

  const getSnapshot = () => localStorage.getItem(formKey);

  const draft = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const handleSubmit = () => {
    router.push(`/forms/preview/${formId}/submission`);
  };

  if (!draft || !response) return <OverlayLoader loading />;

  return (
    <>
      <PreviewNavbar formId={formId as string} />
      <DynamicFormRenderer
        form={draft ? JSON.parse(draft) : null}
        response={response}
        setResponse={setResponse}
        onSubmit={handleSubmit}
      />
    </>
  );
}
