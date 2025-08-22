"use client";

import { fieldTypeToLabel } from "@/components/forms/field-config";
import { InputRendererProps } from "../[formId]/field-renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { basicValidation, ErrorMessage } from "./validation";

export default function TextInput({
  field,
  response,
  update,
}: InputRendererProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const err = basicValidation(field, value);
    if (err) {
      setError(error);
    }

    update(field.id, value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <Input
        type="text"
        id={field.id}
        name={field.id}
        value={response.answers[field.id] as string}
        placeholder={field.placeholder || fieldTypeToLabel[field.type]}
        onChange={handleChange}
        required={field.required}
        minLength={field.minLength ?? 0}
        maxLength={field.maxLength ?? 20}
        aria-invalid={!!error}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
