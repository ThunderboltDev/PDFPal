"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchFormById } from "@/firebase/forms";
import { DynamicFormRenderer } from "../components/form-renderer";
import OverlayLoader from "@/components/ui/overlay-loader";
import { Form, LocalFormResponse } from "@/firebase/types";
import { useLocalStorage } from "react-use";

export default function FormSubmission() {
  const { formId } = useParams();
  const [form, setForm] = useState<Form | null>();
  const [response, setResponse] = useLocalStorage<LocalFormResponse>(
    `form-response-${formId}`,
    {
      id: crypto.randomUUID(),
      answers: {},
    }
  );

  useEffect(() => {
    const fetchForm = async () => {
      const form = await fetchFormById(String(formId));
      if (form) setForm(form);
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = (response: LocalFormResponse) => {
    response.hasSubmitted = true;
    setResponse(response);
    alert(`Response receieved: ${response}`);
  };

  if (!form || !response) return <OverlayLoader loading />;

  return (
    <DynamicFormRenderer
      form={form}
      response={response}
      setResponse={setResponse}
      onSubmit={handleSubmit}
    />
  );
}
