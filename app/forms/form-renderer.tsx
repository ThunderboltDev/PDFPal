"use client";

import type { Form, DraftFormResponse } from "@/firebase/types";
import RenderField from "./[formId]/field-renderer";

type DynamicFormRendererProps = {
  form: Form;
  response: DraftFormResponse;
  setResponse: (response: DraftFormResponse) => void;
};

export function DynamicFormRenderer({
  form,
  response,
  setResponse,
}: DynamicFormRendererProps) {
  const updateField = (
    fieldId: string,
    newValue: string | number | boolean | null
  ) => {
    response.answers[fieldId] = newValue;
    setResponse(response);
  };

  return (
    <div className="space-y-4 mt-18 container-sm">
      <h2>{form.title}</h2>
      <p>{form.description}</p>
      {form.fields.map((field) => (
        <RenderField
          key={field.id}
          field={field}
          response={response}
          update={updateField}
        />
      ))}
    </div>
  );
}
