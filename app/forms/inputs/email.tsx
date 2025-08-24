"use client";

import { fieldTypeToLabel } from "@/components/forms/field-config";
import { InputRendererPropsWithErrorHandling } from "../components/field-renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";
import { ErrorMessage, validateField } from "../components/validation";

export default function EmailInput({
  field,
  response,
  update,
  error,
  setError,
}: InputRendererPropsWithErrorHandling) {
  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const err = validateField(field, value);
    setError(err || null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    update(field.id, e.target.value);
  };

  return (
    <div>
      <Label
        htmlFor={field.id}
        required={field.required}
        className="mb-2"
      >
        {field.label}
      </Label>
      <Input
        type="email"
        autoComplete="email"
        id={field.id}
        name={field.id}
        onBlur={handleBlur}
        onChange={handleChange}
        value={(response.answers[field.id] as string) || ""}
        placeholder={field.placeholder || fieldTypeToLabel[field.type]}
        required={field.required}
        minLength={field.minLength ?? 0}
        maxLength={field.maxLength ?? 25}
        aria-invalid={!!error}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
