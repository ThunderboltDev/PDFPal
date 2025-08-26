"use client";

import { ArrowRight } from "lucide-react";

import type { Form, LocalFormResponse, LocalForm } from "@/firebase/types";
import RenderField from "./field-renderer";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { validateField } from "./validation";

type DynamicFormRendererProps = {
  form: Form | LocalForm;
  response: LocalFormResponse;
  setResponse: (response: LocalFormResponse) => void;
  onSubmit: (response: LocalFormResponse) => void;
};

export function DynamicFormRenderer({
  form,
  response,
  setResponse,
  onSubmit,
}: DynamicFormRendererProps) {
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const updateField = (
    fieldId: string,
    newValue: string | number | boolean | null
  ) => {
    response.answers[fieldId] = newValue;
    setResponse(response);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string | null> = {};

    for (const field of form.fields) {
      const error = validateField(
        field,
        (response.answers[field.id] as string) || ""
      );

      if (error) newErrors[field.id] = error;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstElementId = Object.keys(newErrors)[0];
      const invalidElement: HTMLElement | null = e.currentTarget.querySelector(
        `[id="${firstElementId}"]`
      );

      invalidElement?.focus();

      return;
    }

    onSubmit(response);
  };

  return (
    <form
      className="space-y-4 mt-18 container-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      {form.fields.map((field) => (
        <RenderField
          key={field.id}
          field={field}
          response={response}
          update={updateField}
          error={errors[field.id] ?? null}
          setError={(error: string | null) =>
            setErrors((prev) => ({ ...prev, [field.id]: error }))
          }
        />
      ))}
      <Button
        type="submit"
        variant="accent"
        className="mt-4 mb-16"
      >
        Submit <ArrowRight />
      </Button>
    </form>
  );
}
